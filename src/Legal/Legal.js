import React from 'react';
import { Box, Heading, Paragraph } from 'grommet';

export const Legal = (props) => {
  return(
    <Box>
      <Box justify='start' align='start' background='white' gap='medium' pad='xlarge'>
        <Heading level={3} margin='none'>Legal</Heading>
        <Paragraph margin='none' fill>
          We collect and visualize data of Overwatch matches through the in-game replay system.
          The data stored include ultimate usage, ultimate progress, map,
          objective type, objective progress, eliminations, hero compositions,
          and more purely match related data.
        </Paragraph>
        <Paragraph margin='none' fill>
          The data stored do not contain player ids.
          To avoid tracing back to the player id of the match,
          the replay code is not shown on the website.
          The match footage is saved but is usually deleted within one month.
        </Paragraph>
        <Paragraph margin='none' fill>
          A small number of Overwatch assets are used on the website for better user experience.
          Please contact us if this is not allowed.
        </Paragraph>
      </Box>
    </Box>
  );
}
