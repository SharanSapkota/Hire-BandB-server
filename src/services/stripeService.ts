import Stripe from 'stripe';
import { UserService } from './userService';
import { FRONTEND_URL } from '../config/app.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateStripeCustomerParams {
  email: string;
  name: string;
  phone: string;
}

export class StripeService {
  private stripe: Stripe;
  private userService: UserService;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    this.userService = new UserService();
  }

  async createCustomer(data: any) {
    try {
      const userWithPaymentMode: any = await this.userService.getUserById(data.userId);
  
      // 1. Check if user already verified
      const userAlreadyVerified = userWithPaymentMode?.paymentModes?.some(
        (pm: any) => pm.type === 'KYC' && pm.isVerified && pm.verificationMethod === 'STRIPE'
      );
  
      if (userAlreadyVerified) {
        return 'user_already_verified';
      }
  
      // 2. Check if Stripe customer exists but not verified
      let existingStripe = userWithPaymentMode?.paymentModes?.find(
        (pm: any) => pm.type === 'KYC' && pm.verificationMethod === 'STRIPE'
      );
  
      let customerId: string;
      let accountId: string;
  
      if (existingStripe) {
        customerId = existingStripe.customerId;
        accountId = existingStripe.accountNumber;
  
        // Create new verification session for existing Stripe customer
        const verificationSession = await this.stripe.identity.verificationSessions.create({
          type: 'document',
          metadata: { customerId },
          return_url: `${FRONTEND_URL}/kyc-complete`,
        });
  
        return verificationSession;
      }
  
      // 3. Create new Stripe customer and connected account
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
      });
      customerId = customer.id;
  
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'FI',
        email: data.email,
      });
      accountId = account.id;
  
      // 4. Store payment mode in DB
      await this.userService.createUserPaymentMode({
        verificationMethod: 'STRIPE',
        accountNumber: accountId,
        userId: data.userId,
        type: 'KYC',
        name: customerId,
        customerId: customerId,
        isVerified: false,
      });
  
      // 5. Create KYC verification session
      const verificationSession = await this.stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: { customerId },
        return_url: `${FRONTEND_URL}/kyc-complete`,
      });
  
      return verificationSession;
  
    } catch (error) {
      console.error('Error creating Stripe customer for user', data.userId, error);
      throw error;
    }
  }
  

  async stripeWebhook(data: any) {
    try {
      const session = await this.stripe.identity.verificationSessions.retrieve(data.sessionId);
      const user = await this.userService.getUserById(data.id);
      const userPaymentMode = await this.userService.getUserPaymentModeByCustomerId(session.id);
      if (userPaymentMode) {
        await this.userService.updateUserPaymentMode(userPaymentMode.id, { isVerified: true });
      }
      return session;
    } catch (error) {
      console.error('Error verifying Stripe customer', error);
      throw error;
    }
  }
}
