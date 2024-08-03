export class FareMedia {
    id: string;
    name?: string;
    type: FareMediaType;

    constructor(init: {
        id: string;
        name?: string;
        type: FareMediaType;
    }) {
        this.id = init.id;
        this.name = init.name;
        this.type = init.type;
    }

    public toJSON() {
        return {
            "fare_media_id": this.id,
            "fare_media_name": this.name,
            "fare_media_type": this.type
        }
    }

    public toString() {
        return this.id;
    }
}

export enum FareMediaType {
    None = 0,
    PaperTicket = 1,
    TransitCard = 2,
    cEMV = 3,
    MobileApp = 4
}