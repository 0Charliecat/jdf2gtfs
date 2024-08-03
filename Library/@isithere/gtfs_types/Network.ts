class Network {
    id: string;
    name?: string;

    constructor(init: { id: string, name?: string }) {
        this.id = init.id;
        this.name = init.name;
    }

    public toJSON() {
        return {
            "network_id": this.id,
            "network_name": this.name
        }
    }

    public toString() {
        return this.id;
    }
}
