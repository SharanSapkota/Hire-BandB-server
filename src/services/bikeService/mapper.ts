export const bikeCreateDto = (bike: any) => {
  return {
    name: bike.name,
    description: bike.description ?? null,
    rentAmount: bike.rentAmount ?? bike.pricePerHour ?? 0,
    pricePerHour: bike.pricePerHour ?? bike.rentAmount ?? 0,
    pricePerDay: bike.pricePerDay ?? null,
    status: bike.status ?? 'AVAILABLE',
    startTime: bike.startTime ?? null,
    endTime: bike.endTime ?? null,
    ownerId: bike.ownerId,
    categoryId: bike.categoryId ?? null,
  };
};

export const bikeImagesCreateDto = (payload: any, bikeId: any) => {
  const images = Array.isArray(payload.bikeImages) ? payload.bikeImages : [];

  return images.map((image: any) => ({
    bikeId,
    imageUrl: image.imageUrl,
  }));
};

export const bikeAddressCreateDto = (bikePayload: any, bikeId: any) => {
  const address = bikePayload.address || {};

  return {
    bikeId,
    address: address.address || address.formatted || bikePayload.addressLine || '',
    latitude: address.latitude ?? bikePayload.latitude,
    longitude: address.longitude ?? bikePayload.longitude,
    city: address.city ?? bikePayload.city ?? null,
    street:
      address.street ||
      bikePayload.street ||
      address.address ||
      address.formatted ||
      bikePayload.addressLine ||
      '',
    state: address.state ?? bikePayload.state ?? null,
    postalCode: address.postalCode ?? bikePayload.postalCode ?? null,
    country: address.country ?? bikePayload.country ?? null,
  };
};