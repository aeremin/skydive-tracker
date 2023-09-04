'use client';

import {DayOverview} from "./day_overview";
import React from "react";
import {Container} from "@mui/material";

export default async function Index() {
  return (
    <div className="app">
      <Container>
        <DayOverview/>
      </Container>
    </div>
  );
}
