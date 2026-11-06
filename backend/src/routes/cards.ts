import { Hono } from 'hono';
import { Env } from '../types';
import { getSupabase } from '../db/supabase';

export const cardsRouter = new Hono<{ Bindings: Env }>();

cardsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const supabase = getSupabase(c.env);

  // 1. Récupération de la carte active via son slug public
  const { data: card, error: cardErr } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single();

  if (cardErr || !card) {
    return c.json({ error: 'Carte introuvable ou non débloquée' }, 404);
  }

  // 2. Récupération des données de la commande
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('*')
    .eq('id', card.order_id)
    .single();

  if (orderErr || !order) {
    return c.json({ error: 'Données de la carte corrompues' }, 500);
  }

  // 3. Récupération du modèle
  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('id', order.template_id)
    .single();

  // 4. Incrémentation atomique du nombre de vues
  c.executionCtx.waitUntil(
    supabase
      .from('cards')
      .update({
        views_count: (card.views_count || 0) + 1,
        last_viewed_at: new Date().toISOString()
      })
      .eq('id', card.id)
  );

  return c.json({
    card,
    order: {
      id: order.id,
      sender_name: order.sender_name,
      recipient_name: order.recipient_name,
      message_content: order.message_content,
      heading: order.heading,
      music_id: order.music_id,
      created_at: order.created_at
    },
    template
  });
});
