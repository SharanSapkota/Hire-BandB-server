import { PaymentService } from "./base";
import Stripe from "stripe";
import { createPaymentTransaction } from "../../repositories/paymentRepository";

export class StripePaymentService extends PaymentService {
    constructor() {
        super();
    }

    async createPaymentTransaction(data: any): Promise<any> {
        const paymentIntent = await this.createPaymentIntent(data);
        const paymentTransaction = await this.createStrpePayment({
            amount: data.amount,
            currency: data.currency,
            paymentMethodId: data.paymentMethodId,
            paymentStatus: 'PENDING',
            paymentIntent: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
        });

        return paymentTransaction;
    }

    async createPaymentIntent(data: any): Promise<any> {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.currency,
        });

        return {
            paymentIntent: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
        };
    }

    async createStrpePayment(data: any): Promise<any> {
        const paymentTransaction = await createPaymentTransaction({
            amount: data.amount,
            currency: data.currency,
            paymentMethodId: data.paymentMethodId,
            paymentStatus: 'PENDING',
            paymentIntent: data.paymentIntent,
            clientSecret: data.clientSecret,
        })

        return paymentTransaction;
    }  
}

