import React, { useState, useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import { Box, Text } from 'grommet';
import { Analytics } from 'grommet-icons';
import { Link } from './utils';

const HOME_LABEL = 'Home';
const DEMO_LABEL = 'Demo';
const ABOUT_LABEL = 'About';

export const Header = (props) => {
  const [select, setSelect] = useState(HOME_LABEL);

  let matchHome = useRouteMatch('/');
  let matchDemo = useRouteMatch('/demo');
  let matchAbout = useRouteMatch('/about');

  let page = null;
  if (matchHome.isExact) page = HOME_LABEL;
  if (matchDemo) page = DEMO_LABEL;
  if (matchAbout) page = ABOUT_LABEL;

  useEffect(() => {setSelect(page)},[page]);

  return(
    <Box
      direction='row' background='white'
      height='64px' pad={{horizontal:'large'}}
      border={{color:'border', size:'xsmall', side:'bottom', style:'solid'}}>
      <Box flex={false} justify='center'>
        <Text weight={900} size='xxlarge'>Unrank</Text>
      </Box>
      <Box flex={false} direction='row' margin={{left:'large'}} gap='1px'>
        <Item
          label={HOME_LABEL} select={select===HOME_LABEL}
          to={'/'}/>
        <Item
          label={DEMO_LABEL} select={select===DEMO_LABEL}
          to={'/demo'}/>
        <Item
          label={ABOUT_LABEL} select={select===ABOUT_LABEL}
          to={'/about'}/>
      </Box>
      <Box fill direction='row' justify='end' align='center'>
        <Link to='/visualize' style={{borderRadius: '4px'}}>
          <Box
            direction='row' align='center' gap='xxsmall'
            border={{color:'orange', size: '2px'}} round='xxsmall'
            pad={{horizontal:'small',vertical:'xsmall'}}>
            <Analytics color='orange' size='24px'/>
            <Text color='orange' size='medium' weight={700}>Visualize Matches</Text>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}

const Item = (props) => {
  let select = props.select;

  return (
    <Link to={props.to} style={{display:'flex'}}>
      <Box
        background={select?'orange':'white'} justify='center'
        pad={{horizontal:'medium'}}
        border={select?{color:'orangeLight', size:'medium', side:'bottom', style:'solid'}:null}>
        <Text size='medium' color={select?'white':'text'}>{props.label}</Text>
      </Box>
    </Link>
  );
}
