export class FareAttribute {
    id: string;
    price: number;
    currencyType: string;
    paymentMethod: FareAttributePaymentMethod;
    transfers: FareAttributeTransfers;
    agency?: string;
    transferDuration?: number;

    constructor(init: {
        id: string;
        price: number;
        currencyType: string;
        paymentMethod: FareAttributePaymentMethod;
        transfers: FareAttributeTransfers;
        agency?: string;
        transferDuration?: number;
    }) {
        this.id = init.id;
        this.price = init.price;
        this.currencyType = init.currencyType;
        this.paymentMethod = init.paymentMethod;
        this.transfers = init.transfers;
        this.agency = init.agency;
        this.transferDuration = init.transferDuration;
    }

    public toJSON() {
        return {
            "fare_id": this.id,
            "price": this.price,
            "currency_type": this.currencyType,
            "payment_method": this.paymentMethod,
            "transfers": this.transfers,
            "agency_id": this.agency,
            "transfer_duration": this.transferDuration
        }
    }

    public toString() {
        return this.id;
    }
}

export enum FareAttributePaymentMethod {
    OnBoard = 0,
    BeforeBoarding = 1
}

export enum FareAttributeTransfers {
    NoTransfers = "0",
    OneTransfer = "1",
    TwoTransfers = "2",
    Unlimited = "" // Represented as empty string in GTFS
}
