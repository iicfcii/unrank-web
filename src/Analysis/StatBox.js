import React from 'react';
import { Box } from 'grommet';

export const StatBox = (props) => {
  return(
    <Box
      background='white' justify='center' fill='vertical'
      pad='medium' round='xsmall' elevation='normal'
      border={{color:'border', size:'xsmall', side:'all', sytle:'solid'}}
      {...props}>
      {props.children}
    </Box>
  );
}
