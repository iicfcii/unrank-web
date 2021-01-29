import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch } from "react-router-dom";
import { Box, Text } from 'grommet';

const HOME_LABEL = '首页';
const DEMO_LABEL = '示例';
const ABOUT_LABEL = '关于';

export const Header = (props) => {
  const [select, setSelect] = useState(HOME_LABEL)

  let matchHome = useRouteMatch('/');
  let matchDemo = useRouteMatch('/demo');
  let matchAbout = useRouteMatch('/about');
  let matchLegal = useRouteMatch('/legal');

  let page = HOME_LABEL;
  if (matchHome) page = HOME_LABEL;
  if (matchDemo) page = DEMO_LABEL;
  if (matchAbout) page = ABOUT_LABEL;
  if (matchLegal) page = null;

  useEffect(() => {setSelect(page)},[page]);

  return(
    <Box
      direction='row' background='white'
      height='80px' pad={{horizontal:'large'}}
      border={{color:'border', size:'xsmall', side:'bottom', sytle:'solid'}}>
      <Box flex={false} justify='center'>
        <Text weight={900} size='xxlarge' color='gray'>UNRANK</Text>
      </Box>
      <Box flex={false} direction='row' margin={{left:'large'}}>
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
      <Box fill justify='center' align='end'>
        <Link to={'/about'} style={{display:'flex', textDecoration:'none'}}>
          <Box
            pad={{horizontal:'medium', vertical:'xsmall'}} round='xsmall'
            justify='center' align='center' background='orange'>
            <Text weight={700} size='medium' color='white'>分析</Text>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}

const Item = (props) => {
  let select = props.select;

  return (
    <Link to={props.to} style={{display:'flex', textDecoration:'none'}}>
      <Box
        background={select?'orange':'white'} justify='center'
        pad={{horizontal:'large'}}
        border={select?{color:'orangeLight', size:'medium', side:'bottom', sytle:'solid'}:null}>
        <Text size='large' color={select?'white':'gray'}>
          {props.label}
        </Text>
      </Box>
    </Link>
  );
}
