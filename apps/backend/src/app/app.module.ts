import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HttpModule } from '@nestjs/axios';
import {FirestoreService} from "./firestore.service";

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, FirestoreService],
})
export class AppModule {}

