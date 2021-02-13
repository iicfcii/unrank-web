import React from 'react';
import { Box } from 'grommet';
import { Info } from './Info';
import { Objective } from './Objective';
import { Table } from './Table';
import data from '../assets/DEMO.json';

export const Analysis = (props) => {

  return(
    <Box
      background='background' align='center'
      pad={{vertical: 'medium', horizontal: 'large'}}
      gap='medium'>
      <Box direction='row' height='276px' gap='medium' fill='horizontal'>
        <Info data={data}/>
        <Objective data={data}/>
      </Box>
      <Box direction='row' gap='medium' fill='horizontal'>
        <Table data={data} team={1} range={[0, data.time.data.length]}/>
        <Table data={data} team={2} range={[0, data.time.data.length]}/>
      </Box>
    </Box>
  );
}
