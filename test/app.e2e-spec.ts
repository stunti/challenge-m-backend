import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import  request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { WebsiteModule } from '../src/modules/website/website.module';

import 'jest';


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
	});
	afterAll(async () => {
    await app.close();
  });
});

describe('WebsiteModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [WebsiteModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('/website/2016-01-06/2016-01-07 (GET)', () => {
    return request(app.getHttpServer())
      .get('/website/2016-01-06/2016-01-07')
      .expect(200)
			.expect([{"name":"www.bing.com","visits":14065457,"date":"2016-01-06"},{"name":"www.ebay.com.au","visits":19831166,"date":"2016-01-06"},{"name":"www.facebook.com","visits":104346720,"date":"2016-01-06"},{"name":"mail.live.com","visits":21536612,"date":"2016-01-06"},{"name":"www.wikipedia.org","visits":13246531,"date":"2016-01-06"},{"name":"au.yahoo.com","visits":11492756,"date":"2016-01-06"},{"name":"www.google.com","visits":26165099,"date":"2016-01-06"},{"name":"ninemsn.com.au","visits":21734381,"date":"2016-01-06"},{"name":"www.youtube.com","visits":59811438,"date":"2016-01-06"},{"name":"www.google.com.au","visits":151749278,"date":"2016-01-06"}]);
	});	
	
	afterAll(async () => {
    await app.close();
  });
});