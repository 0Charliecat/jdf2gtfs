class Area {
    id: string;
    name?: string;

    constructor(init: { id: string, name?: string }) {
        this.id = init.id;
        this.name = init.name;
    }

    public toJSON() {
        return {
            "area_id": this.id,
            "area_name": this.name
        }
    }

    public toString() {
        return this.id;
    }
}
