import {Firestore} from "@google-cloud/firestore";
import {Injectable} from "@nestjs/common";
import {AggregatedJumpLoad, AircraftWithTime} from "@skydive-tracker/api";

const firestore = new Firestore({databaseId: 'skydive-tracker'});

@Injectable()
export class FirestoreService {
  publishDataPoint(p: AircraftWithTime) {
    return firestore.collection('data_points').add(p);
  }

  publishAggregatedLoad(l: AggregatedJumpLoad) {
    return firestore.collection('aggregated_loads').add(l);
  }
}
