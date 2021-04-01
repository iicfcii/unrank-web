import React, { useState } from 'react';
import { Box, Text } from 'grommet';
import { Submit } from './Submit';
import { Retrieve } from './Retrieve';
import { visualizeBanner } from '../assets/assets';

export const Visualize = (props) => {
  const [mode, setMode] = useState('submit');

  return(
    <Box>
      <Box
        width='100%' height='300px'
        background={{image: `url(${visualizeBanner})`, position:'center'}}>
      </Box>
      <Box justify='start' align='start' background='white' gap='medium' pad='xlarge'>
        <Box direction='row' background='background'>
          <Tab selected={mode==='submit'} label='Submit' onClick={() => setMode('submit')}/>
          <Tab selected={mode==='retrieve'} label='Retrieve' onClick={() => setMode('retrieve')}/>
        </Box>
        {mode==='submit'?(
          <Submit/>
        ):(
          <Retrieve/>
        )}
      </Box>
    </Box>
  );
}

const Tab = ({selected, onClick, label}) => {
  return (
    <Box
      justify='center' align='center' gap='xxxsmall' direction='row'
      pad={{horizontal:'large', vertical:'small'}} width='200px'
      border={{color:selected?'line':'none', size:'2px', side:'bottom', style:'solid'}}
      onClick={onClick}>
      <Text size='medium'>{label}</Text>
    </Box>
  );
}
