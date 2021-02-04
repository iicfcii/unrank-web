import React, { useState, useEffect } from 'react';
import { Box, Chart, Stack } from 'grommet';
import { StatBox } from './StatBox';

const chartColor = (s) => {
  if (s === 2) return 'red';
  if (s === 1) return 'blue';
  return 'none';
}

export const Objective = (props) => {
  const [hoverX, setHoverX] = useState(-1);
  const [dataGroups, setDataGroups] = useState([]);

  let data = props.data;
  let totalLength = data.objective.status.length;

  // console.log(data.objective.status)
  useEffect(() => {
    let length = data.objective.status.length;

    let time = [];
    for (let i = 0; i < length; i++) {
      time.push(i);
    }
    let status = data.objective.status;
    let progress = data.objective.progress;

    let dataGroupsNew = [{color: chartColor(null), values: []}];
    let prevS = null;
    let prevT = 0;
    let groupIndex = 0;
    time.forEach((t, i) => {
      let s = status[i];
      if (
        (s > 0 && prevS <= 0) ||
        (s < 0 && prevS >= 0 && prevS !== null) ||
        (s === null && prevS > 0)
      ) {
        // Only color when status > 0
        prevS = s;
        prevT = t;
        dataGroupsNew.push({color: chartColor(s), values: []});
        groupIndex ++;
      }
      dataGroupsNew[groupIndex].values.push({value: [t-prevT, s>0&&s!==null?progress[i]:0]});
    });

    console.log(dataGroupsNew)
    setDataGroups(dataGroupsNew);
  },[data]);

  const dashedLine = {color:'#EFEFEF', size:'1px', side:'top', style:'dashed'};

  let chartAreas = [];
  dataGroups.forEach((g, i) => {
    let length = g.values.length;
    if (g.color === 'none') {
      chartAreas.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            size='fill'
            type='area'
            thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      chartAreas.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            key={i}
            size='fill'
            color={{color: g.color, opacity: '0.2'}}
            type='area'
            thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    }
  });

  let chartLines = [];
  dataGroups.forEach((g, i) => {
    let length = g.values.length;
    if (g.color === 'none') {
      chartLines.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            size='fill'
            type='line'
            thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      chartLines.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            key={i}
            size='fill'
            color={g.color}
            type='line'
            thickness='3px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    }
  });

  return(
    <StatBox fill>
      <Stack fill>
        <Box fill>
          <Box fill border={dashedLine}></Box>
          <Box fill border={dashedLine}></Box>
          <Box fill border={dashedLine}></Box>
          <Box fill border={dashedLine}></Box>
          <Box fill border={dashedLine}></Box>
        </Box>
        <Box fill direction='row'>
          {chartAreas}
        </Box>
        <Box fill direction='row'>
          {chartLines}
        </Box>
        <Box fill border={{color:'#A9A9A9', size:'1px', side:'bottom', style:'solid'}}>
        </Box>
        {hoverX>=0 && (
          <Box
            fill='vertical' overflow='hidden'
            style={{marginLeft: hoverX+'px'}}
            border={{color:'#737373', size:'1px', side:'left', style:'dashed'}}>
          </Box>
        )}
        <Box
          fill
          onMouseMove={(event) => {
            let rect = event.target.getBoundingClientRect()
            let x = event.clientX - rect.left;
            // let y = event.clientY - rect.top;
            setHoverX(x);
          }}
          onMouseOut={() => {
            setHoverX(-1);
          }}>
        </Box>
      </Stack>
    </StatBox>
  );
}
