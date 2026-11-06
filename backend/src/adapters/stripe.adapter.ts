import Stripe from 'stripe';
import { PaymentGatewayAdapter, CreatePaymentResult, WebhookVerificationResult } from './payment.interface';
import { Order, Env } from '../types';

export class StripeAdapter implements PaymentGatewayAdapter {
  readonly gatewayName = 'stripe';

  async createPayment(order: Order, env: Env): Promise<CreatePaymentResult> {
    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    const frontendUrl = env.FRONTEND_URL || 'https://katdijital.ht';

    if (!stripeSecretKey) {
      console.warn('STRIPE_SECRET_KEY non renseigné. Mode simulation Stripe activé.');
      return {
        paymentUrl: `${frontendUrl}/?payment_status=success_demo&order_id=${order.id}`,
        gatewayRef: `stripe_demo_${order.id}_${Date.now()}`
      };
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `KatDijital - Carte de vœux (${order.recipient_name})`,
              description: `De la part de ${order.sender_name}`
            },
            unit_amount: Math.round(order.amount_paid * 100) // Montant en cents ($2.99 -> 299)
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      client_reference_id: order.id,
      customer_email: order.customer_email || undefined,
      success_url: `${frontendUrl}/?order_id=${order.id}&payment=success`,
      cancel_url: `${frontendUrl}/?payment=cancelled`,
      metadata: {
        order_id: order.id,
        recipient_name: order.recipient_name
      }
    });

    return {
      paymentUrl: session.url || `${frontendUrl}/?order_id=${order.id}`,
      gatewayRef: session.id
    };
  }

  async verifyWebhook(request: Request, bodyText: string, env: Env): Promise<WebhookVerificationResult> {
    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
      // Fallback sans vérification stricte en mode dev local sans secret
      try {
        const payload = JSON.parse(bodyText);
        const session = payload.data?.object;
        return {
          isValid: true,
          orderId: session?.client_reference_id || session?.metadata?.order_id,
          gatewayRef: session?.id,
          isPaid: payload.type === 'checkout.session.completed',
          amount: session?.amount_total ? session.amount_total / 100 : undefined,
          currency: session?.currency?.toUpperCase() || 'USD',
          eventId: payload.id || `stripe_evt_${Date.now()}`,
          rawPayload: payload
        };
      } catch (e) {
        return { isValid: false, isPaid: false };
      }
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' as any });
    const signature = request.headers.get('stripe-signature') || '';

    try {
      const event = await stripe.webhooks.constructEventAsync(bodyText, signature, webhookSecret);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          isValid: true,
          orderId: session.client_reference_id || session.metadata?.order_id,
          gatewayRef: session.id,
          isPaid: session.payment_status === 'paid',
          amount: session.amount_total ? session.amount_total / 100 : undefined,
          currency: session.currency?.toUpperCase() || 'USD',
          eventId: event.id,
          rawPayload: event
        };
      }

      return {
        isValid: true,
        isPaid: false,
        eventId: event.id,
        rawPayload: event
      };
    } catch (err: any) {
      console.error('Échec de vérification du webhook Stripe:', err.message);
      return {
        isValid: false,
        isPaid: false
      };
    }
  }
}
