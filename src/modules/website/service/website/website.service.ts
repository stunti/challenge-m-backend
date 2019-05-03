import { Injectable, Scope } from "@nestjs/common";
import { Observable, of, Subject } from "rxjs";
import { FirebaseService } from "../firebase/firebase.service";
import moment = require("moment-timezone");
import { BlockingService, IBlockedWebsite } from "../blocking/blocking.service";
import { WebsiteDTO } from "../../../../models/website.dto";


@Injectable({ scope: Scope.REQUEST })
export class WebsiteService {
  private sub: Subject<WebsiteDTO>;

  constructor(
    private readonly fbService: FirebaseService,
    private readonly blockService: BlockingService,
  ) {
      this.sub = new Subject<WebsiteDTO>();
  }

  requestWebsites(startDate: moment.Moment, endDate: moment.Moment): void {
    this.fbService
      .getApp()
      .database()
      .ref("websites")
      .orderByChild("date")
      .startAt(startDate.format("YYYY-MM-DDTHH:mm:ssZ"))
      .endAt(endDate.format("YYYY-MM-DDTHH:mm:ssZ"))
      .once("value")
      .then((snap) => this.processSnapshot(snap))
      .then(() => this.sub.complete());
  }

  listenWebsites(): Observable<any> {
    return this.sub.asObservable();
  }

  processSnapshot(snapshot) {
    
    const snap = snapshot.val();
    if (snap == null || snap.length == 0) {
      this.sub.error("empty result");
      return; 
    }
    for (const key in snap) {
      if (snap[key] != null) {
        
        if (!this.blockService.isBlocked(snap[key].name, moment.tz(snap[key].date, "UTC"))) {
          const obj = new WebsiteDTO({
            visits: snap[key].visits,
            name: snap[key].name,
            datetime: moment.tz(snap[key].date, "UTC"),
          });
          this.sub.next(obj);
        } else {
          console.log("Website is blocked", snap[key].name);
        }
      }
    }
  }
  requestWebsite(websiteID): void {
    const id = Number(websiteID);

    this.fbService
      .getApp()
      .database()
      .ref("websites/" + websiteID)
      .once("value")
      .then(snapshot => {
        const snap = snapshot.val();
        this.sub.next(snap);
      })
      .then(() => this.sub.complete());
  }
}
