import { BasePaymentService } from "./base";

export class PaymentMethodService implements BasePaymentService {
    constructor(private paymentService: BasePaymentService) {}

    async createPaymentTransaction(data: any): Promise<any> {
        return await this.paymentService.createPaymentTransaction(data);
    }
}