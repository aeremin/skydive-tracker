'use client';

import {DayOverview} from "./day_overview";
import React, {useState} from "react";
import {Container} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DateCalendar } from '@mui/x-date-pickers';
import moment from "moment";

export default async function Index() {
  return (
    <div className="app">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Page/>
      </LocalizationProvider>
    </div>
  );
}

class Page extends React.Component<unknown, {date: moment.Moment}> {
  state = {date: moment()}
  private setValueChecked(d: moment.Moment | null) {
    if (d) {
      this.setState({date: d})
    }
  }

  override render() {
    return (
      <Container maxWidth="sm">
        <DateCalendar value={this.state.date} onChange={(v) => this.setValueChecked(v)} />
        <DayOverview date={this.state.date}/>
      </Container>
    )
  }
}
