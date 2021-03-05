import React from 'react';
import { Box, Text } from 'grommet';
import { StatBox } from './StatBox';
import { capitalize, formatSeconds } from '../utils';

export const Info = ({data}) => {
  return(
    <StatBox gap='large' flex={false}>
      <TextBox label='回放代码' value={data.code?data.code:'NA'}/>
      <TextBox label='总时长' value={formatSeconds(data.time.data.length-1)}/>
      <TextBox label='地图' value={`${capitalize(data.map)}`}/>
    </StatBox>
  );
}

const TextBox = (props) => {
  return (
    <Box direction='row' width='264px' align='center' justify='between'>
      <Text size='small'>{props.label}</Text>
      <Box
        width='200px' height='32px' justify='center' background='backgroundLight'
        pad={{horizontal:'xsmall', vertical:'6px'}} round='xxsmall'
        border={{color:'line', size:'xsmall', side:'all', style:'solid'}}>
        <Text size='small'>{props.value}</Text>
      </Box>
    </Box>
  );
}
