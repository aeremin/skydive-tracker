import React from 'react';
import { Table } from 'react-bootstrap';
import {AggregatedJumpLoad} from "@skydive-tracker/api";
import {getTodayLoads} from "./api/backend";
import moment from "moment";

const BEROMUNSTER_ASL_FEET = 2146;
const METERS_IN_FEET = 0.3048;

export class DayOverview extends React.Component<unknown, {loads: AggregatedJumpLoad[]}> {
  state: {loads: AggregatedJumpLoad[]} = {loads: []};

  async componentDidMount() {
    await this.loadLoads();
  }

  async loadLoads() {
    this.setState({loads: await getTodayLoads()});
  }

  private timestampToHumanReadable(t: number): string {
    return moment.unix(t / 1000).format("HH:mm");
  }

  private durationToHumanReadable(seconds: number): string {
    return moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('mm:ss');
  }

  private aglMeters(aslFeet: number): number {
    return Math.floor((aslFeet - BEROMUNSTER_ASL_FEET) * METERS_IN_FEET);
  }

  render() {
    return (
      <Table>
        <tbody>
        <tr>
          <th>#</th>
          <th>Take off</th>
          <th>Landing</th>
          <th>Duration</th>
          <th>Altitude</th>
        </tr>
        {this.state.loads.map((l, index) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{this.timestampToHumanReadable(l.start_timestamp)}</td>
            <td>{this.timestampToHumanReadable(l.finish_timestamp)}</td>
            <td>{this.durationToHumanReadable(l.total_seconds)}</td>
            <td>{this.aglMeters(l.max_altitude)}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    );
  }
}
