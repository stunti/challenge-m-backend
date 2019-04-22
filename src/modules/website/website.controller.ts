import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
	ClassSerializerInterceptor,
	UseInterceptors
} from "@nestjs/common";
import { WebsiteService } from "services/website/website.service";
import { WebsiteDTO } from "models/website.dto";
import { throwError, Observable } from "rxjs";
import { scan, catchError, finalize, map  } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import moment = require("moment-timezone");

@Controller("website")
@UseInterceptors(ClassSerializerInterceptor)
export class WebsiteController {
  constructor(private readonly  websiteService: WebsiteService) {}

	@Get(":startDate/:endDate")
	@UseInterceptors(ClassSerializerInterceptor)
  getWebsites(
    @Param("startDate") startDate: string,
    @Param("endDate") endDate: string
  ): Observable<WebsiteDTO[]> {
		const startDt = moment.tz(startDate, "UTC"); 
    const endDt =  moment.tz(endDate, "UTC"); 

		this.websiteService.requestWebsites(startDt, endDt); 
    const websites = this.websiteService.listenWebsites();

    // Accumulate into an array
    return websites

      .pipe(
        catchError(err => {
          if (err != null) {
            return throwError(new HttpException(err, HttpStatus.FORBIDDEN));
          } else {
            return throwError(new HttpException("Forbidden", HttpStatus.FORBIDDEN));
          }
        })
			)
			.pipe(map(val => {
				return plainToClass(WebsiteDTO, val);
			}))
			.pipe(scan((acc, val) => [...acc, val], []))
  }


  @Get(":websiteID")
  getWebsite(@Param("websiteID") websiteID): Observable<WebsiteDTO> {
    this.websiteService.requestWebsite(websiteID);
    const website = this.websiteService.listenWebsites();

		return website;
  }
}
