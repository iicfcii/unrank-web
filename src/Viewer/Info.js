import React from 'react';
import { Box, Text, Anchor } from 'grommet';
import { StatBox } from './StatBox';
import { capitalize, formatSeconds } from '../utils';

export const Info = ({data, replay}) => {
  return(
    <StatBox gap='medium' flex={false}>
      <TextBox label='Duration' value={formatSeconds(data.time.data.length-1)}/>
      <TextBox label='Map' value={`${capitalize(data.map)}`}/>
      {replay && (
        <Box direction='row' width='264px' align='center' justify='between'>
          <Text size='small'>Data Download</Text>
          <Box
            width='150px' height='32px' justify='start' background='backgroundLight'
            round='xxsmall' direction='row'
            pad={{horizontal:'xsmall', vertical:'6px'}}
            border={{color:'line', size:'xsmall', side:'all', style:'solid'}}>
            <Anchor href={replay.get('json').url()} label='JSON' color='text' size='small'/>
            <Text size='small'>/</Text>
            <Anchor href={replay.get('csv').url()} label='CSV' color='text' size='small'/>
          </Box>
        </Box>
      )}
      {data.creation_time && (
        <TextBox label='Creation Date' value={data.creation_time.split(' ')[0]+'UTC'}/>
      )}
    </StatBox>
  );
}

const TextBox = (props) => {
  return (
    <Box direction='row' width='264px' align='center' justify='between'>
      <Text size='small'>{props.label}</Text>
      <Box
        width='150px' height='32px' justify='center' background='backgroundLight'
        pad={{horizontal:'xsmall', vertical:'6px'}} round='xxsmall'
        border={{color:'line', size:'xsmall', side:'all', style:'solid'}}>
        <Text size='small'>{props.value}</Text>
      </Box>
    </Box>
  );
}
