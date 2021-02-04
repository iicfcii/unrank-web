import React, { useState, useEffect } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';
import { StatBox } from './StatBox';

const chartColor = (s) => {
  if (s === 2) return 'red';
  if (s === 1) return 'blue';
  return 'none';
}

export const Objective = (props) => {
  const [hoverPt, setHoverPt] = useState(null);
  const [value, setValue] = useState(null);
  const [range, setRange] = useState(null);
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
    setRange([0,time[time.length-1]]);
  },[data]);

  const dashedLine = {color:'#EFEFEF', size:'1px', side:'top', style:'dashed'};

  let chartAreas = [];
  dataGroups.forEach((g, i) => {
    let length = g.values.length;
    if (g.color === 'none') {
      chartAreas.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            size='fill' type='area' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      chartAreas.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            key={i}
            size='fill' color={{color: g.color, opacity: '0.2'}}
            type='area' thickness='0px'
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
            size='fill' type='line' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      chartLines.push(
        <Box key={i} fill='vertical' width={length/totalLength*100+'%'}>
          <Chart
            key={i}
            size='fill' round color={g.color}
            type='line' thickness='3px'
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
        {hoverPt && (
          <Box
            fill='vertical' style={{marginLeft: hoverPt[0]+'px'}}
            border={{color:'#737373', size:'1px', side:'left', style:'dashed'}}>
          </Box>
        )}
        {hoverPt && (
          <Box
            style={{marginTop: hoverPt[1]+'px'}}
            border={{color:'#737373', size:'1px', side:'top', style:'dashed'}}>
          </Box>
        )}
        {hoverPt && (
          <Box
            style={{position: 'relative', left:`${hoverPt[0]-8}px`,top:`${hoverPt[1]-8}px`}}
            width='16px' height='16px' round background='white'
            border={{color:value[2]===1?'blue':'red', size:'4px', side:'all', style:'solid'}}>
          </Box>
        )}
        {value && range && hoverPt && (
          <Box
            style={{
              position: 'absolute',
              left:`${hoverPt[0]+(value[0]>(range[1]-range[0])/2?-8:8)}px`,
              top:`${hoverPt[1]+(value[1]<50?-8:8)}px`,
              transform: `translate(
                ${value[0]>(range[1]-range[0])/2?'-100%':'0%'},
                ${value[1]<50?'-100%':'0%'}
              )`,
              width: 'fit-content'
            }}
            background='rgba(0,0,0,0.5)' pad='xsmall' round='xxsmall'>
            <Text size='small' color='white'>{`队伍${value[2]}防守`}</Text>
            <Box direction='row'>
              <Text size='small' color='white'>{`进度：`}</Text>
              <Text weight={900} size='small' color='white'>{`${value[1]}%`}</Text>
            </Box>
            <Box direction='row'>
              <Text size='small' color='white'>{`时间：`}</Text>
              <Text weight={900} size='small' color='white'>{`${value[0]}s`}</Text>
            </Box>
          </Box>
        )}
        <Box
          fill
          onMouseMove={(event) => {
            let rect = event.target.getBoundingClientRect()
            let x = event.clientX - rect.left;
            // let y = event.clientY - rect.top;

            let t = Math.round(x/rect.width*(range[1]-range[0]));
            let p = data.objective.progress[t];
            let status = data.objective.status;

            if (status[t] > 0) {
              setValue([t,p,status[t]]);
              setHoverPt([x,Math.round((100-p)/100*rect.height)]);
            } else {
              setValue(null);
              setHoverPt(null);
            }
          }}
          onMouseOut={() => {
            setValue(null);
            setHoverPt(null);
          }}>
        </Box>
      </Stack>
    </StatBox>
  );
}
