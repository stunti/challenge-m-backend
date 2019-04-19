import { Controller, Get, Param } from '@nestjs/common';
import { WebsiteService } from 'services/website.service';
import { WebsiteDTO } from 'models/website.dto';
import { Observable } from 'rxjs';

@Controller('website')
export class WebsiteController {
    constructor(private websiteService: WebsiteService) { }

    @Get()
    getWebsites(): Observable<WebsiteDTO[]>  {
        const websites = this.websiteService.getWebsites();
        return websites;
    }

    @Get(':websiteID')
    getWebsite(@Param('websiteID') websiteID): Observable<WebsiteDTO> {
        const website = this.websiteService.getWebsite(websiteID);
        return website;
    }
} 