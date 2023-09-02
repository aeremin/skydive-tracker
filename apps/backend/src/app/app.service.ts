import {Firestore} from '@google-cloud/firestore';
import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {AggregatedJumpLoad} from "@skydive-tracker/api";

const firestore = new Firestore({databaseId: 'skydive-tracker'});

const kMinSecondsBetweenLoads = 60;
const kMinLoadDurationSeconds = 180;

interface Aircraft {
  hex: string;
  type: string;
  flight: string;
  r: string;
  t: string;
  alt_baro?: number;
  squawk: string;
  rr_lat: number;
  rr_lon: number;
  alert: number;
  spi: number;
  messages: number;
  seen: number;
  rssi: number;
}
interface AdsbResponse {
  ac: Aircraft[];
  msg: string;
  now: number;
  total: number;
  ctime: number;
  ptime: number;
}

const kPlaneIcao = '3D72AB';

type AircraftWithTime = Aircraft & { now: number };

interface RawJumpLoad {
  points: AircraftWithTime[];
}

@Injectable()
export class AppService {
  private loads: AggregatedJumpLoad[] = [];
  private current_load: RawJumpLoad|undefined = undefined;
  constructor(private readonly httpService: HttpService) {
    this.downloadData();
    setInterval(async () => this.downloadData(), 10000);
  }

  async getData() {
    return {message: `Current load: ${JSON.stringify(this.current_load)}, Loads info: ${JSON.stringify(this.loads)}`};
  }

  private async downloadData() {
    try {
      const r = await firstValueFrom(this.httpService.get<AdsbResponse>(`https://api.adsb.one/v2/hex/${kPlaneIcao}`));
      await this.onNewData(r.data.now, r.data.ac[0]);
    } catch (e) {
      console.error(e);
    }
  }

  private async onNewData(now: number, ac: Aircraft|undefined){
    await firestore.collection('data_points').add({...ac, now});
    if (this.current_load == undefined) {
      if (ac != undefined) {
        this.current_load = {
          points: [{...ac, now}]
        }
      }
    } else {
      if (ac != undefined) {
        this.current_load.points.push({...ac, now});
      } else {
        if ((now - this.lastPoint().now) / 1000 > kMinSecondsBetweenLoads) {
          await this.onLoadFinished()
        }
      }
    }
  }

  private lastPoint() {
    return this.current_load.points[this.current_load.points.length - 1]
  }

  private async onLoadFinished() {
    this.current_load.points = this.current_load.points.filter(p => p.alt_baro != undefined);
    if (this.current_load.points.length > 0) {
      const aggregated: AggregatedJumpLoad = {
        start_timestamp: this.current_load.points[0].now,
        start_altitude: this.current_load.points[0].alt_baro,

        finish_timestamp: this.lastPoint().now,
        finish_altitude: this.lastPoint().alt_baro,

        total_seconds: (this.lastPoint().now - this.current_load.points[0].now) / 1000,
        total_points: this.current_load.points.length,
        max_altitude: Math.max(...this.current_load.points.map(p => p.alt_baro))
      };
      if (aggregated.total_seconds >= kMinLoadDurationSeconds) {
        console.log(JSON.stringify(aggregated));
        this.loads.push(aggregated);
        await firestore.collection('aggregated_loads').add(aggregated);
      }
    } else {
      console.error(`Raw load is empty after filtering: ${JSON.stringify(this.current_load)}`);
    }
    this.current_load = undefined;
  }
}


