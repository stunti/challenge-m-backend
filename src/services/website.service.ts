import { Injectable } from '@nestjs/common';
import { WEBSITES } from 'mocks/websites.mocks';
import { Observable, of } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';
import { WebsiteDTO } from 'models/website.dto'; 


@Injectable()
export class WebsiteService {
    private websites: WebsiteDTO[] = WEBSITES;

    getWebsites(): Observable<any> {
        return of(this.websites);
    }

    getWebsite(websiteID): Observable<WebsiteDTO> {
				let id = Number(websiteID);
				return of(this.websites)
					.pipe(flatMap(val => val))
					.pipe(filter(e => e.id == id));
    }
}