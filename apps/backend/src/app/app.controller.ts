import { Controller, Get } from '@nestjs/common';

import { AdsbDataFetchingService } from './adsb-data-fetching.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AdsbDataFetchingService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
