import { BaseCostCalculator } from "./base";
import { differenceInDays } from "../../utils/common";
const COMMISSION_PERCENTAGE = 0.1;

export class CostCalculator implements BaseCostCalculator {
    calculateCostForOwner(data: any) {   // data: { amount: number, duration: string, bike: Bike }   
        const { fromDate, toDate, bike } = data;
        let paymentUnit = 'daily'
        const duration = differenceInDays(toDate, fromDate);
        let cost = 0;
        paymentUnit = bike?.paymentUnit || 'daily';
        if(paymentUnit === 'hourly') {
            cost = bike.pricePerHour * duration;
        } else if(paymentUnit === 'daily') {
            cost = bike.pricePerDay * duration;
        }

        cost = cost - this.calculateCostForAdmin(data);
        return cost;
    }

    calculateCostForRenter(data: any) {
        const { fromDate, toDate, bike } = data;
        let paymentUnit = 'daily'
        const duration = differenceInDays(toDate, fromDate);
        let cost = 0;
        paymentUnit = bike?.paymentUnit || 'daily';
        if(paymentUnit === 'hourly') {
            cost = bike.pricePerHour * duration;
        } else if(paymentUnit === 'daily') {
            cost = bike.pricePerDay * duration;
        }

        return cost;
    }

    calculateCostForAdmin(data: any) {
        const { fromDate, toDate, bike } = data;
        const duration = differenceInDays(toDate, fromDate);
        const cost = bike.rentAmount * duration * COMMISSION_PERCENTAGE/100;

        return cost;
    }
}

