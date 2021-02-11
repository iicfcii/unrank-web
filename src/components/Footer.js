import React from 'react';
import { Link } from "react-router-dom";
import { Box, Text } from 'grommet';

export const Footer = (props) => {
  return(
    <Box
      direction='row' background='white' justify='between'
      height='60px' pad={{horizontal:'large'}}
      border={{color:'border', size:'xsmall', side:'top', style:'solid'}}>
      <Box justify='center'>
        <Text size='medium'>©2020 Unrank.gg</Text>
      </Box>
      <Box direction='row' align='center' gap='medium'>
        <Link to={'/about'} style={{textDecoration:'none', color:'inherit'}}>
          <Text size='medium'>联系我们</Text>
        </Link>
        <Box width='1px' height='14px' background='border'></Box>
        <Link to={'/legal'} style={{textDecoration:'none', color:'inherit'}}>
          <Text size='medium'>隐私和条款</Text>
        </Link>
      </Box>
    </Box>
  );
}
