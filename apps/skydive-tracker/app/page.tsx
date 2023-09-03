'use client';

import Container from 'react-bootstrap/Container';
import {DayOverview} from "./day_overview";

export default async function Index() {
  return (
    <div className="app">
      <Container>
        <DayOverview/>
      </Container>
    </div>
  );
}
