import { formatDate } from "../utils/common";
import { bikePresenter } from "./bike";
import { userPresenter } from "./user";

export const bookingPresenter = (booking: any): any => {
    if(!booking) return null;
    if(!Array.isArray(booking)) {
        return {
            id: booking.id,
            bike: bikePresenter(booking.bike),
            user: userPresenter(booking.user),
            owner: userPresenter(booking.owner),
        };
    }
   
   return booking.map((booking: any) => {
    return {
        id: booking.id,
        bike: bikePresenter(booking.bike),
        user: userPresenter(booking.user),
        owner: userPresenter(booking.owner),
        status: booking.status,
        price: booking.price || 0,
        currency: booking.currency || 'EUR',
        startTime: formatDate(booking.startTime),
        endTime: formatDate(booking.endTime),
        completedAt: formatDate(booking.completedAt),
        createdAt: formatDate(booking.createdAt),
        updatedAt: formatDate(booking.updatedAt),
    };
   });
};  