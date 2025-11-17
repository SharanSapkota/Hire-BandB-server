import { PaymentService } from "./base";
import Stripe from "stripe";
import { createPaymentTransaction } from "../../repositories/paymentRepository";

export class StripePaymentService extends PaymentService {
    constructor() {
        super();
    }

    async createPaymentTransaction(data: any): Promise<any> {
    const secretKey = process.env.STRIPE_SECRET_KEY;
        const stripe = new Stripe(secretKey || '');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.currency || 'EUR',
            metadata: {
                bookingId: data.bookingId,
            },
            transfer_data: {
                destination: data.receiverStripeAccountId,
              },
        });

        return {
            paymentIntent: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            amount: data.amount,
            currency: data.currency || 'EUR',
        };
    }

    async createPaymentIntent(data: any): Promise<any> {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.currency,
            metadata: {
                bookingId: data.bookingId,
            },
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

