import { Test, TestingModule } from "@nestjs/testing";
import { WebsiteService } from "./website.service";
import { FirebaseService } from "../firebase/firebase.service";
import { FirebaseMockService } from "../firebase/firebase.service.mock";
import { HttpModule } from "@nestjs/common";

import { BlockingService } from "../blocking/blocking.service";
import { BlockingMockService } from "../blocking/blocking.service.mock";



describe("WebsitesService", () => {
  let service: WebsiteService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
				WebsiteService,
        {provide: FirebaseService, useClass: FirebaseMockService},
        {provide: BlockingService, useClass: BlockingMockService},
        
			]
    }).compile();
    service = module.get<WebsiteService>(WebsiteService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
