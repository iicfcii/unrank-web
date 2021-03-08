import React from 'react';
import { useHistory } from "react-router-dom";
import { Box, Heading, Text, Image, Button } from 'grommet';
import { homeDataCollection, homeDataExample } from '../assets/assets';
import { Link } from '../utils';

export const Home = (props) => {
  const history = useHistory();

  return(
    <Box>
      <Box justify='center' align='center' height='300px' background='white' gap='medium'>
        <Heading level={1} margin='none'>Unrank</Heading>
        <Heading level={1} margin='none'>Data visualization for Overwatch matches</Heading>
      </Box>
      <Box justify='center' align='center' height='400px' direction='row' gap='large'>
        <Box width='500px' gap='small'>
          <Heading level={3} margin='none'>Intelligent Collection</Heading>
          <Text size='medium'>A replay code gives you objective progress, hero composition, ultimate usage, elimination, and other improtant statistics. </Text>
        </Box>
        <Box width='500px' round='xsmall' overflow='hidden'>
          <Image fit='cover' src={homeDataCollection}/>
        </Box>
      </Box>
      <Box justify='center' align='center' height='400px' direction='row' gap='large' background='white'>
        <Box width='500px' round='xsmall' overflow='hidden'>
          <Image fit='cover' src={homeDataCollection}/>
        </Box>
        <Box width='500px' gap='small'>
          <Heading level={3} margin='none'>Interactive Visualization</Heading>
          <Text size='medium'>All the data can be viewed right in the web browser, zoomed in for every team fight or zoomed out for the overall performance. </Text>
        </Box>
      </Box>
      <Box justify='center' align='center' height='400px' direction='row' gap='large'>
        <Box width='500px' gap='small'>
          <Heading level={3} margin='none'>Your Match Your Data</Heading>
          <Text size='medium'>With a signle click, match data can be exported to standard format, for further analysis with your favorite software. </Text>
        </Box>
        <Box width='500px' round='xsmall' overflow='hidden'>
          <Image fit='cover' src={homeDataExample}/>
        </Box>
      </Box>
      <Box justify='center' align='center' height='200px' direction='row' gap='large' background='white'>
        <Button label='Demo' size='large' onClick={() => {
          history.push('/demo');
          window.scrollTo(0, 0);
        }}/>
      </Box>
    </Box>
  );
}
