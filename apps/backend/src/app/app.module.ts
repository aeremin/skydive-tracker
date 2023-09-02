import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AdsbDataFetchingService } from './adsb-data-fetching.service';

import { HttpModule } from '@nestjs/axios';
import {FirestoreService} from "./firestore.service";

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AdsbDataFetchingService, FirestoreService],
})
export class AppModule {}

