import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";

interface Aircraft {
  hex: string;
  type: string;
  flight: string;
  r: string;
  t: string;
  alt_baro: number;
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

interface JumpLoad {
  start_timestamp: number;
  start_altitude: number;

  finish_timestamp: number;
  finish_altitude: number;

  max_altitude: number;
}

@Injectable()
export class AppService {
  private loads: JumpLoad[] = [];
  private current_load: JumpLoad|undefined = undefined;
  constructor(private readonly httpService: HttpService) {
    this.downloadData();
    setInterval(async () => this.downloadData(), 10000);
  }

  async getData() {
    return {message: `Loads info: ${JSON.stringify(this.loads)}`};
  }

  async downloadData() {
    const r = await firstValueFrom(this.httpService.get<AdsbResponse>(`https://api.adsb.one/v2/hex/${kPlaneIcao}`));
    this.onNewData(r.data.now, r.data.ac[0]);
  }

  onNewData(now: number, ac: Aircraft|undefined){
    if (this.current_load == undefined) {
      if (ac != undefined) {
        // New load
        this.current_load = {
          start_timestamp: now,
          start_altitude: ac.alt_baro,
          finish_timestamp: now,
          finish_altitude: ac.alt_baro,
          max_altitude: ac.alt_baro,
        }
      }
    } else {
      if (ac != undefined) {
        // Ongoing load
        this.current_load = {
          ...this.current_load,
          finish_timestamp: now,
          finish_altitude: ac.alt_baro,
          max_altitude: Math.max(this.current_load.max_altitude, ac.alt_baro),
        }
      } else {
        // Finished load
        console.log(JSON.stringify(this.current_load));
        this.loads.push(this.current_load);
        this.current_load = undefined;
      }
    }
  }
}


