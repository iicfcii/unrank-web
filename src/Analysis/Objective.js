import React from 'react';
import { Box, Chart } from 'grommet';
import { StatBox } from './StatBox';

export const Objective = (props) => {

  return(
    <StatBox>
      <Box direction='row'>
      <Chart
        type='area'
        thickness='3px'
        values={[
          {
            value: [0,0],
            label: 'first',
            onHover: () => {console.log('hover')},
            color: 'red'
          },
          {
            value: [1,10],
            label: 'first',
            onHover: () => {console.log('hover')}
          }
        ]}/>
      </Box>
    </StatBox>
  );
}
