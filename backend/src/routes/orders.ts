import { Hono } from 'hono';
import { Env, CreateOrderPayload } from '../types';
import { getSupabase } from '../db/supabase';
import { getPaymentAdapter } from '../adapters';

export const ordersRouter = new Hono<{ Bindings: Env }>();

ordersRouter.post('/', async (c) => {
  try {
    const payload = await c.req.json<CreateOrderPayload>();

    // Validation des champs obligatoires
    if (!payload.template_id || !payload.sender_name || !payload.recipient_name || !payload.message_content) {
      return c.json({ error: 'Champs obligatoires manquants (template_id, sender_name, recipient_name, message_content)' }, 400);
    }

    const gateway = payload.gateway || 'zafew';
    const supabase = getSupabase(c.env);

    // 1. Récupération des infos du modèle
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', payload.template_id)
      .single();

    if (templateError || !template) {
      return c.json({ error: `Modèle de carte introuvable (${payload.template_id})` }, 404);
    }

    // Détermination du montant et de la devise
    const currency = gateway === 'stripe' ? 'USD' : 'HTG';
    const amountPaid = gateway === 'stripe' ? template.price_usd : template.price_htg;

    // 2. Insertion de la commande en statut 'pending'
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        template_id: payload.template_id,
        sender_name: payload.sender_name.trim(),
        recipient_name: payload.recipient_name.trim(),
        message_content: payload.message_content.trim(),
        heading: payload.heading || template.title,
        music_id: payload.music_id || template.default_music,
        gateway,
        amount_paid: amountPaid,
        currency,
        status: 'pending',
        phone_number: payload.phone_number?.trim(),
        customer_email: payload.customer_email?.trim()
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Erreur insertion commande:', orderError);
      return c.json({ error: 'Échec de la création de la commande en BDD' }, 500);
    }

    // 3. Appel de l'adapter de paiement
    const adapter = getPaymentAdapter(gateway);
    const paymentResult = await adapter.createPayment(order, c.env);

    // 4. Mise à jour de la référence de paiement
    if (paymentResult.gatewayRef) {
      await supabase
        .from('orders')
        .update({ gateway_ref: paymentResult.gatewayRef })
        .eq('id', order.id);
    }

    return c.json({
      success: true,
      order_id: order.id,
      payment_url: paymentResult.paymentUrl,
      gateway
    }, 201);
  } catch (err: any) {
    console.error('Erreur route POST /api/orders:', err);
    return c.json({ error: err.message || 'Erreur serveur interne' }, 500);
  }
});
