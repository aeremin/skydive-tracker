import { Test } from '@nestjs/testing';

import { AdsbDataFetchingService } from './adsb-data-fetching.service';

describe('AppService', () => {
  let service: AdsbDataFetchingService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AdsbDataFetchingService],
    }).compile();

    service = app.get<AdsbDataFetchingService>(AdsbDataFetchingService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
