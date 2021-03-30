import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, TextInput, Paragraph, Button, Anchor } from 'grommet';
const AV = require('leancloud-storage');

export const Visualize = (props) => {
  const [captcha, setCaptcha] = useState(null);
  const [email, setEmail] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');
  const [replay, setReplay] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  useEffect(() => {
    AV.Captcha.request({ width:90, height:30,})
      .then(function(captcha) {
        setCaptcha(captcha);
      });
  },[]);

  return(
    <Box justify='start' align='start' background='white' gap='medium' pad='xlarge'>
      <Heading level={3} margin='none'>Submit a Match</Heading>
      <Paragraph margin='none' fill size='small'>
       We will send you an email when the data for your match is ready.
       It should be ready within 1 day.
       You will need your email and replay code to access the data.
      </Paragraph>
      <Box gap='small' width='300px'>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Email</Heading>
          <TextInput value={email} onChange={(event) => {
            setEmail(event.target.value);
          }}/>
          <Text size='small' color='red'>Not a valid email.</Text>
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Repeat email</Heading>
          <TextInput value={repeatEmail} onChange={(event) => {
            setRepeatEmail(event.target.value);
          }}/>
          <Text size='small' color='red'>Emails do not match.</Text>
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Replay code</Heading>
          <TextInput value={replay} onChange={(event) => {
            setReplay(event.target.value);
          }}/>
          <Text size='small' color='red'>Not a valid replay code.</Text>
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Are you a robot?</Heading>
          {captcha && (
            <Box direction='row' gap='xsmall' align='center'>
              <Box width='90px' height='30px' background={{image:`url(${captcha.url})`}}></Box>
              <Anchor label='Try another.' size='small' onClick={() => {
                AV.Captcha.request({ width:90, height:30,})
                  .then(function(captcha) {
                    setCaptcha(captcha);
                  });
              }}/>
            </Box>
          )}
          <TextInput
            placeholder='Enter the code in the image.'
            value={captchaCode}
            onChange={(event) => {
              setCaptchaCode(event.target.value);
            }}/>
          <Text size='small' color='red'>Code does not match image.</Text>
        </Box>
      </Box>
      <Button label='Submit' size='small' primary onClick={() => {
      }}/>
      <Heading level={3} margin='none'>Retrieve a Match</Heading>
      <Paragraph margin='none' fill size='small'>
       We will ask for the email you entered when you submitted the replay code. We don't like others peeking your matches.
      </Paragraph>
      <Box align='start' justify='start' gap='xsmall'>
        <Heading level={6} margin='none'>Replay code</Heading>
        <TextInput/>
        <Text size='small' color='red'>Not a valid replay code.</Text>
      </Box>
      <Button label='Retrieve' size='small' primary onClick={() => {
      }}/>
    </Box>
  );
}

const validEmail = (email) => {
  var re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

const validReplay = (replay) => {
  var re = /^[a-zA-z0-9]{6}$/;
  return re.test(replay);
}
