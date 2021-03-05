import React, { useState } from 'react';
import { Box, Select, Text } from 'grommet';
import { DataViewer } from '../Analysis/DataViewer';
import { StatBox } from '../Analysis/StatBox';
import escort from '../assets/escort.json';
import assault from '../assets/assault.json';
import hybrid from '../assets/hybrid.json';
import control from '../assets/control.json';

const DEMOS = {
  'Escort': escort,
  'Assault': assault,
  'Hybrid': hybrid,
  'Control': control
}

export const Demo = (props) => {
  const [type, setType] = useState('Escort');

  return(
    <Box pad={{vertical: 'medium', horizontal: 'large'}} gap='medium'>
      <StatBox>
        <Box direction='row' align='center' justify='start' gap='xsmall'>
          <Text size='small'>地图类型</Text>
          <Box direction='row' width='200px'>
            <Select
              options={Object.keys(DEMOS)}
              value={type}
              onChange={({value}) => setType(value)}/>
          </Box>
        </Box>
      </StatBox>
      <DataViewer data={DEMOS[type]}/>
    </Box>
  );
}
