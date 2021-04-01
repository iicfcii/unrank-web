import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, TextInput, Paragraph, Button, Anchor } from 'grommet';
import { validEmail, validReplay } from '../utils';
const AV = require('leancloud-storage');

export const Retrieve = (props) => {
  const [captcha, setCaptcha] = useState(null);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [replay, setReplay] = useState('');
  const [replayError, setReplayError] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaCodeError, setCaptchaCodeError] = useState(false);

  const [status, setStatus] = useState(false);

  useEffect(() => {
    AV.Captcha.request({ width:90, height:30,})
      .then(function(captcha) {
        setCaptcha(captcha);
      });
  },[]);

  return(
    <Box gap='medium'>
      <Heading level={3} margin='none'>Retrieve a Match</Heading>
      <Paragraph margin='none' fill size='small'>
        Please use the email you enetered during submission and the replay code
        to retrieve the data.
      </Paragraph>
      <Box gap='small' width='300px'>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Email</Heading>
          <TextInput value={email} onChange={(event) => {
            setEmail(event.target.value);
          }}/>
          {emailError && (
            <Text size='small' color='red'>Not a valid email.</Text>
          )}
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Replay code</Heading>
          <TextInput value={replay} onChange={(event) => {
            setReplay(event.target.value);
          }}/>
          {replayError && (
            <Text size='small' color='red'>Not a Error replay code.</Text>
          )}
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
            placeholder='Code is NOT case sensitive.'
            value={captchaCode}
            onChange={(event) => {
              setCaptchaCode(event.target.value);
            }}/>
          {captchaCodeError && (
            <Text size='small' color='red'>Code does not match image.</Text>
          )}
        </Box>
      </Box>
      <Box align='start' gap='xsmall'>
        <Button
          label='Submit' size='small' primary
          onClick={() => {
            let emailErrorNew = !validEmail(email);
            setEmailError(emailErrorNew);

            let replayErrorNew = !validReplay(replay);
            setReplayError(replayErrorNew);

            if (emailErrorNew || replayErrorNew) return;

            captcha.verify(captchaCode)
              .then((ErrorateToken) => {
                setCaptchaCodeError(false);
                const replayQ = new AV.Query('Replay');
                replayQ.equalTo('email', email);
                replayQ.equalTo('code', replay.toUpperCase());
                replayQ.first()
                  .then((r) => {
                    if (r) {
                      setStatus('Successfully retrieved replay.');
                    } else {
                      setStatus('No replay found.');
                    }
                  });
              })
              .catch((error) => {
                console.log(error)
                setCaptchaCodeError(true);
              });
          }}/>
        {status && (
          <Text size='medium'>{status}</Text>
        )}
      </Box>
    </Box>
  );
}
