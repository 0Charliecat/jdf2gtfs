class FareLegRule {
    legGroup?: string;
    network?: string;
    fromArea?: string;
    toArea?: string;
    fromTimeframeGroup?: string;
    toTimeframeGroup?: string;
    fareProduct: string;

    constructor(init: {
        legGroup?: string;
        network?: string;
        fromArea?: string;
        toArea?: string;
        fromTimeframeGroup?: string;
        toTimeframeGroup?: string;
        fareProduct: string;
    }) {
        this.legGroup = init.legGroup;
        this.network = init.network;
        this.fromArea = init.fromArea;
        this.toArea = init.toArea;
        this.fromTimeframeGroup = init.fromTimeframeGroup;
        this.toTimeframeGroup = init.toTimeframeGroup;
        this.fareProduct = init.fareProduct;
    }

    public toJSON() {
        return {
            "leg_group_id": this.legGroup,
            "network_id": this.network,
            "from_area_id": this.fromArea,
            "to_area_id": this.toArea,
            "from_timeframe_group_id": this.fromTimeframeGroup,
            "to_timeframe_group_id": this.toTimeframeGroup,
            "fare_product_id": this.fareProduct
        }
    }

    public toString() {
        return `${this.legGroup}_${this.fareProduct}`;
    }
}
