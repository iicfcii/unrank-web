import React from 'react';
import { Box, Text } from 'grommet';
import { StatBox } from './StatBox';

export const Info = (props) => {
  return(
    <StatBox gap='large' flex={false}>
      <TextBox label='回放代码' value='DEMO'/>
      <TextBox label='总时长' value='15分00秒'/>
      <TextBox label='地图' value='哈瓦那(运载目标)'/>
    </StatBox>
  );
}

const TextBox = (props) => {
  return (
    <Box direction='row' width='264px' align='center' justify='between'>
      <Text size='small'>{props.label}</Text>
      <Box
        width='200px' height='32px' justify='center' background='#FBFBFB'
        pad={{horizontal:'xsmall', vertical:'6px'}} round='xxsmall'
        border={{color:'#EAEAEA', size:'xsmall', side:'all', style:'solid'}}>
        <Text size='small'>{props.value}</Text>
      </Box>
    </Box>
  );
}
