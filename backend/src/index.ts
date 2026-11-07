import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { ordersRouter } from './routes/orders';
import { webhooksRouter } from './routes/webhooks';
import { cardsRouter } from './routes/cards';
import { opengraphRouter } from './routes/opengraph';
import { emailsRouter } from './routes/emails';

const app = new Hono<{ Bindings: Env }>();

// Middleware CORS
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      // Autorise le domaine principal, le localhost dev et l'URL frontend
      if (!origin || origin.includes('katdijital.ht') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return origin || '*';
      }
      return c.env.FRONTEND_URL || 'https://katdijital.ht';
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-zafew-signature', 'stripe-signature'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400
  });
  return corsMiddleware(c, next);
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', service: 'katdijital-backend', timestamp: new Date().toISOString() }));

// Montage des routes d'API
app.route('/api/orders', ordersRouter);
app.route('/api/webhooks', webhooksRouter);
app.route('/api/cards', cardsRouter);
app.route('/api/send-kit-email', emailsRouter);
app.route('/api/emails', emailsRouter);

// Montage de la route SSR OpenGraph
app.route('/c', opengraphRouter);

// Gestion globale des erreurs 404
app.notFound((c) => c.json({ error: 'Endpoint non trouvé' }, 404));

// Gestion globale des exceptions
app.onError((err, c) => {
  console.error('Erreur globale non capturée:', err);
  return c.json({ error: 'Erreur interne du serveur backend' }, 500);
});

export default app;
