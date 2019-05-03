import { Test, TestingModule } from "@nestjs/testing";
import { WebsiteController } from "./website.controller";

import { FirebaseService } from "./service/firebase/firebase.service";
import { FirebaseMockService } from "./service/firebase/firebase.service.mock";
import { WebsiteService } from "./service/website/website.service";
import { WebsiteMockService } from "./service/website/website.service.mock";


describe("WebsiteController", () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [WebsiteController],
			providers: [
				{provide: WebsiteService, useClass: WebsiteMockService},
				{provide: FirebaseService, useClass: FirebaseMockService},

			]
    }).compile();
  });

  describe("getWebsites", () => {
    it('should return two website', done => {
      const websiteController = module.get<WebsiteController>(
        WebsiteController
			);
			const startDt = "2019-01-01";
			const endDt = "2019-01-02";
			websiteController.getWebsites(startDt, endDt).subscribe({
				next: val => {
					expect(val).toBeInstanceOf(Array);
					expect(val.length).toEqual(2);
					expect(new Date(val[0].date).getTime()).toBeGreaterThanOrEqual(new Date(startDt).getTime());
					expect(new Date(val[1].date).getTime()).toBeLessThanOrEqual(new Date(endDt).getTime());
				},
				complete: () => done(),
			});
		});

    it('should return three website', done => {
      const websiteController = module.get<WebsiteController>(
        WebsiteController
			);
			const startDt = "2019-01-01";
			const endDt = "2019-01-03";
			websiteController.getWebsites(startDt, endDt).subscribe({
				next: val => {
					expect(val).toBeInstanceOf(Array);
					expect(val.length).toEqual(3);
					expect(new Date(val[0].date).getTime()).toBeGreaterThanOrEqual(new Date(startDt).getTime());
					expect(new Date(val[1].date).getTime()).toBeLessThanOrEqual(new Date(endDt).getTime());
					expect(new Date(val[2].date).getTime()).toBeLessThanOrEqual(new Date(endDt).getTime());
				},
				complete: () => done(),
			});
		});
				

    it('should return zero website', done => {
      const websiteController = module.get<WebsiteController>(
        WebsiteController
			);
			const startDt = "2018-01-01";
			const endDt = "2018-01-03";
			websiteController.getWebsites(startDt, endDt).subscribe({
				next: val => {
					expect(val).toBeInstanceOf(Array);
					expect(val.length).toEqual(0);
				},
				complete: () => done(),
			});
		});		

  });
});
