import React, { useState, useEffect, useContext } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';
import { StatBox } from './StatBox';
import { TimeSelector} from './TimeSelector';
import { TeamHeader } from './TeamHeader';
import { MouseUpContext, formatSeconds, teamToColor, teamToPlayers } from '../utils';
import { heroAvatar } from '../assets/assets';

export const Detail = ({team, data, range, onRangeChange}) => {
  const mouseUp = useContext(MouseUpContext);

  let ultCharts = [];
  teamToPlayers(team).forEach((p) => {
    ultCharts.push(
      <UltChart key={p} data={data} player={p} range={range}/>
    )
  });

  return(
    <StatBox fill gap='medium'>
      <TeamHeader team={team}/>
      {ultCharts}
    </StatBox>
  );
}

const UltChart = ({data, player, range}) => {
  const [ultGroups, setUltGroups] = useState([]);
  const [heroGroups, setHeroGroups] = useState([]);

  let team = player>6?2:1;

  useEffect(() => {
    setUltGroups(toUltGroups(data, player, range));
    setHeroGroups(toHeroGroups(data, player, range));
  },[data, player, range]);

  let areaCharts = [];
  ultGroups.forEach((g, i) => {
    let length = g.values.length;
    // Change the key based on states so that Chart will rerender
    let key = range[0].toString()+range[1].toString();
    if (g.color === 'none') {
      areaCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(range[1]-range[0])*100+'%'}}>
          <Chart
            key={key}
            size='fill' type='area' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      areaCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(range[1]-range[0])*100+'%'}}>
          <Chart
            key={key}
            size='fill' color={{color: g.color, opacity: '0.2'}}
            type='area' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    }
  });

  let lineCharts = [];
  ultGroups.forEach((g, i) => {
    let length = g.values.length;
    let key = range[0].toString()+range[1].toString();
    if (g.color === 'none') {
      lineCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(range[1]-range[0])*100+'%'}}>
          <Chart
            key={key}
            size='fill' type='line' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      lineCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(range[1]-range[0])*100+'%'}}>
          <Chart
            key={key}
            size='fill' round color={g.color}
            type='line' thickness='3px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    }
  });

  let heroPoints = [];
  heroGroups.forEach((g, i) => {
    heroPoints.push(
      <Box
        key={g.ratio} width='24px' height='24px' round
        background={`url(${heroAvatar[g.hero]})`}
        style={{
          position:'absolute', left:`${g.ratio*100}%`, bottom:'0px',
          transform: `translate(-50%,50%)`,
        }}>
      </Box>
    );
  });


  return (
    <Box fill='horizontal' height='96px'>
      <Stack fill>
        <Box fill>
          <GridLine/><GridLine/><GridLine/><GridLine/><GridLine/>
        </Box>
        <Box fill direction='row'>{areaCharts}</Box>
        <Box fill direction='row'>{lineCharts}</Box>
        <Box fill border={{color:'line', size:'1px', side:'bottom', style:'solid'}}></Box>
        <Box fill style={{position:'relative'}}>{heroPoints}</Box>
      </Stack>
    </Box>
  );
}

const GridLine = (props) => {
  return (
    <Box fill border={{color:'lineLight', size:'1px', side:'top', style:'dashed'}}>
    </Box>
  );
}

const toUltGroups = (data, player, range) => {
  let color = teamToColor(player>6?2:1);

  let status = data.objective.status;
  let time = data.time.data;
  let ult  = data.ult[player];

  let prevT = time[range[0]];
  let prevS = status[range[0]];
  let groups = [{color: prevS>0?color:'none', values: []}];
  let groupIndex = 0;
  for (let i = range[0]; i < range[1]; i++) {
    let s = status[i];
    let t = time[i];
    let u = ult[i];

    if (
      (s > 0 && prevS <= 0) ||
      (s < 0 && prevS >= 0 && prevS !== null) ||
      (s === null && prevS > 0)
    ) {
      // Only color when status > 0
      prevT = t;
      prevS = s;
      groups.push({color: prevS>0?color:'none', values: []});
      groupIndex ++;
    }
    groups[groupIndex].values.push({value: [t-prevT, s>0&&s!==null?u:0]});
  }

  return groups;
}

const toHeroGroups = (data, player, range) => {
  let r = range[1]-range[0]-1;
  let hero = data['hero'][player];

  let prevH = hero[range[0]];
  let groups = [];
  for (let i = range[0]; i < range[1]; i++) {
    let h = hero[i];
    if (h >= 0 && h !== prevH) {
      // Only color when status > 0
      prevH = h;
      groups.push({ratio: (i-range[0])/r, hero: data['heroes'][prevH]});
    }
  }
  return groups;
}
