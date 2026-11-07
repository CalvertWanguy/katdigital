// ====================================================================
// KatDijital Backend • TypeScript Types & Contracts
// ====================================================================

export type PaymentGatewayType = 'zafew' | 'stripe' | 'moncash_direct';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';
export type Currency = 'HTG' | 'USD';

export interface Env {
  ENVIRONMENT: string;
  FRONTEND_URL: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ZAFEW_API_KEY?: string;
  ZAFEW_MERCHANT_ID?: string;
  ZAFEW_WEBHOOK_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
}

export interface Template {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  format: 'envelope' | 'parchment' | 'bifold' | 'kraft_sheet';
  ambient_animation: string;
  default_music: string;
  price_htg: number;
  price_usd: number;
  is_active: boolean;
}

export interface Order {
  id: string;
  template_id: string;
  sender_name: string;
  recipient_name: string;
  message_content: string;
  heading?: string;
  music_id?: string;
  gateway: PaymentGatewayType;
  gateway_ref?: string;
  amount_paid: number;
  currency: Currency;
  status: PaymentStatus;
  phone_number?: string;
  customer_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  order_id: string;
  slug: string;
  views_count: number;
  last_viewed_at?: string;
  created_at: string;
}

export interface CreateOrderPayload {
  template_id: string;
  sender_name: string;
  recipient_name: string;
  message_content: string;
  heading?: string;
  music_id?: string;
  gateway: PaymentGatewayType;
  phone_number?: string;
  customer_email?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  payment_url: string;
  gateway: PaymentGatewayType;
}

export interface CardWithOrder {
  card: Card;
  order: Order;
  template?: Template;
}
