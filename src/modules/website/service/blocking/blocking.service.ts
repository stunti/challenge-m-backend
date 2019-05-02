import { Injectable, Scope, HttpService } from "@nestjs/common";
import { Observable, of, Subject, interval, BehaviorSubject } from "rxjs";
import { WebsiteDTO } from "models/website.dto";
import { FirebaseService } from "../firebase/firebase.service";
import { startWith } from "rxjs/operators";
import moment = require("moment-timezone");
import Axios, { AxiosResponse } from "axios";

export interface IBlockedWebsite {
    dtStart: moment.Moment;
    dtEnd:  moment.Moment;
    name: string;
};


interface IBlockedWebsiteInput {
    excludedSince: string;
    excludedTill:  string;
    host: string;
};

@Injectable({ })
export class BlockingService {

    private _blockedWebsite: Array<IBlockedWebsite>;
    constructor(private http: HttpService) {

        //grab every 10s the list of files
        interval(10000)
        .pipe(startWith(0))
        .subscribe(() => { 
            this.fetchList();
        }); 
    }

    fetchList() {

        const url = 'http://private-1de182-mamtrialrankingadjustments4.apiary-mock.com/exclusions';
        this.http
            .get(url, {transformResponse: this.transformResponse})
            .subscribe(this.processResponse);
    }

    get blockedWebsite() {
        return this._blockedWebsite;
    }

    transformResponse(data, headers) {
        let arr = [];
        const obj = JSON.parse(data);   
        
        for (let i = 0; i < obj.length; i++) {

            arr.push(<IBlockedWebsiteInput>{
                host: obj[i]["host"],
                excludedSince: obj[i]["excludedSince"],
                excludedTill:  obj[i]["excludedTill"],
            });
        }
        return arr;
    }

    processResponse(response: AxiosResponse<IBlockedWebsiteInput>) {
        if (response.data instanceof Array) {
            this._blockedWebsite = new Array<IBlockedWebsite>();
            for (let i = 0; i < response.data.length; i++) {
                const website = response.data[i];

                const startDt = moment.tz(website.excludedSince, "UTC"); 
                const endDt =  moment.tz(website.excludedTill, "UTC"); 

                const obj = <IBlockedWebsite>{
                    name: response.data[i].host,
                    dtStart: startDt,
                    dtEnd: endDt,
                }
                this._blockedWebsite.push(obj);
            }
        }        
    }

    isBlocked(name: string, date: moment.Moment): boolean {
        for (let i = 0; i < this._blockedWebsite.length; i++) {
            const obj = this._blockedWebsite[i];
            let start = obj.dtStart;
            let end = obj.dtEnd;
            if (!start) {
                start = moment.tz("2000-01-01", "UTC"); 
            }

            if (!end) {
                end = moment.tz("2100-01-01", "UTC"); 
            }
            
            if (
                obj.name == name &&
                date.isAfter(start) &&
                date.isBefore(end)
                ) {
                    return true;
                }else {
                    return false;
                
                }
        }
        return false;
    }
}
