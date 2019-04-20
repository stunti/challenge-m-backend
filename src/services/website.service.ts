import { Injectable, Scope } from '@nestjs/common';
import { WEBSITES } from 'mocks/websites.mocks';
import { Observable, of, Subject } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';
import { WebsiteDTO } from 'models/website.dto'; 
import { FirebaseService } from './firebase.service';


@Injectable({ scope: Scope.REQUEST })
export class WebsiteService {
    private websites: WebsiteDTO[] = WEBSITES;
		private sub: Subject<WebsiteDTO>

		constructor(private readonly fbService: FirebaseService) {
			this.sub = new Subject<WebsiteDTO>();
		}

		requestWebsites(): void {
			this.fbService.getApp().database()
			.ref('websites')
			.orderByChild("date")
			.startAt("2016-01-06T00:00:00Z")
			.endAt("2016-01-06T00:00:00Z")
			.once('value').then((snapshot) => {
				console.log(snapshot.val());
				// snapshot.val().forEach(element => {
					const snap = snapshot.val()
					for (let key in snap) {
						console.log(key, snap[key]);
					this.sub.next(snap[key]);
				}
				
				// var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
			})
			.then(() => this.sub.complete());

		}

    listenWebsites(): Observable<any> {
		return this.sub.asObservable();
			// return of(this.websites);
    }

    requestWebsite(websiteID): void {
				let id = Number(websiteID);
				// return of(this.websites)
				// 	.pipe(flatMap(val => val))
				// 	.pipe(filter(e => e.id == id));
				
				this.fbService.getApp().database()
				.ref('websites/' + websiteID)
				.once('value').then((snapshot) => {
					console.log(snapshot.val());
					// snapshot.val().forEach(element => {
						const snap = snapshot.val()
						this.sub.next(snap);
				})
				.then(() => this.sub.complete());
    }
}