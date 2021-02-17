import React, { useState } from 'react';
import { Box } from 'grommet';
import { Info } from './Info';
import { Objective } from './Objective';
import { Table } from './Table';
import { TimeSelector } from './RangeSelector';
import data from '../assets/DEMO.json';

export const Analysis = (props) => {
  const [range, setRange] = useState([0,data.time.data.length]);
  const [hideTable, setHideTable] = useState(false);
  const [testRange, setTestRange] = useState([0,100]);

  return(
    <Box
      background='background'
      pad={{vertical: 'medium', horizontal: 'large'}} gap='medium'>
      <TimeSelector
        range={testRange} max={100}
        onChange={setTestRange}/>
      <Box direction='row' height='276px' gap='medium' fill='horizontal'>
        <Info data={data}/>
        <Objective data={data} range={range} onRangeChange={setRange}/>
      </Box>
      <Box direction='row' gap='medium' fill='horizontal'>
        <Table
          team={1} data={data} range={range}
          hide={hideTable} onHide={setHideTable}/>
        <Table
          team={2} data={data} range={range}
          hide={hideTable} onHide={setHideTable}/>
      </Box>
    </Box>
  );
}
