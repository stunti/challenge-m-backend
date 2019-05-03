import { Injectable, HttpService, OnApplicationShutdown, OnApplicationBootstrap } from "@nestjs/common";
import { interval, Subscription } from "rxjs";

import { startWith } from "rxjs/operators";
import moment = require("moment-timezone");
import { AxiosResponse } from "axios";

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
export class BlockingService implements OnApplicationShutdown, OnApplicationBootstrap {

    private _blockedWebsite: Array<IBlockedWebsite>;
    private subscript: Subscription;

    constructor(private http: HttpService) {
        
        
    }

    onApplicationBootstrap() {
        //grab every 10s the list of files
        this.subscript = interval(10000)
        .pipe(startWith(0))
        .subscribe(() => { 
            this.fetchList();
        }); 
    }

    onApplicationShutdown(signal: string) {
        this.subscript.unsubscribe();
    }

    fetchList() {
        const url = 'http://private-1de182-mamtrialrankingadjustments4.apiary-mock.com/exclusions';
        console.log("[fetchList] ", url)
        this.http
            .get(url, {transformResponse: (data, headers) => this.transformResponse(data, headers)})
            .subscribe({
                next: response => this.processResponse(response),
                complete:() => {},
                error:(err) => {console.log("Cannot retrieve blocked list")}
            });
    }

    get blockedWebsite() {
        return this._blockedWebsite;
    }

    transformResponse(data, headers) {
        let arr = [];
        const obj = JSON.parse(data);   
        console.log("transformResponse")

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
        //console.log("response", response.data, response.data instanceof Array);
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
            } else {
                return false;
            }
        }
        return false;
    }
}
