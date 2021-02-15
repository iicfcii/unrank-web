import React, { useState } from 'react';
import { Box } from 'grommet';
import { Info } from './Info';
import { Objective } from './Objective';
import { Table } from './Table';
import data from '../assets/DEMO.json';

export const Analysis = (props) => {
  const [range, setRange] = useState([0,data.time.data.length]);
  const [hideTable, setHideTable] = useState(false);

  return(
    <Box
      background='background' align='center'
      pad={{vertical: 'medium', horizontal: 'large'}}
      gap='medium'>
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
