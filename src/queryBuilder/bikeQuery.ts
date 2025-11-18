import { QueryBuilder } from "./query";

export class BikeQueryBuilder {
    public query;
    constructor(query: any) {
        // super(query)
        this.query = query
    }

    listBikeByAddress() {
        const bikeAddressQuery: any = {}
        if(this.query?.lat && this.query?.lng) {
            bikeAddressQuery.lat = this.query.lat;
            bikeAddressQuery.lng = this.query.lng;
        }

        if(this.query?.city) {
            bikeAddressQuery.city = this.query.city;
        }

        if(this.query?.state) {
            bikeAddressQuery.state = this.query.state;
        }

        if(this.query?.country) {
            bikeAddressQuery.country = this.query.country;
        }

        return { where: { bikeAddress: bikeAddressQuery } };
    }

    listBike(_includes: any) {
        const include: any = {
            bikeImages: true,
            bikeAddress: true,
            category: true,
            owner: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    emails: {
                        where: { isPrimary: true },
                        select: { email: true }
                    }
                }
            }
        };

        const where: any = { isActive: true };

        if (this.query?.ownerId) {
            const ownerId = Number(this.query.ownerId);
            if (!Number.isNaN(ownerId)) {
                where.ownerId = ownerId;
            }
        }

        if (this.query?.status) {
            where.status = this.query.status;
        }

        if (this.query?.categoryId) {
            const categoryId = Number(this.query.categoryId);
            if (!Number.isNaN(categoryId)) {
                where.categoryId = categoryId;
            }
        }

        if (this.query?.categoryName) {
            where.category = { name: this.query.categoryName };
        }

        if (this.query?.city || this.query?.state || this.query?.country) {
            where.bikeAddress = {
                some: {
                    ...(this.query?.city ? { city: this.query.city } : {}),
                    ...(this.query?.state ? { state: this.query.state } : {}),
                    ...(this.query?.country ? { country: this.query.country } : {}),
                },
            };
        }

        return {
            include,
            where,
        };

    } 
}