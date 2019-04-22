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
		const startDt = new Date(startDate); 

		console.log("startdate, ", startDate, startDt )
    const endDt = new Date(endDate);
		
		console.log("endDate, ", endDate, endDt )
    
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
			.pipe(finalize(() => console.log('Sequence complete')));
  }


  @Get(":websiteID")
  getWebsite(@Param("websiteID") websiteID): Observable<WebsiteDTO> {
    this.websiteService.requestWebsite(websiteID);
    const website = this.websiteService.listenWebsites();

		return website;
		
		// return new WebsiteDTO({ id: 1, date: new Date("2019/01/01"), name: "g1", visits: 10 });

  }
}
