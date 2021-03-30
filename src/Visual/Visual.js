import React from 'react';
import { Box, Text, Heading, TextInput, Paragraph, Button } from 'grommet';

export const Visual = (props) => {
  return(
    <Box justify='start' align='start' background='white' gap='medium' pad='xlarge'>
      <Heading level={3} margin='none'>Submit a Match</Heading>
      <Paragraph margin='none' fill size='small'>
       We will send you an email when the data for your match is ready.
       It should be ready within 1 day.
      </Paragraph>
      <Box gap='small'>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Email</Heading>
          <TextInput/>
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Repeat email</Heading>
          <TextInput/>
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Replay code</Heading>
          <TextInput/>
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Are you a robot?</Heading>
          <TextInput/>
        </Box>
      </Box>
      <Button label='Submit' size='small' primary onClick={() => {
      }}/>
      <Heading level={3} margin='none'>Retrieve a Match</Heading>
      <Paragraph margin='none' fill size='small'>
       We will ask for the email when you submitted the replay code. We don't like others peeking your matches.
      </Paragraph>
      <Box align='start' justify='start' gap='xsmall'>
        <Heading level={6} margin='none'>Replay code</Heading>
        <TextInput/>
      </Box>
      <Button label='Retrieve' size='small' primary onClick={() => {
      }}/>
    </Box>
  );
}
