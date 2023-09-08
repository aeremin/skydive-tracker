import React from 'react';
import {AggregatedJumpLoad, OngoingJumpLoad} from "@skydive-tracker/api";
import {getLoadsAtDate, getOngoingLoad, getTodayLoads} from "./api/backend";
import moment from "moment";
import {Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography, useTheme} from "@mui/material";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

const BEROMUNSTER_ASL_FEET = 2146;
const METERS_IN_FEET = 0.3048;

interface DayOverviewState {
  loads: AggregatedJumpLoad[];
  ongoing: OngoingJumpLoad | undefined;
}

export class DayOverview extends React.Component<{date: moment.Moment}, DayOverviewState> {
  state: DayOverviewState = {loads: [], ongoing: undefined};

  override async componentDidMount() {
    await this.loadLoads();
  }

  override async componentDidUpdate(prevProps : {date: moment.Moment}) {
    if (prevProps.date != this.props.date) {
      await this.loadLoads();
    }
  }

  private isToday(): boolean {
    return this.props.date.isSame(moment(), "day");
  }

  async loadLoads() {
    this.setState({
      loads: await getLoadsAtDate(this.props.date),
      ongoing: this.isToday() ? await getOngoingLoad() : undefined,
    });
  }

  private timestampToHumanReadable(t: number): string {
    return moment.unix(t / 1000).format("HH:mm");
  }

  private durationToHumanReadable(seconds: number): string {
    return moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('mm:ss');
  }

  private aglMeters(aslFeet: number): number {
    if (aslFeet <= 0) return 0;
    return Math.floor((aslFeet - BEROMUNSTER_ASL_FEET) * METERS_IN_FEET);
  }

  private altitudeColor(theme: Theme, aglMeters: number): string {
    if (aglMeters < 2800) {
      return theme.palette.error.light;
    }

    if (aglMeters < 3600) {
      return theme.palette.warning.light;
    }

    return theme.palette.text.primary
  }

  renderOngoing() {
    if (this.state.ongoing == undefined) return undefined;
    const index = this.state.loads.length;
    return (<TableRow key={index}>
      <TableCell sx={{width: "2em"}}>{index + 1}</TableCell>
      <TableCell>{this.timestampToHumanReadable(this.state.ongoing.start_timestamp)}</TableCell>
      <TableCell>Ongoing</TableCell>
      <TableCell>{this.durationToHumanReadable(this.state.ongoing.total_seconds)}</TableCell>
      <TableCell>{this.aglMeters(this.state.ongoing.current_altitude)}</TableCell>
    </TableRow>)
  }

  override render() {
    return (
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{width: "2em"}}>#</TableCell>
            <TableCell>Take off</TableCell>
            <TableCell>Landing</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Altitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.loads.map((l, index) => (
          <TableRow key={index}>
            <TableCell sx={{width: "2em"}}>{index + 1}</TableCell>
            <TableCell>{this.timestampToHumanReadable(l.start_timestamp)}</TableCell>
            <TableCell>{this.timestampToHumanReadable(l.finish_timestamp)}</TableCell>
            <TableCell>{this.durationToHumanReadable(l.total_seconds)}</TableCell>
            <TableCell>
              <Typography variant="body2" color={theme => this.altitudeColor(theme, this.aglMeters(l.max_altitude))}>
                {this.aglMeters(l.max_altitude)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
        {this.renderOngoing()}
        </TableBody>
      </Table>
    );
  }
}
