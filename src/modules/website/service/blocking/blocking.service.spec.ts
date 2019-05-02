import { Test, TestingModule } from "@nestjs/testing";

import { BlockingService } from "./blocking.service";
import { HttpService, HttpModule } from "@nestjs/common";
import { of } from 'rxjs';
import Axios, { AxiosResponse } from "axios";

describe("BlockingService", () => {
  let service: BlockingService;
  let httpService: HttpService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        BlockingService
      ]
    }).compile();
    service = module.get<BlockingService>(BlockingService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it('should return EMPTY when session service request responds with status code NOT OK', async (done) => {
    let res =  <AxiosResponse<any>>{};
    res.data = [
        {
        "host": "facebook.com",
        "excludedSince": "2016-12-01"
        },
        {
        "host": "google.com",
        "excludedSince": "2016-03-12",
        "excludedTill": "2016-03-14"
        }
      ];


    jest.spyOn(httpService, 'get').mockImplementationOnce((key: string, defaultSupplier: any) => of(res));

    service.fetchList();
    setTimeout(() => {
      expect(service.blockedWebsite.length).toEqual(2);
    }, 500);
    done();
    

  });

});
