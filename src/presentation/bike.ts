import { BASE_URL } from "../base/base";
import { formatDate } from "../utils/common";
import { bookingPresenter } from "./booking";

export const bikePresenter = (bike: any) => {
  return {
    id: bike?.id,
    name: bike?.name,
    location: {
        lat: bike?.bikeAddress?.[0]?.latitude,
        lng: bike?.bikeAddress?.[0]?.longitude,
        address: bike?.bikeAddress?.[0]?.address,
        city: bike?.bikeAddress?.[0]?.city,
        state: bike?.bikeAddress?.[0]?.state,
        country: bike?.bikeAddress?.[0]?.country,
        postalCode: bike?.bikeAddress?.[0]?.postalCode,
        placeId: bike?.bikeAddress?.[0]?.placeId,
    },
    rentAmount: bike?.rentAmount,
    pricePerHour: bike?.pricePerHour,
    pricePerDay: bike?.pricePerDay,
    rating: bike?.rating,
    reviews: bike?.reviews,
    status: bike?.status,
    startTime: formatDate(bike?.startTime),
    endTime: formatDate(bike?.endTime),
    bookings: bookingPresenter(bike?.bookings),
    category: {
      id: bike?.category?.id,
      name: bike?.category?.name,
    },
    images: bike?.bikeImages?.map((image: any) => {
      return {
        id: image?.id,
        url: BASE_URL + image?.imageUrl,
      };
    }),
    owner: {
      id: bike?.owner?.id,
      name: bike?.owner?.firstName + ' ' + bike?.owner?.lastName,
    },
}};