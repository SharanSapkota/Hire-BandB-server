import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateStripeCustomerParams {
  email: string;
  name: string;
  phone: string;
}

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCustomer(data: CreateStripeCustomerParams) {
    try {
      return await this.stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
      });
    } catch (error) {
      console.error('Error creating Stripe customer', error);
      throw error;
    }
  }
}
