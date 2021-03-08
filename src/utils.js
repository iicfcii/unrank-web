import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
    text-decoration: none;
    color: inherit;
    &:focus {
      outline: none;
      box-shadow: 0 0 1px 1px #cfd7df;
    }
`
export const Link = (props) => <StyledLink {...props}/>;

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const teamToColor = (team) => {
  if (team === 2) return 'red';
  return 'blue';
}

export const teamToRowDirection = (team) => {
  return team===1?'row':'row-reverse';
}

export const teamToPlayers = (team) => {
  if (team === 2) return [7,8,9,10,11,12];
  return [1,2,3,4,5,6];
}

export const formatSeconds = (s) => {
  let min = Math.floor(s/60);
  let sec = s-min*60

  if (min === 0) return `${sec}秒`;

  return `${min}分${sec}秒`;
}
