import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { sendFailure, sendSuccess } from '../utils/response';
import { ERROR_MESSAGES } from '../constants/errorConstant';
import { CostCalculator } from '../services/costCalculator/costCalculator';

const paymentService = new PaymentService();
const costCalculator = new CostCalculator();
export async function createPaymentTransaction(req: Request, res: Response) {
  try {

    const item = await paymentService.createPaymentTransaction(req.body);
    return sendSuccess(res, item, 201);
  } catch (err: any) {
    return sendFailure(res, {error: err.message || ERROR_MESSAGES.INTERNAL_ERROR}, 500);
  }
}

export async function listPaymentMethods(req: Request, res: Response) {
  try {
    const items = await paymentService.listPaymentMethods();
    return sendSuccess(res, items, 200);
  } catch (err: any) {
    return sendFailure(res, {error: err.message || ERROR_MESSAGES.INTERNAL_ERROR}, 500);
  }
}

export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const bookingId = Number(req.body.bookingId);
    const paymentIntent = await paymentService.createPaymentTransaction({bookingId});
    return sendSuccess(res, paymentIntent, 200);
  } catch (err: any) {
    console.log(err);
    return sendFailure(res, {error: err.message || ERROR_MESSAGES.INTERNAL_ERROR}, 500);
  }
}


export async function calculateCostForRenter(req: Request, res: Response) {
  try {
    const data = {
      bikeId: Number(req.query.bikeId),
      fromDate: new Date(req.query.startDate as string).toISOString(),
      toDate: new Date(req.query.endDate as string).toISOString(),
    };
    const cost = await paymentService.calculateCostForRenter(data);
    return sendSuccess(res, {totalAmount: cost}, 200);
  } catch (error: any) {
    console.log(error);
    return sendFailure(res, { error: error?.message || ERROR_MESSAGES.INTERNAL_ERROR }, 500);
  }
}

