import {AggregatedJumpLoad} from "@skydive-tracker/api";
import axios from "axios";

const BACKEND_BASE_URL = 'http://34.159.95.27/api'

export async function getTodayLoads(): Promise<AggregatedJumpLoad[]> {
  const response = await axios.get<AggregatedJumpLoad[]>(`${BACKEND_BASE_URL}/loads/today`);
  return response.data;
}
