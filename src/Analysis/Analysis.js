import React from 'react';
import { Box } from 'grommet';
import { Info } from './Info';
import { Objective } from './Objective';
import data from '../assets/DEMO.json';

export const Analysis = (props) => {

  return(
    <Box background='background' pad='medium' align='center'>
      <Box direction='row' height='276px' gap='medium'>
        <Info/>
        <Objective data={data}/>
      </Box>
    </Box>
  );
}
