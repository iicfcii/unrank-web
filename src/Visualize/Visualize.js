import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, TextInput, Paragraph, Button, Anchor } from 'grommet';
import { visualizeBanner } from '../assets/assets';
const AV = require('leancloud-storage');

export const Visualize = (props) => {
  const [mode, setMode] = useState('submit');

  const [captcha, setCaptcha] = useState(null);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [repeatEmail, setRepeatEmail] = useState('');
  const [repeatEmailError, setRepeatEmailError] = useState(false);
  const [replay, setReplay] = useState('');
  const [replayError, setReplayError] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaCodeError, setCaptchaCodeError] = useState(false);

  const [submitStatus, setSubmitStatus] = useState(false);

  const [captchaRe, setCaptchaRe] = useState(null);

  const [replayRe, setReplayRe] = useState('');
  const [replayReError, setReplayReError] = useState(false);
  const [captchaCodeRe, setCaptchaCodeRe] = useState('');
  const [captchaCodeReError, setCaptchaCodeReError] = useState(false);

  const [retrieveStatus, setRetrieveStatus] = useState(false);

  useEffect(() => {
    if (mode === 'submit') {
      AV.Captcha.request({ width:90, height:30,})
        .then(function(captcha) {
          setCaptcha(captcha);
        });
    } else {
      AV.Captcha.request({ width:90, height:30,})
        .then(function(captcha) {
          setCaptchaRe(captcha);
        });
    }
  },[mode]);

  return(
    <Box>
      <Box
        width='100%' height='300px'
        background={{image: `url(${visualizeBanner})`, position:'center'}}>
      </Box>
      <Box justify='start' align='start' background='white' gap='medium' pad='xlarge'>
        <Box direction='row' background='background'>
          <Tab selected={mode==='submit'} label='Submit' onClick={() => setMode('submit')}/>
          <Tab selected={mode==='retrieve'} label='Retrieve' onClick={() => setMode('retrieve')}/>
        </Box>
        {mode==='submit'?(
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

                  let repeatEmailErrorNew = email!==repeatEmail;
                  setRepeatEmailError(repeatEmailErrorNew);

                  let replayErrorNew = !validReplay(replay);
                  setReplayError(replayErrorNew);

                  if (emailErrorNew || repeatEmailErrorNew || replayErrorNew) return;

                  captcha.verify(captchaCode)
                    .then((ErrorateToken) => {
                      setCaptchaCodeError(false);
                        // Submit replay
                        console.log('submit replay');
                    })
                    .catch((error) => {
                      console.log(error)
                      setCaptchaCodeError(true);
                    });
                }}/>
              {submitStatus && (
                <Text size='medium'>{submitStatus}</Text>
              )}
            </Box>
          </Box>
        ):(
          <Box gap='medium'>
            <Heading level={3} margin='none'>Retrieve a Match</Heading>
            <Paragraph margin='none' fill size='small'>
             We will verify the entered email when you submitted the replay code. We don't like others peeking your matches.
            </Paragraph>
            <Box gap='small' width='300px'>
              <Box align='start' justify='start' gap='xsmall'>
                <Heading level={6} margin='none'>Replay code</Heading>
                <TextInput
                  value={replayRe}
                  onChange={(event) => {
                    setReplayRe(event.target.value);
                  }}/>
                {replayReError && (
                  <Text size='small' color='red'>Not a valid replay code.</Text>
                )}
              </Box>
              <Box align='start' justify='start' gap='xsmall'>
                <Heading level={6} margin='none'>Are you a robot?</Heading>
                {captchaRe && (
                  <Box direction='row' gap='xsmall' align='center'>
                    <Box width='90px' height='30px' background={{image:`url(${captchaRe.url})`}}></Box>
                    <Anchor label='Try another.' size='small' onClick={() => {
                      AV.Captcha.request({ width:90, height:30,})
                        .then(function(captcha) {
                          setCaptchaRe(captcha);
                        });
                    }}/>
                  </Box>
                )}
                <TextInput
                  placeholder='Code is NOT case sensitive.'
                  value={captchaCodeRe}
                  onChange={(event) => {
                    setCaptchaCodeRe(event.target.value);
                  }}/>
                {captchaCodeReError && (
                  <Text size='small' color='red'>Code does not match image.</Text>
                )}
              </Box>
            </Box>
            <Box align='start' gap='xsmall'>
              <Button
                label='Retrieve' size='small' primary
                onClick={() => {
                  let replayReErrorNew = !validReplay(replayRe);
                  setReplayReError(replayReErrorNew);

                  if (replayReErrorNew) return;

                  captchaRe.verify(captchaCodeRe)
                    .then((ErrorateToken) => {
                      setCaptchaCodeReError(false);
                        // Submit replay
                        console.log('retrieve replay');
                    })
                    .catch((error) => {
                      console.log(error)
                      setCaptchaCodeReError(true);
                    });

                }}/>
              {retrieveStatus && (
                <Text size='medium'>{retrieveStatus}</Text>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const Tab = ({selected, onClick, label}) => {
  return (
    <Box
      justify='center' align='center' gap='xxxsmall' direction='row'
      pad={{horizontal:'large', vertical:'small'}} width='200px'
      border={{color:selected?'line':'none', size:'2px', side:'bottom', style:'solid'}}
      onClick={onClick}>
      <Text size='medium'>{label}</Text>
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
