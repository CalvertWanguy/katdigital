import { Order, Env } from '../types';

export interface CreatePaymentResult {
  paymentUrl: string;
  gatewayRef: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderId?: string;
  gatewayRef?: string;
  isPaid: boolean;
  amount?: number;
  currency?: string;
  eventId?: string;
  rawPayload?: any;
}

export interface PaymentGatewayAdapter {
  readonly gatewayName: string;

  /**
   * Initialise une session ou demande de paiement auprès de la passerelle
   */
  createPayment(order: Order, env: Env): Promise<CreatePaymentResult>;

  /**
   * Vérifie l'authenticité et le statut d'un webhook entrant
   */
  verifyWebhook(request: Request, bodyText: string, env: Env): Promise<WebhookVerificationResult>;
}
