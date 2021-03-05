import React, { useState } from 'react';
import { Box } from 'grommet';
import { Info } from './Info';
import { Objective } from './Objective';
import { Table } from './Table';
import { Detail } from './Detail';
import data from '../assets/HYBRID.json';

export const Analysis = (props) => {
  const [range, setRange] = useState([0,data.time.data.length]);
  const [hideTable, setHideTable] = useState(true);
  const [hideDetail, setHideDetail] = useState(false);

  return(
    <Box
      background='background'
      pad={{vertical: 'medium', horizontal: 'large'}} gap='medium'>
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
      <Box direction='row' gap='medium' fill='horizontal'>
        <Detail
          team={1} data={data} range={range} onRangeChange={setRange}
          hide={hideDetail} onHide={setHideDetail}/>
          <Detail
            team={2} data={data} range={range} onRangeChange={setRange}
            hide={hideDetail} onHide={setHideDetail}/>
      </Box>
    </Box>
  );
}
