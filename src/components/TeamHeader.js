import React from 'react';
import { Box, Text } from 'grommet';
import { Down, Up } from 'grommet-icons';
import { teamToColor, teamToRowDirection } from '../utils';

export const TeamHeader = ({team, hide, onHide}) => {
  return (
    <Box
      direction={teamToRowDirection(team)} justify='between' align='center'
      pad={{horizontal: 'small', vertical: 'xsmall'}}
      background={{color:teamToColor(team), opacity:'0.1'}}>
      <Box
        justify='center' align='center'
        width='36px' height='36px'
        onClick={() => {if (onHide) onHide(!hide)}}>
        {hide?(
          <Down size='16px' color='text'/>
        ):(
          <Up size='16px' color='text'/>
        )}
      </Box>
      <Text weight={700} color={teamToColor(team)}>{`队伍${team}`}</Text>
    </Box>
  );
}
