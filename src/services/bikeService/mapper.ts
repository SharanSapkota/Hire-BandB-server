export const bikeCreateDto = (bike: any) => {
    return {
        name: bike.name,
        description: bike.description,
        rentAmount: bike.rentAmount,
        status: bike.status,
        startTime: bike.startTime,
        endTime: bike.endTime,
        ownerId: bike.ownerId,
        categoryId: bike.categoryId
    };
}

export const bikeImagesCreateDto = (payload: any, bikeId: any) => {
    const bikeImages = payload.bikeImages.map((image: any) => ({
        bikeId: bikeId,
        imageUrl: image.imageUrl
    }));

    return bikeImages;
}

export const bikeAddressCreateDto = (bikeAddress: any, bikeId: any) => {
    return {
        bikeId: bikeId,
        address: bikeAddress.address,
        latitude: bikeAddress.latitude,
        longitude: bikeAddress.longitude,
        city: bikeAddress.city,
        street: bikeAddress.street,
        village: bikeAddress.village,
        state: bikeAddress.state,
        postalCode: bikeAddress.postalCode,
        country: bikeAddress.country
    };
}