class FareProduct {
    id: string;
    name?: string;
    fareMedia?: string;
    amount: number;
    currency: string;

    constructor(init: {
        id: string;
        name?: string;
        fareMedia?: string;
        amount: number;
        currency: string;
    }) {
        this.id = init.id;
        this.name = init.name;
        this.fareMedia = init.fareMedia;
        this.amount = init.amount;
        this.currency = init.currency;
    }

    public toJSON() {
        return {
            "fare_product_id": this.id,
            "fare_product_name": this.name,
            "fare_media_id": this.fareMedia,
            "amount": this.amount,
            "currency": this.currency
        }
    }

    public toString() {
        return `${this.id}_${this.fareMedia}`;
    }
}