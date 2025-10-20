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

export const bikeImagesCreateDto = (bikeImages: any, bikeId: any) => {
    return bikeImages.map((image: any) => ({
        bikeId: bikeId,
        imageUrl: image.imageUrl
    }));
}

export const bikeAddressCreateDto = (bikeAddress: any, bikeId: any) => {
    return {
        bikeId: bikeId,
        addressLine1: bikeAddress.addressLine1,
        addressLine2: bikeAddress.addressLine2,
        city: bikeAddress.city,
        street: bikeAddress.street,
        village: bikeAddress.village,
        state: bikeAddress.state,
        postalCode: bikeAddress.postalCode,
        country: bikeAddress.country
    };
}