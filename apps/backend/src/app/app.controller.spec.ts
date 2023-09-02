import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AdsbDataFetchingService } from './adsb-data-fetching.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AdsbDataFetchingService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
