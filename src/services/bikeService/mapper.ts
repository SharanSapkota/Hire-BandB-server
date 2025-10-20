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
    return {
        bikeId,
        images: bikeImages.images
    };
}

export const bikeAddressCreateDto = (bikeAddress: any, bikeId: any) => {
    return {
        bikeId: bikeId,
        addressLine1: bikeAddress.addressLine1,
        addressLine2: bikeAddress.addressLine2,
        city: bikeAddress.city,
        street: bikeAddress.street,
        state: bikeAddress.state,
        zipCode: bikeAddress.zipCode,
        country: bikeAddress.country
    };
}