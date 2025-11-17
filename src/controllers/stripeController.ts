import { StripeService } from "../services/stripeService";
import { Request, Response } from 'express';
import { sendFailure, sendSuccess } from "../utils/response";

const stripeService = new StripeService();

export async function createStripeCustomer(req: Request, res: Response) {
  try {
    const user = req.user;
    const name = user.firstName + ' ' + user.lastName;
    const email = user.emails.find((eachEmail: any) => eachEmail.isPrimary)?.email;
    if (!user) {
      return sendFailure(res, 'Unauthorized', 401);
    }
    const data: any = {
      email,
      name,
      userId: user.id,
    //   phone: user.phone,
    };
    const customer = await stripeService.createCustomer(data);
    return sendSuccess(res, customer, 200);  
 } catch (error) {
    console.error('createStripeCustomer error:', error);
    return sendFailure(res, 'Failed to create Stripe customer', 500);
  }
}

export async function stripeWebhook(req: Request, res: Response) {
  try {
    const data = req.body;
    const customer = await stripeService.stripeWebhook(data);
    return sendSuccess(res, customer, 200);
  } catch (error) {
    console.error('stripeWebhook error:', error);
    return sendFailure(res, 'Failed to verify Stripe customer', 500);
  }
}