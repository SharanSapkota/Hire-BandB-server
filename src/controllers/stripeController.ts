import { StripeService } from "../services/stripeService";
import { Request, Response } from 'express';

const stripeService = new StripeService();

export async function createStripeCustomer(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const data = {
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
    const customer = await stripeService.createCustomer(data);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Stripe customer' });
  }
}

