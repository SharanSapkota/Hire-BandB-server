export abstract class BaseCostCalculator {
    constructor() {}
    abstract calculateCostForOwner(data: any): number
    abstract calculateCostForRenter(data: any): number
    abstract calculateCostForAdmin(data: any): number
}

