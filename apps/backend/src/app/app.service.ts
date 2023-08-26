import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";

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

interface RawJumpLoad {
  points: (Aircraft & { now: number })[];
}

interface AggregatedJumpLoad {
  start_timestamp: number;
  start_altitude: number;

  finish_timestamp: number;
  finish_altitude: number;

  max_altitude: number;

  total_seconds: number;

  total_points: number;
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
      this.onNewData(r.data.now, r.data.ac[0]);
    } catch (e) {
      console.error(e);
    }
  }

  private onNewData(now: number, ac: Aircraft|undefined){
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
        this.onLoadFinished()
      }
    }
  }

  private onLoadFinished() {
    this.current_load.points = this.current_load.points.filter(p => p.alt_baro != undefined);
    if (this.current_load.points.length > 0) {
      const aggregated: AggregatedJumpLoad = {
        start_timestamp: this.current_load.points[0].now,
        start_altitude: this.current_load.points[0].alt_baro,

        finish_timestamp: this.current_load.points[this.current_load.points.length - 1].now,
        finish_altitude: this.current_load.points[this.current_load.points.length - 1].alt_baro,

        total_seconds: (this.current_load.points[this.current_load.points.length - 1].now - this.current_load.points[0].now) / 1000,
        total_points: this.current_load.points.length,
        max_altitude: Math.max(...this.current_load.points.map(p => p.alt_baro))
      };
      console.log(JSON.stringify(aggregated));
      this.loads.push(aggregated);
    } else {
      console.error(`Raw load is empty after filtering: ${JSON.stringify(this.current_load)}`);
    }
    this.current_load = undefined;
  }
}


