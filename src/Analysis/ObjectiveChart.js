import React, { useState, useEffect, useContext } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';
import { MouseUpContext, formatSeconds } from '../utils';
import { ReactComponent as AssaultIcon } from '../assets/assault-icon.svg';
import { ReactComponent as EscortIcon } from '../assets/escort-icon.svg';

export const ObjectiveChart = ({data, range, onRangeChange}) => {
  const [dataGroups, setDataGroups] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const mouseUp = useContext(MouseUpContext);

  const totalRange = [0,data.time.data.length];

  useEffect(() => {
    setDataGroups(toDataGroups(data, [0,data.time.data.length]));
  },[data]);

  let areaCharts = [];
  dataGroups.forEach((g, i) => {
    let length = g.values.length;
    // Change the key based on states so that Chart will rerender
    let key = totalRange[0].toString()+totalRange[1].toString();
    if (g.color === 'none') {
      areaCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(totalRange[1]-totalRange[0])*100+'%'}}>
          <Chart
            key={key}
            size='fill' type='area' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      areaCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(totalRange[1]-totalRange[0])*100+'%'}}>
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
  dataGroups.forEach((g, i) => {
    let length = g.values.length;
    let key = totalRange[0].toString()+totalRange[1].toString();
    if (g.color === 'none') {
      lineCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(totalRange[1]-totalRange[0])*100+'%'}}>
          <Chart
            key={key}
            size='fill' type='line' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      lineCharts.push(
        <Box key={i} fill='vertical' style={{width:length/(totalRange[1]-totalRange[0])*100+'%'}}>
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

  return(
    <Stack fill>
      {data.objective.type==='hybrid' && (
        <HybridLabel/>
      )}
      <Box fill>
        <GridLine label='100'/>
        <GridLine label='66'/>
        <GridLine label='33'/>
      </Box>
      <GridLineBottom/>
      <Box fill direction='row'>
        {areaCharts}
      </Box>
      <Box fill direction='row'>
        {lineCharts}
      </Box>
      {hoverInfo && (
        <Box
          fill='vertical' style={{marginLeft: hoverInfo.left+'px'}}
          border={{color:'text', size:'1px', side:'left', style:'dashed'}}>
        </Box>
      )}
      {hoverInfo && (
        <Box
          style={{marginTop: hoverInfo.top+'px'}}
          border={{color:'text', size:'1px', side:'top', style:'dashed'}}>
        </Box>
      )}
      {hoverInfo && (
        <Box
          style={{
            position: 'relative',
            left:`${hoverInfo.left-8}px`,
            top:`${hoverInfo.top-8}px`
          }}
          width='16px' height='16px' round background='white'
          border={{color:hoverInfo.status===1?'blue':'red', size:'4px', side:'all', style:'solid'}}>
        </Box>
      )}
      {hoverInfo && (
        <Box
          style={{
            position: 'absolute',
            left:`${hoverInfo.left+(hoverInfo.i>(totalRange[1]-totalRange[0])/2?-8:8)}px`,
            top:`${hoverInfo.top+(hoverInfo.progress<50?-8:8)}px`,
            transform: `translate(
              ${hoverInfo.i>(totalRange[1]-totalRange[0])?'-100%':'0%'},
              ${hoverInfo.progress<50?'-100%':'0%'}
            )`,
            maxWidth: 'none', whiteSpace:'nowrap'
          }}
          background={{color:'black',opacity:0.5}} pad='xsmall' round='xxsmall'>
          <Box direction='row'>
            <Text size='small' color='white'>{`进度：`}</Text>
            <Text weight={900} size='small' color='white'>{`${hoverInfo.progress}%`}</Text>
          </Box>
          <Box direction='row'>
            <Text size='small' color='white'>{`时间：`}</Text>
            <Text weight={900} size='small' color='white'>{formatSeconds(hoverInfo.time)}</Text>
          </Box>
        </Box>
      )}
      <Box
        fill
        onMouseMove={(event) => {
          if (!mouseUp) {
            // Hover only works when mouse not pressed
            setHoverInfo(null);
          } else {
            setHoverInfo(toHoverInfo(event, data, totalRange));
          }
        }}
        onMouseOut={() => {
          setHoverInfo(null);
        }}>
      </Box>
    </Stack>
  );
}

const GridLine = (props) => {
  return (
    <Box
      style={{position:'relative'}}
      fill border={{color:'lineLight', size:'1px', side:'top', style:'dashed'}}>
      <Box
        style={{
          position:'absolute', left:'-12px',
          transform: 'translate(-100%,-50%)'
        }}>
        <Text size='xxsmall' color='textLight'>{props.label}</Text>
      </Box>
    </Box>
  );
}

const GridLineBottom = (props) => {
  return (
    <Box
      style={{position:'relative'}}
      fill border={{color:'line', size:'1px', side:'bottom', style:'solid'}}>
      <Box
        style={{
          position:'absolute', left:'-12px', bottom: '0px',
          transform: 'translate(-100%,50%)'
        }}>
        <Text size='small' color='textLight'>0</Text>
      </Box>
    </Box>
  );
}

const HybridLabel = () => {
  return (
    <Box fill style={{position:'relative'}}>
      <Box fill justify='center'>
        <Icon icon={(<EscortIcon style={{fill: '#8B8C8E'}}/>)}/>
      </Box>
      <Box fill justify='center'>
        <Icon icon={(<AssaultIcon style={{fill: '#8B8C8E'}}/>)}/>
      </Box>
    </Box>
  );
}

const Icon = ({icon}) => {
  return (
    <Box
      style={{
        position:'relative',
        marginTop: '2px',
        marginLeft: '-52px',
        transform: 'translate(0%,50%)'
      }}
      width='24px' height='24px'>
      {icon}
    </Box>
  )
}

const toHoverInfo = (event, data, range) => {
  let type = data.objective.type;

  if (type !== 'control') {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;

    let i = Math.round(x/rect.width*(range[1]-range[0]))+range[0];
    let status = data.objective.status;
    let s = status[i];

    let hoverInfo;
    if (s > 0) {
      let t = data.time.data[i];
      let p = toProgress(i, data.objective.progress, data.objective.type);
      hoverInfo = {
        left: x,
        top: Math.round((100-p)/100*(rect.height-2)), // Consider line width
        time: t,
        progress: p,
        status: s,
        i: i
      }
    }
    return hoverInfo;
  } else {

  }
}

const chartColor = (s) => {
  if (s === 2) return 'red';
  if (s === 1) return 'blue';
  return 'none';
}

const toDataGroups = (data, range) => {
  let type = data.objective.type;

  if (type !== 'control') {
    let status = data.objective.status;
    let progress = data.objective.progress;
    let time  = data.time.data;

    let prevT = time[range[0]];
    let prevS = status[range[0]];
    let dataGroups = [{color: chartColor(prevS), values: []}];
    let groupIndex = 0;
    for (let i = range[0]; i < range[1]; i++) {
      let s = status[i];
      let t = time[i];
      let p = toProgress(i, progress, type);

      if (
        (s > 0 && prevS <= 0) ||
        (s < 0 && prevS >= 0 && prevS !== null) ||
        (s === null && prevS > 0)
      ) {
        // Only color when status > 0
        prevT = t;
        prevS = s;
        dataGroups.push({color: chartColor(s), values: []});
        groupIndex ++;
      }
      dataGroups[groupIndex].values.push({value: [t-prevT, s>0&&s!==null?p:0]});
    }

    return dataGroups;
  } else {
    return [];
  }
}

export const toProgress = (i, progress, type) => {
  let p
  if (type !== 'control') {
    if (type==='hybrid') {
      p = progress.point[i]/3;
      if (p === 100/3) p = progress.payload[i]/3*2+p;
    } else {
      p = progress[i];
    }
  } else {

  }

  return Math.round(p);
}
