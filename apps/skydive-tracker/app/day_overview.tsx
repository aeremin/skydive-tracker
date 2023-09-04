import React from 'react';
import {AggregatedJumpLoad} from "@skydive-tracker/api";
import {getTodayLoads} from "./api/backend";
import moment from "moment";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

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
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Take off</TableCell>
            <TableCell>Landing</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Altitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.loads.map((l, index) => (
          <TableRow key={index}>
            <TableCell>{index}</TableCell>
            <TableCell>{this.timestampToHumanReadable(l.start_timestamp)}</TableCell>
            <TableCell>{this.timestampToHumanReadable(l.finish_timestamp)}</TableCell>
            <TableCell>{this.durationToHumanReadable(l.total_seconds)}</TableCell>
            <TableCell>{this.aglMeters(l.max_altitude)}</TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    );
  }
}
