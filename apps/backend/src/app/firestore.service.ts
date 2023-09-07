import {Firestore} from "@google-cloud/firestore";
import {Injectable} from "@nestjs/common";
import {AggregatedJumpLoad, AircraftWithTime, OngoingJumpLoad} from "@skydive-tracker/api";
import moment from "moment";

const firestore = new Firestore({databaseId: 'skydive-tracker'});

@Injectable()
export class FirestoreService {
  private kAggregatedLoadsDbPath = 'aggregated_loads';
  private kOngoingLoadDbPath = 'ongoing_load';
  private kOngoingLoadId = 'singleton';
  private kDataPointsDbPath = 'data_points';

  publishDataPoint(p: AircraftWithTime) {
    return firestore.collection(this.kDataPointsDbPath).add(p);
  }

  async publishFinishedAggregatedLoad(l: AggregatedJumpLoad) {
    await firestore.collection(this.kAggregatedLoadsDbPath).add(l);
    await firestore.collection(this.kOngoingLoadDbPath).doc(this.kOngoingLoadId).set(undefined);
  }

  publishOngoingLoad(l: OngoingJumpLoad) {
    return firestore.collection(this.kOngoingLoadDbPath).doc(this.kOngoingLoadId).set(l);
  }

  async getOngoingLoad(): Promise<OngoingJumpLoad | undefined> {
    return (await firestore.collection(this.kOngoingLoadDbPath).doc(this.kOngoingLoadId).get()).data() as OngoingJumpLoad | undefined
  }

  getTodaysLoads(): Promise<AggregatedJumpLoad[]> {
    return this.getLoadsAtMomentDay(moment());
  }

  // `date` is ISO 8601 string.
  getLoadsAt(date: string): Promise<AggregatedJumpLoad[]> {
    return this.getLoadsAtMomentDay(moment(date, moment.ISO_8601));
  }

  private async getLoadsAtMomentDay(day: moment.Moment) : Promise<AggregatedJumpLoad[]> {
    const r = await firestore.collection(this.kAggregatedLoadsDbPath)
      .where('start_timestamp', '>=', day.startOf('day').valueOf())
      .where('start_timestamp', '<', day.endOf('day').valueOf()).get();
    return r.docs.map(d => d.data() as AggregatedJumpLoad);
  }


}
