import { PaymentGatewayAdapter, CreatePaymentResult, WebhookVerificationResult } from './payment.interface';
import { Order, Env } from '../types';

export class ZafewAdapter implements PaymentGatewayAdapter {
  readonly gatewayName = 'zafew';

  async createPayment(order: Order, env: Env): Promise<CreatePaymentResult> {
    const apiKey = env.ZAFEW_API_KEY;
    const merchantId = env.ZAFEW_MERCHANT_ID;
    const frontendUrl = env.FRONTEND_URL || 'https://katdijital.ht';

    // Mode fallback local / démo si les clés Zafew ne sont pas encore renseignées dans wrangler
    if (!apiKey || !merchantId) {
      console.warn('ZAFEW_API_KEY ou ZAFEW_MERCHANT_ID non renseigné. Utilisation du mode simulation Zafew.');
      return {
        paymentUrl: `${frontendUrl}/?payment_status=success_demo&order_id=${order.id}`,
        gatewayRef: `zafew_demo_${order.id}_${Date.now()}`
      };
    }

    const payload = {
      merchant_id: merchantId,
      order_id: order.id,
      amount: order.amount_paid,
      currency: 'HTG',
      phone_number: order.phone_number || '',
      description: `KatDijital - Carte de vœux pour ${order.recipient_name}`,
      return_url: `${frontendUrl}/?order_id=${order.id}`,
      cancel_url: `${frontendUrl}/?payment_status=cancelled`,
      webhook_url: `${frontendUrl}/api/webhooks/zafew`
    };

    try {
      const response = await fetch('https://api.zafew.com/v1/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Erreur API Zafew:', errText);
        throw new Error(`Erreur lors de l'initialisation du paiement Zafew (${response.status})`);
      }

      const data: any = await response.json();
      return {
        paymentUrl: data.payment_url || data.checkout_url || `${frontendUrl}/?order_id=${order.id}`,
        gatewayRef: data.transaction_id || data.reference || `zafew_${order.id}`
      };
    } catch (err: any) {
      console.error('Échec de la requête Zafew:', err);
      // Fallback gracieux en cas d'indisponibilité du service Zafew
      return {
        paymentUrl: `${frontendUrl}/?order_id=${order.id}&status=pending`,
        gatewayRef: `zafew_fallback_${order.id}`
      };
    }
  }

  async verifyWebhook(request: Request, bodyText: string, env: Env): Promise<WebhookVerificationResult> {
    try {
      const payload = JSON.parse(bodyText);

      // Extraction des champs standards IPN / Webhook Zafew
      const orderId = payload.order_id || payload.custom_data?.order_id;
      const gatewayRef = payload.transaction_id || payload.reference || payload.id;
      const status = (payload.status || payload.event || '').toLowerCase();
      const isPaid = status === 'paid' || status === 'completed' || status === 'success' || payload.code === '200';
      const eventId = payload.event_id || payload.transaction_id || `zafew_evt_${orderId}_${Date.now()}`;

      // Validation basique de sécurité si une clé secrète webhook est configurée
      const secret = env.ZAFEW_WEBHOOK_SECRET;
      let isValid = true;

      if (secret) {
        const headerSignature = request.headers.get('x-zafew-signature') || request.headers.get('authorization');
        if (!headerSignature || !headerSignature.includes(secret)) {
          console.warn('Signature Webhook Zafew invalide ou absente.');
          isValid = false;
        }
      }

      return {
        isValid,
        orderId,
        gatewayRef,
        isPaid,
        amount: payload.amount ? parseFloat(payload.amount) : undefined,
        currency: payload.currency || 'HTG',
        eventId,
        rawPayload: payload
      };
    } catch (e: any) {
      console.error('Erreur de parsing du webhook Zafew:', e);
      return {
        isValid: false,
        isPaid: false
      };
    }
  }
}
