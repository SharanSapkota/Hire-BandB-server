export abstract class BasePaymentService {
    constructor() {}
    abstract createPaymentTransaction(data: any): Promise<any>
}

export abstract class PaymentService implements BasePaymentService {
    constructor() {}
    abstract createPaymentTransaction(data: any): Promise<any>
}
