import React from 'react';
import { Box, Text } from 'grommet';
import { Link } from './utils';

export const Footer = (props) => {
  return(
    <Box
      direction='row' background='white' justify='between'
      height='48px' pad={{horizontal:'large'}}
      border={{color:'border', size:'xsmall', side:'top', style:'solid'}}>
      <Box justify='center'>
        <Text size='small'>©2020 Unrank.gg</Text>
      </Box>
      <Box direction='row' align='center' gap='medium'>
        <Link to={'/about'}>
          <Text size='small'>联系我们</Text>
        </Link>
        <Box width='1px' height='14px' background='border'></Box>
        <Link to={'/legal'}>
          <Text size='small'>隐私和条款</Text>
        </Link>
      </Box>
    </Box>
  );
}
