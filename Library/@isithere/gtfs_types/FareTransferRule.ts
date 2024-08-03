class FareTransferRule {
    fromLegGroup?: string;
    toLegGroup?: string;
    transferCount?: number;
    durationLimit?: number;
    durationLimitType?: number;
    fareTransferType: number;
    fareProduct?: string;

    constructor(init: {
        fromLegGroup?: string;
        toLegGroup?: string;
        transferCount?: number;
        durationLimit?: number;
        durationLimitType?: number;
        fareTransferType: number;
        fareProduct?: string;
    }) {
        this.fromLegGroup = init.fromLegGroup;
        this.toLegGroup = init.toLegGroup;
        this.transferCount = init.transferCount;
        this.durationLimit = init.durationLimit;
        this.durationLimitType = init.durationLimitType;
        this.fareTransferType = init.fareTransferType;
        this.fareProduct = init.fareProduct;
    }

    public toJSON() {
        return {
            "from_leg_group": this.fromLegGroup,
            "to_leg_group": this.toLegGroup,
            "transfer_count": this.transferCount,
            "duration_limit": this.durationLimit,
            "duration_limit_type": this.durationLimitType,
            "fare_transfer_type": this.fareTransferType,
            "fare_product": this.fareProduct
        }
    }

    public toString() {
        return `${this.fromLegGroup}_${this.toLegGroup}_${this.fareProduct}_${this.transferCount}_${this.durationLimit}`;
    }
}
