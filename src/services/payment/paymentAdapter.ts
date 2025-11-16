// import { PaymentService } from "./base";
// import { StripePaymentService } from "./stripePayment";

// export class PaymentAdapter {
//   constructor(private paymentService: PaymentService) {}

//   async createPaymentTransaction(data: any) {
//     if(this.paymentService instanceof StripePaymentService) {
//       return await this.paymentService.createPaymentTransaction(data);
//     }

//     throw new Error('Payment service not supported');
//   }
// }

