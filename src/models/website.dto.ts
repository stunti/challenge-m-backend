import { Expose, Exclude } from 'class-transformer';
import moment = require("moment-timezone");


export class WebsiteDTO {
	id: number;
	name: string;
	visits: number;

	@Exclude()
	datetime: moment.Moment; 

	@Expose()
	get date(): string {
		if (this.datetime != null ) {
			// console.log(this.datetime, this.datetime.utc().format('YYYY-MM-DD'))
			return this.datetime.utc().format('YYYY-MM-DD'); 
		}
	}

	get _datetime(): moment.Moment {
		return this.datetime;
	}

	constructor(partial: Partial<WebsiteDTO>) {
    Object.assign(this, partial);
	}
	

	set date(val) {
		this.datetime = moment.tz(val, "UTC"); 
	};
}
