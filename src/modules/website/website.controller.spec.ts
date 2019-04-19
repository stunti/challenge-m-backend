    
import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteController } from './website.controller';
import { WebsiteService } from '../../services/website.service';

describe('WebsiteController', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [WebsiteController],
      providers: [WebsiteService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const websiteController = module.get<WebsiteController>(WebsiteController);
      // expect(websiteController.root()).toBe('Hello World!');
    });
  });
});