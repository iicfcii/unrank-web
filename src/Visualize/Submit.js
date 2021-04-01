import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, TextInput, Paragraph, Button, Anchor } from 'grommet';
import { validEmail, validReplay } from '../utils';
const AV = require('leancloud-storage');

export const Submit = (props) => {
  const [captcha, setCaptcha] = useState(null);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [repeatEmail, setRepeatEmail] = useState('');
  const [repeatEmailError, setRepeatEmailError] = useState(false);
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
          {emailError && (
            <Text size='small' color='red'>Not a valid email.</Text>
          )}
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Repeat email</Heading>
          <TextInput value={repeatEmail} onChange={(event) => {
            setRepeatEmail(event.target.value);
          }}/>
          {repeatEmailError && (
            <Text size='small' color='red'>Emails do not match.</Text>
          )}
        </Box>
        <Box align='start' justify='start' gap='xsmall'>
          <Heading level={6} margin='none'>Replay code</Heading>
          <TextInput
            placeholder='NOT case sensitive'
            value={replay}
            onChange={(event) => {
              setReplay(event.target.value);
            }}/>
          {replayError && (
            <Text size='small' color='red'>Not a valid replay code.</Text>
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
            placeholder='NOT case sensitive'
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

            let repeatEmailErrorNew = email!==repeatEmail;
            setRepeatEmailError(repeatEmailErrorNew);

            let replayErrorNew = !validReplay(replay);
            setReplayError(replayErrorNew);

            if (emailErrorNew || repeatEmailErrorNew || replayErrorNew) return;

            captcha.verify(captchaCode)
              .then((ErrorateToken) => {
                setCaptchaCodeError(false);
                // CHeck duplicate first
                const replayQ = new AV.Query('Replay');
                replayQ.equalTo('email', email);
                replayQ.equalTo('code', replay.toUpperCase());
                replayQ.first()
                  .then((r) => {
                    if (r) {
                      setStatus('Replay already submitted. You can try to retrieve it.');
                    } else {
                      const ReplayObj = AV.Object.extend('Replay');
                      const replayObj = new ReplayObj();
                      replayObj.set('email',  email);
                      replayObj.set('code',  replay.toUpperCase());
                      replayObj.set('status',  0);
                      replayObj.save()
                        .then(() => {
                          setStatus('Thanks for your submission.');
                        }, (error) => {
                          console.log(error);
                          setStatus('Submission failed. Please try again.');
                        });
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
