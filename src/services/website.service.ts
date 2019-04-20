import { Injectable, Scope } from '@nestjs/common';
import { Observable, of, Subject } from 'rxjs';
import { WebsiteDTO } from 'models/website.dto';
import { FirebaseService } from './firebase.service';

@Injectable({ scope: Scope.REQUEST })
export class WebsiteService {
  private sub: Subject<WebsiteDTO>;

  constructor(private readonly fbService: FirebaseService) {
    this.sub = new Subject<WebsiteDTO>();
  }

  requestWebsites(): void {
    this.fbService
      .getApp()
      .database()
      .ref('websites')
      .orderByChild('date')
      .startAt('2016-01-06T00:00:00Z')
      .endAt('2016-01-06T00:00:00Z')
      .once('value')
      .then(snapshot => {
        const snap = snapshot.val();
        for (const key in snap) {
					if (snap[key] != null) {
						this.sub.next(snap[key]);
					}
        }
      })
      .then(() => this.sub.complete());
  }

  listenWebsites(): Observable<any> {
    return this.sub.asObservable();

  }

  requestWebsite(websiteID): void {
		const id = Number(websiteID);

		this
			.fbService
			.getApp()
			.database()
			.ref('websites/' + websiteID)
			.once('value')
			.then(snapshot => {
				const snap = snapshot.val();
				this.sub.next(snap);
			})
			.then(() => this.sub.complete());
  }
}
