import { Injectable, Scope } from "@nestjs/common";
import { Observable, of, Subject } from "rxjs";
import { WebsiteDTO } from "models/website.dto";
import { FirebaseService } from "../firebase/firebase.service";
import { WEBSITES } from "mocks/websites.mocks";
import moment from 'moment-timezone'

@Injectable({ scope: Scope.REQUEST })
export class WebsiteMockService {
  private sub: Subject<WebsiteDTO>;
	private website = WEBSITES;

  constructor(private readonly fbService: FirebaseService) {
    this.sub = new Subject<WebsiteDTO>();
  }

  requestWebsites(startDate: Date, endDate: Date): void {
		//to simulate latency for real service
		setTimeout( () => {
			for (const key in this.website) {
				if (this.website[key] != null) {
					const dt = moment.tz(this.website[key].date, "UTC");
					const sdt = moment.tz(startDate, "UTC");
					const edt = moment.tz(endDate, "UTC");
					
					console.log (key, sdt.format(),  dt.format(),  edt.format());

					if (
						sdt.isBefore(dt) &&
						dt.isBefore(endDate)
					) {
						this.sub.next(this.website[key]);
					}
				}
			}
			this.sub.complete();
		}, 50);
  }

  listenWebsites(): Observable<any> {
		
    return this.sub.asObservable();
  }

  requestWebsite(websiteID): void {
		this.sub.next(this.website[websiteID]);
		this.sub.complete();
		return;
  }
}
