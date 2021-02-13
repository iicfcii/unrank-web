import React from 'react';
import { Box, Text } from 'grommet';
import { Down } from 'grommet-icons';
import { StatBox } from './StatBox';

export const Table = ({data, team, range}) => {


  let color = team===1?'blue':'red';
  let direction = team===1?'row':'row-reverse';
  let heroData = calcHero(data, range, team);
  let ultData = calcUlt(data, range, team);
  let deathData = calcDeath(data, range, team);
  let elimData = calcElim(data, range, team);


  let ultMax = 0;
  teamToPlayers(team).forEach((player) => {
    if (ultMax < ultData[player]) ultMax = ultData[player];
  })
  let deathMax = 0;
  teamToPlayers(team).forEach((player) => {
    if (deathMax < deathData[player]) deathMax = deathData[player];
  })
  let elimMax = 0;
  teamToPlayers(team).forEach((player) => {
    if (elimMax < elimData[player]) elimMax = elimData[player];
  })
  let playerRows = [];
  teamToPlayers(team).forEach((player) => {
    playerRows.push(
      <Box
        key={player}
        direction={direction} height='48px' gap='xlarge' align='start'
        border={{color:'lineLight', size:'1px', side:'bottom', style:'solid'}}>
        <BarChart data={heroData[player]} color={color}/>
        <ValueChart value={ultData[player]} max={ultMax} color={color}/>
        <ValueChart value={deathData[player]} max={deathMax} color={color}/>
        <ValueChart value={elimData[player]} max={elimMax} color={color}/>
      </Box>
    );
  });

  return(
    <StatBox fill='horizontal' pad='medium' justify='start'>
      <Box
        direction={direction} justify='between' align='center'
        pad={{horizontal: 'small', vertical: 'xsmall'}}
        background={{color:color, opacity:'0.1'}}>
        <Box
          justify='center' align='center'
          width='36px' height='36px'
          onClick={() => {}}>
          <Down size='16px' color='text'/>
        </Box>
        <Text>{`队伍${team}`}</Text>
      </Box>
      <Box gap='medium' margin={{top: 'small'}}>
        <Box
          background='background' height='48px' direction={direction}
          border={{color:'line', size:'2px', side:'bottom', style:'solid'}}>
          <Box direction={direction} height='48px' gap='xlarge' align='start'>
            <BarTitle label='英雄'/>
            <ValueTitle label='大招'/>
            <ValueTitle label='死亡'/>
            <ValueTitle label='击杀'/>
          </Box>
        </Box>
        {playerRows}
      </Box>
    </StatBox>
  );
}


const BarTitle = ({label}) => {
  return (
    <Box width='295px' height='100%' justify='center' align='center'>
      <Text size='medium'>{label}</Text>
    </Box>
  );
}

const ValueTitle = ({label}) => {
  return (
    <Box width='128px' height='100%' justify='center' align='center'>
      <Text size='medium'>{label}</Text>
    </Box>
  );
}

const BarChart = ({data, color}) => {
  let total = 0;
  data.forEach((d) => {
    total += d[1];
  });

  let subBars = [];
  data.forEach((d,i) => {
    subBars.push(
      <Box key={i} height='100%' width={`${d[1]/total*100}%`} background={color}>
      </Box>
    );
  });

  return(
    <Box
      width='295px' height='40px' gap='xxxsmall'
      direction='row'>
      {subBars}
    </Box>
  )
}

const ValueChart = ({value, max, color}) => {
  return(
    <Box justify='between' background='backgroundLight'>
      <Text
        weight={700} size='20px' color='blue' style={{lineHeight: '24px'}}
        margin={{vertical:'xxsmall', left:'xsmall'}}>
        {value}
      </Text>
      <Box
        background={{color:color, opacity:0.2}}
        height='8px' width='128px'>
        <Box background={color} height='8px' width={`${value/max*100}%`}></Box>
      </Box>
    </Box>
  )
}

const teamToPlayers = (team) => {
  if (team === 2) return [7,8,9,10,11,12];
  return [1,2,3,4,5,6];
}

const calcHero = (data, range, team) => {
  let hero = {};
  teamToPlayers(team).forEach((player) => {
    hero[player] = [];
    for (let i=range[0]; i<range[1]; i++){
      let h = data['hero'][player][i];
      if (h === null || h === -1) continue;
      if (hero[player].length === 0) {
        hero[player].push([h,1]);
      } else {
        let lastI = hero[player].length-1
        let lastH = hero[player][lastI][0]
        if (lastH === h) {
          hero[player][lastI][1] ++;
        } else {
          hero[player].push([h,1]);
        }
      }
    }
  });
  return hero;
}


const calcUlt = (data, range, team) => {
  let ult = {};
  teamToPlayers(team).forEach((player) => {
    ult[player] = 0;
    for (let i=range[0]; i<range[1]; i++){
      if (data.ult_use[player][i] !== null) ult[player] += 1;
    }
  });
  return ult;
}

const calcDeath = (data, range, team) => {
  let death = {};
  teamToPlayers(team).forEach((player) => {
    death[player] = 0;
    for (let i=range[0]; i<range[1]; i++){
      if (data.elim[player][i] !== null) death[player] += 1;
    }
  });
  return death;
}

const calcElim = (data, range, team) => {
  let elim = {};
  teamToPlayers(team).forEach((player) => {
    elim[player] = 0;
    if (player < 7) {
      for (let i=7; i<13; i++){
        for (let j=range[0]; j<range[1]; j++){
          if (data.elim[i][j] === player) elim[player] += 1;
        }
      }
    } else {
      for (let i=1; i<7; i++){
        for (let j=range[0]; j<range[1]; j++){
          if (data.elim[i][j] === player) elim[player] += 1;
        }
      }
    }
  });
  return elim;
}

// const UltBar = (props) => {
//   return(
//     <Box>
//     </Box>
//   )
// }
//
// const DeathBar = (props) => {
//   return(
//     <ValueBar value={3} max={10}/>
//   )
// }
//
// const ElimBar = ({data, player, range}) => {
//
//   return(
//     <ValueBar value={elim} max={30}/>
//   )
// }
