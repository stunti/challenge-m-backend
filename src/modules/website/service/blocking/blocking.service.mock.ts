import { Injectable, Scope, HttpService } from "@nestjs/common";
import moment = require("moment-timezone");
import { IBlockedWebsite } from "./blocking.service";

@Injectable({ })
export class BlockingMockService {
  
  constructor(private http: HttpService) {}

  fetchList() {

  }
  get blockedWebsite() {
      return new Array<IBlockedWebsite>();
  }

  isBlocked(name: string, date: moment.Moment): boolean {
    return false;
  }
}
