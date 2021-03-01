import React, { useState, useEffect, useContext } from 'react';
import { Box, Chart, Stack, Text, Button } from 'grommet';
import { StatBox } from './StatBox';
import { TimeSelector} from './TimeSelector';
import { TeamHeader } from './TeamHeader';
import { MouseUpContext, formatSeconds, teamToColor, toValuesGroups } from '../utils';

export const Detail = ({team, data, range, onRangeChange}) => {
  const mouseUp = useContext(MouseUpContext);

  return(
    <StatBox fill gap='medium'>
      <TeamHeader team={team}/>
      <UltChart data={data} player={1} range={range}/>
    </StatBox>
  );
}

const UltChart = ({data, player, range}) => {
  let time = data.time.data;
  let timeBound = [time[range[0]],time[range[1]-1]];

  let ultGroups = toUltGroups(data, player, range);
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

  return (
    <Box fill='horizontal' height='128px'>
      <Stack fill>
        <Box fill direction='row'>{areaCharts}</Box>
        <Box fill direction='row'>{lineCharts}</Box>
      </Stack>
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
