import { QueryBuilder } from "./query";

export class BikeQueryBuilder {
    public query;
    constructor(query: any) {
        // super(query)
        this.query = query
    }

    listBike(includes: any) {
        let defaultQuery: any = { bikeImages: true, bikeAddress: true, category: true, owner: { select: { id: true, firstName: true, lastName: true, emails: { where: { isPrimary: true }, select: { email: true } } } } }
        const bikeIncludes: any = {}
        if(includes?.bikeAdress) {
            bikeIncludes.bikeAddress = true;
        }

        if(includes.category) {
            bikeIncludes.category = true;
        }

        if(includes.bikeImages) {
            bikeIncludes.bikeImages = true;
        }

        const finalQuery: any =  { include: defaultQuery }
        if(this.query?.lat && this.query?.lng) {
            finalQuery.bikeAddress.lat = this.query.lat;
            finalQuery.bikeAdress.lng = this.query.lng;
        }

        if(this.query?.price) {
            finalQuery.price = this.query.price;
        }

        if(this.query.category) {
            finalQuery.categoryId.id = this.query.categoryId
        }

        return finalQuery;

    } 
}