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
    description: bike?.description,
    rentAmount: bike?.rentAmount,
    images: bike?.bikeImages?.map((image: any) => {
      return {
        id: image?.id,
        url: image?.imageUrl,
      };
    }),
    category: {
      id: bike?.category?.id,
      name: bike?.category?.name,
    },
    owner: {
      id: bike?.owner?.id,
      name: bike?.owner?.firstName + ' ' + bike?.owner?.lastName,
    },
  };
}