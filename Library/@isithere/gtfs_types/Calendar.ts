export class Calendar {

	id: string;
	monday: boolean;
	tuesday: boolean;
	wednesday: boolean;
	thursday: boolean;
	friday: boolean;
	saturday: boolean;
	sunday: boolean;
	start: Date;
	end: Date;

	constructor(init: { 
		id: string;
		monday: boolean;
		tuesday: boolean;
		wednesday: boolean;
		thursday: boolean;
		friday: boolean;
		saturday: boolean;
		sunday: boolean;
		start: Date;
		end: Date; 
	}) {

		this.id = init.id
		this.monday = init.monday
		this.tuesday = init.tuesday
		this.wednesday = init.wednesday
		this.thursday = init.thursday
		this.friday = init.friday
		this.saturday = init.saturday
		this.sunday = init.sunday
		this.start = init.start
		this.end = init.end

	}

	public toJSON() {
		return {
			"service_id": this.id,
			"monday": (this.monday) ? 1 : 0,
			"tuesday": (this.tuesday) ? 1 : 0,
			"wednesday": (this.wednesday) ? 1 : 0,
			"thursday": (this.thursday) ? 1 : 0,
			"friday": (this.friday) ? 1 : 0,
			"saturday": (this.saturday) ? 1 : 0,
			"sunday": (this.sunday) ? 1 : 0,
			"start_date": this.start,
			"end_date": this.end
		}
	}

	public toString() {
        return this.id;
    }

}