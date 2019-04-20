import { Controller, Get, Param } from '@nestjs/common';
import { WebsiteService } from 'services/website.service';
import { WebsiteDTO } from 'models/website.dto';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

@Controller('website')
export class WebsiteController {
  constructor(private websiteService: WebsiteService) {}

  @Get()
  getWebsites(): Observable<WebsiteDTO[]> {
    this.websiteService.requestWebsites();
    const websites = this.websiteService.listenWebsites();

    // Accumulate into an array
    return websites.pipe(scan((acc, val) => [...acc, val], []));
  }

  @Get(':websiteID')
  getWebsite(@Param('websiteID') websiteID): Observable<WebsiteDTO> {
    this.websiteService.requestWebsite(websiteID);
    const website = this.websiteService.listenWebsites();

    return website;
  }
}
