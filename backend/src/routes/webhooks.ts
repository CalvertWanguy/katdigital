import { Hono } from 'hono';
import { customAlphabet } from 'nanoid';
import { Env, PaymentGatewayType } from '../types';
import { getSupabase } from '../db/supabase';
import { getPaymentAdapter } from '../adapters';

export const webhooksRouter = new Hono<{ Bindings: Env }>();

// Alphabet NanoID sûr pour URL (pas de caractères ambigus comme 0, O, l, I)
const generateSlug = customAlphabet('23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ', 10);

async function processPaymentWebhook(c: any, gateway: PaymentGatewayType) {
  const bodyText = await c.req.text();
  const supabase = getSupabase(c.env);
  const adapter = getPaymentAdapter(gateway);

  // 1. Vérification de la signature / authenticité du webhook
  const verification = await adapter.verifyWebhook(c.req.raw, bodyText, c.env);

  if (!verification.isValid) {
    return c.json({ error: 'Signature ou payload de webhook invalide' }, 401);
  }

  // 2. Traitement d'idempotence via la table webhook_logs
  if (verification.eventId) {
    const { data: existingLog } = await supabase
      .from('webhook_logs')
      .select('event_id')
      .eq('event_id', verification.eventId)
      .single();

    if (existingLog) {
      return c.json({ message: 'Événement déjà traité (Idempotence)' }, 200);
    }

    // Enregistrement de l'événement
    await supabase.from('webhook_logs').insert({
      event_id: verification.eventId,
      gateway,
      order_id: verification.orderId || null,
      payload: verification.rawPayload || {}
    });
  }

  if (!verification.isPaid || !verification.orderId) {
    return c.json({ message: 'Webhook reçu mais aucun paiement validé' }, 200);
  }

  // 3. Passage de la commande en statut 'paid'
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      gateway_ref: verification.gatewayRef || undefined,
      updated_at: new Date().toISOString()
    })
    .eq('id', verification.orderId)
    .select()
    .single();

  if (orderErr || !order) {
    console.error(`Commande ${verification.orderId} introuvable lors du webhook`, orderErr);
    return c.json({ error: 'Commande introuvable' }, 404);
  }

  // 4. Génération du slug unique et création de la carte publique
  const { data: existingCard } = await supabase
    .from('cards')
    .select('*')
    .eq('order_id', order.id)
    .single();

  if (!existingCard) {
    const slug = generateSlug();
    const { error: cardErr } = await supabase.from('cards').insert({
      order_id: order.id,
      slug
    });

    if (cardErr) {
      console.error('Erreur création de la carte publique:', cardErr);
      return c.json({ error: 'Échec de la génération de la carte' }, 500);
    }
  }

  return c.json({ success: true, message: 'Paiement confirmé et carte activée' }, 200);
}

webhooksRouter.post('/zafew', async (c) => {
  return processPaymentWebhook(c, 'zafew');
});

webhooksRouter.post('/stripe', async (c) => {
  return processPaymentWebhook(c, 'stripe');
});
