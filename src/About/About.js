import React from 'react';
import { Box, Heading, Paragraph } from 'grommet';

export const About = (props) => {
  return(
    <Box>
      <Box justify='start' align='start' background='white' gap='medium' pad='xlarge'>
        <Heading level={3} margin='none'>About</Heading>
        <Paragraph margin='none' fill>
          We love Overwatch.
          We love every hero and every map.
          However, its first person nature constrains our judement and thinking.
          We fed. We quarrelled. We blamed the game. We lost the fun.
        </Paragraph>
        <Paragraph margin='none' fill>
          Unrank wants to view the game from a different angle.
          Through collection and visualization of the key data,
          we present matches from a third person perspective.
          Let's explore the intricacy of hero counters,
          ultimate economy, team fight timing, and many more together.
        </Paragraph>
        <Paragraph margin='none' fill>
          If you have any question or suggestion, please email <a href='mailto:iicfcii@gmail.com'>us</a>.
        </Paragraph>
      </Box>
    </Box>
  );
}
