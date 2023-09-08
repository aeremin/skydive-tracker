import {AggregatedJumpLoad, OngoingJumpLoad} from "@skydive-tracker/api";
import axios from "axios";
import moment from "moment";

const BACKEND_BASE_URL = 'http://34.159.95.27/api'

export async function getTodayLoads(): Promise<AggregatedJumpLoad[]> {
  const response = await axios.get<AggregatedJumpLoad[]>(`${BACKEND_BASE_URL}/loads/today`);
  return response.data;
}

export async function getLoadsAtDate(date: moment.Moment): Promise<AggregatedJumpLoad[]> {
  const response = await axios.get<AggregatedJumpLoad[]>(`${BACKEND_BASE_URL}/loads/date/${date.format("YYYY-MM-DD")}`);
  return response.data;
}

export async function getOngoingLoad(): Promise<OngoingJumpLoad | undefined> {
  const response = await axios.get<OngoingJumpLoad | undefined>(`${BACKEND_BASE_URL}/loads/ongoing`);
  return response.data || undefined;
}
