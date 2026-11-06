import { Hono } from 'hono';
import { Env } from '../types';
import { getSupabase } from '../db/supabase';

export const opengraphRouter = new Hono<{ Bindings: Env }>();

// Regex détectant les robots de messagerie et réseaux sociaux
const BOT_USER_AGENTS = /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|TelegramBot|SkypeUriPreview|Slackbot|Discordbot/i;

opengraphRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const userAgent = c.req.header('user-agent') || '';
  const frontendUrl = c.env.FRONTEND_URL || 'https://katdijital.ht';
  const supabase = getSupabase(c.env);

  // Récupération de la carte et de la commande
  const { data: card } = await supabase.from('cards').select('order_id').eq('slug', slug).single();
  let recipientName = 'zanmi m';
  let senderName = 'yon fanmi';
  let heading = 'Bèl Kat Ve & Swè Dijital';

  if (card) {
    const { data: order } = await supabase.from('orders').select('recipient_name, sender_name, heading').eq('id', card.order_id).single();
    if (order) {
      recipientName = order.recipient_name;
      senderName = order.sender_name;
      heading = order.heading || heading;
    }
  }

  // Si c'est un navigateur humain, redirection immédiate vers l'application React SPA
  if (!BOT_USER_AGENTS.test(userAgent)) {
    return c.redirect(`${frontendUrl}/?c=${slug}`, 302);
  }

  // Si c'est un crawler (WhatsApp, iMessage, etc.), envoi du HTML enrichi Open Graph
  const title = `${senderName} voye yon bèl kat swè pou ${recipientName} !`;
  const description = `${heading} • Klike pou ouvri anvlòp 3D personalized la sou KatDijital.`;
  const imageUrl = `${frontendUrl}/assets/hero.png`;
  const cardUrl = `${frontendUrl}/c/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="ht">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${cardUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body>
  <p>${title}</p>
  <p><a href="${frontendUrl}/?c=${slug}">Klike la a pou wè kat la</a></p>
</body>
</html>`;

  return c.html(html);
});
