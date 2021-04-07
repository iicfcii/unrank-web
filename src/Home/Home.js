import React from 'react';
import { Box, Heading, Text, Image } from 'grommet';
import { homeCollection, homeVisualization, homeExample } from '../assets/assets';
import { Link } from '../utils';

export const Home = (props) => {
  return(
    <Box>
      <Box justify='center' align='center' background='white' gap='medium' pad='xlarge'>
        <Heading level={1} margin='none' textAlign='center'>Unrank</Heading>
        <Heading level={1} margin='none' textAlign='center'>Data visualization for Overwatch matches</Heading>
      </Box>
      <Box justify='center' align='center' direction='row' gap='large' pad='xlarge'>
        <Box width='500px' gap='small'>
          <Heading level={3} margin='none'>Intelligent Collection</Heading>
          <Text size='medium'>A replay code gives you objective progress, hero composition, ultimate usage, elimination, and other improtant statistics for the entire match. </Text>
        </Box>
        <Box width='500px' round='xsmall' overflow='hidden'>
          <Image fit='cover' src={homeCollection}/>
        </Box>
      </Box>
      <Box justify='center' align='center' direction='row' gap='large' background='white' pad='xlarge'>
        <Box width='500px' round='xsmall' overflow='hidden'>
          <Image fit='cover' src={homeVisualization}/>
        </Box>
        <Box width='500px' gap='small'>
          <Heading level={3} margin='none'>Interactive Visualization</Heading>
          <Text size='medium'>All the data can be viewed right in the web browser, zoomed in for every team fight or zoomed out for the overall performance. </Text>
        </Box>
      </Box>
      <Box justify='center' align='center' direction='row' gap='large' pad='xlarge'>
        <Box width='500px' gap='small'>
          <Heading level={3} margin='none'>Your Match Your Data</Heading>
          <Text size='medium'>With a signle click, match data can be exported to standard format for further analysis with your favorite software. </Text>
        </Box>
        <Box width='500px' round='xsmall' overflow='hidden'>
          <Image fit='cover' src={homeExample}/>
        </Box>
      </Box>
      <Box justify='center' align='center' direction='row' gap='large' background='white' pad='xlarge'>
        <Link to='/visualize' style={{borderRadius: '4px'}}>
          <Box
            round='xxsmall' background='orange'
            pad={{horizontal:'xlarge',vertical:'small'}}>
            <Text color='white' size='medium' weight={700}>Visualize Matches</Text>
          </Box>
        </Link>
        <Link to='/demo' style={{borderRadius: '4px'}}>
          <Box
            border={{color:'orange', size: '2px'}} round='xxsmall'
            pad={{horizontal:'46px',vertical:'10px'}}>
            <Text color='orange' size='medium' weight={700}>View Demos</Text>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
