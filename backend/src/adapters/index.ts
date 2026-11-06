import { PaymentGatewayAdapter } from './payment.interface';
import { ZafewAdapter } from './zafew.adapter';
import { StripeAdapter } from './stripe.adapter';
import { PaymentGatewayType } from '../types';

export function getPaymentAdapter(gateway: PaymentGatewayType): PaymentGatewayAdapter {
  switch (gateway) {
    case 'zafew':
    case 'moncash_direct':
      return new ZafewAdapter();
    case 'stripe':
      return new StripeAdapter();
    default:
      throw new Error(`Passerelle de paiement inconnue: ${gateway}`);
  }
}

export * from './payment.interface';
export * from './zafew.adapter';
export * from './stripe.adapter';
