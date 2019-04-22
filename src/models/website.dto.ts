import { Expose, Exclude } from 'class-transformer';
import moment = require('moment');


export class WebsiteDTO {
	id: number;
	name: string;
	visits: number;

	@Exclude()
	private datetime: Date;

	@Expose()
	get date(): string {
		if (this.datetime != null ) {
			return moment(new Date(this.datetime)).utc().format('YYYY-MM-DD'); 
		}
	}

	get _datetime(): Date {
		return this.datetime;
	}

	constructor(partial: Partial<WebsiteDTO>) {
    Object.assign(this, partial);
	}
	

	set date(val) {
		this.datetime = new Date(val); 
	};
}
