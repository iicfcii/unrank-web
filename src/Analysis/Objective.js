import React from 'react';
import { Box, Text, Button } from 'grommet';
import { StatBox } from './StatBox';
import { TimeSelector} from './TimeSelector';
import { ObjectiveChart} from './ObjectiveChart';
import { capitalize } from '../utils';

export const Objective = ({data, range, onRangeChange}) => {
  return(
    <StatBox fill>
      <Box direction='row' justify='between' flex={false}>
        <Box direction='row' align='center' gap='xxsmall'>
          <Box background='orange' width='4px' height='12px'></Box>
          <Text weight={700} size='small'>{capitalize(data.objective.type)}</Text>
        </Box>
        <Box direction='row' gap='xlarge'>
          <Box direction='row' align='center' gap='xsmall'>
            <Box width='12px' height='12px' round background='blue'></Box>
            <Text size='small' color='textLight'>Team 1 Defend</Text>
          </Box>
          <Box direction='row' align='center' gap='xsmall'>
            <Box width='12px' height='12px' round background='red'></Box>
            <Text size='small' color='textLight'>Team 2 Defend</Text>
          </Box>
        </Box>
        <Button label='All Match' size='small' onClick={() => {
          let rangeNew = [0,data.time.data.length];
          if(onRangeChange) onRangeChange(rangeNew);
        }}/>
      </Box>
      <Box fill pad={{top:'12px', left:'48px', right:'24px'}}>
        <ObjectiveChart data={data} onRangeChange={onRangeChange}/>
        <TimeSelector
          range={[range[0],range[1]-1]}
          max={data.time.data.length-1}
          onChange={(values) => {
            let rangeNew = [values[0],values[1]+1]
            if(onRangeChange) onRangeChange(rangeNew);
          }}/>
      </Box>
    </StatBox>
  );
}
