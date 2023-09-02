export interface AggregatedJumpLoad {
  // Unix time in milliseconds
  start_timestamp: number;
  start_altitude: number;

  // Unix time in milliseconds
  finish_timestamp: number;
  finish_altitude: number;

  max_altitude: number;

  total_seconds: number;

  total_points: number;
}

export interface Aircraft {
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

export type AircraftWithTime = Aircraft & { now: number };
