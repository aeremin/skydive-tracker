import {Controller, Get, Param} from '@nestjs/common';

import { AdsbDataFetchingService } from './adsb-data-fetching.service';
import {FirestoreService} from "./firestore.service";

@Controller()
export class AppController {
  constructor(private readonly adsbService: AdsbDataFetchingService,
              private readonly firestoreService: FirestoreService) {}

  @Get('raw_data')
  getRawData() {
    return this.adsbService.getData();
  }

  @Get('loads/today')
  getTodayLoads() {
    return this.firestoreService.getTodaysLoads();
  }

  @Get('loads/date/:date')
  getLoadsAt(@Param('date') date: string) {
    return this.firestoreService.getLoadsAt(date);
  }
}
