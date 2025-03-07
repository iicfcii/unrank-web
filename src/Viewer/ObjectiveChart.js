import React, { useState, useEffect } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';
import { formatSeconds } from '../utils';
import { ReactComponent as AssaultIcon } from '../assets/assault-icon.svg';
import { ReactComponent as EscortIcon } from '../assets/escort-icon.svg';
// import { ReactComponent as ControlIcon } from '../assets/control-icon.svg';

export const ObjectiveChart = ({data, range, onRangeChange}) => {
  const [dataGroups, setDataGroups] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [controlMapGroups, setControlMapGroups] = useState([]);
  const totalRange = [0,data.time.data.length];

  useEffect(() => {
    setDataGroups(toDataGroups(data, [0,data.time.data.length]));
    setControlMapGroups(toControlMapGroups(data, [0,data.time.data.length]))
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
            bounds={[[0,length-1],[0,100]]}
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
            bounds={[[0,length-1],[0,100]]}
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
            bounds={[[0,length-1],[0,100]]}
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
            bounds={[[0,length-1],[0,100]]}
            values={g.values}/>
        </Box>
      );
    }
  });

  let controlMapCharts = [];
  controlMapGroups.forEach((g, i) => {
    controlMapCharts.push(
      <Box
        key={g.ratio}
        style={{
          position:'absolute', left:`${g.ratio*100}%`, top:'4px',
        }}>
        <Text size='small' color='textLight'>{`Map ${g.map.toUpperCase()}`}</Text>
      </Box>
    );
  });

  return(
    <Stack fill>
      {data.objective.type==='hybrid' && (<HybridLabel/>)}
      {data.objective.type==='assault' && (<AssaultLabel/>)}
      {data.objective.type==='assault'?(
        <Box fill>
          <GridLine label='100'/>
          <GridLine label='50'/>
        </Box>
      ):(
        <Box fill>
          <GridLine label='100'/>
          <GridLine label='66'/>
          <GridLine label='33'/>
        </Box>
      )}
      <GridLineBottom/>
      <Box fill direction='row'>
        {areaCharts}
      </Box>
      <Box fill direction='row'>
        {lineCharts}
      </Box>
      {data.objective.type==='control' && (
        <Box fill direction='row'>
          {controlMapCharts}
        </Box>
      )}
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
              ${hoverInfo.i>(totalRange[1]-totalRange[0])/2?'-100%':'0%'},
              ${hoverInfo.progress<50?'-100%':'0%'}
            )`,
            maxWidth: 'none', whiteSpace:'nowrap'
          }}
          background={{color:'black',opacity:0.5}} pad='xsmall' round='xxsmall'>
          <Box direction='row' gap='xxsmall'>
            <Text size='small' color='white'>{`Progress: `}</Text>
            <Text weight={900} size='small' color='white'>{`${hoverInfo.progress}%`}</Text>
          </Box>
          <Box direction='row' gap='xxsmall'>
            <Text size='small' color='white'>{`Time:`}</Text>
            <Text weight={900} size='small' color='white'>{formatSeconds(hoverInfo.time)}</Text>
          </Box>
        </Box>
      )}
      <Box
        fill
        onMouseMove={(event) => {
          setHoverInfo(toHoverInfo(event, data, totalRange));
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
      <Box height={`${100/3*2}%`} justify='center'>
        <Icon icon={(<EscortIcon style={{fill: '#8B8C8E'}}/>)}/>
      </Box>
      <Box height={`${100/3}%`} justify='center'>
        <Icon icon={(<AssaultIcon style={{fill: '#8B8C8E'}}/>)}/>
      </Box>
    </Box>
  );
}

const AssaultLabel = () => {
  return (
    <Box fill style={{position:'relative'}}>
      <Box fill justify='center'>
        <Icon icon={(<AssaultIcon style={{fill: '#8B8C8E'}}/>)}/>
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
      style={{position:'relative',marginLeft: '-52px'}}
      width='24px' height='24px'>
      {icon}
    </Box>
  )
}

const toHoverInfo = (event, data, range) => {
  let type = data.objective.type;
  let rect = event.target.getBoundingClientRect();
  let x = event.clientX - rect.left;

  let i = Math.round(x/rect.width*(range[1]-range[0]))+range[0];
  let status = data.objective.status;
  let s = status[i];
  let t = data.time.data[i];
  let p = null;

  if (type !== 'control') {
    if (s > 0) p = toProgress(i, data.objective.progress, data.objective.type);
  } else {
    if (s === 1 || s === 2) p = data.objective.progress[s][i];
  }

  if (p === null) return null;

  let hoverInfo = {
    left: x,
    top: Math.round((100-p)/100*(rect.height-2)), // Consider line width
    time: t,
    progress: p,
    status: s,
    i: i
  }
  return hoverInfo;
}

const chartColor = (s) => {
  if (s === 2) return 'red';
  if (s === 1) return 'blue';
  if (s === 0) return 'line';
  return 'none';
}

const toDataGroups = (data, range) => {
  let type = data.objective.type;
  let status = data.objective.status;
  let progress = data.objective.progress;
  let time  = data.time.data;
  let prevT = time[range[0]];
  let prevS = status[range[0]];
  let dataGroups = [{color: chartColor(prevS), values: []}];
  let groupIndex = 0;

  if (type !== 'control') {
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
    for (let i = range[0]; i < range[1]; i++) {
      let s = status[i];
      let t = time[i];
      if (
        (s >= 0 && prevS < 0 && s !== null) ||
        (s >= 0 && prevS >= 0 && s !== prevS && s !== null) ||
        ((s === null || s < 0) && prevS > 0)
      ) {
        // Only color when status > 0
        prevT = t;
        dataGroups.push({color: chartColor(s), values: []});
        groupIndex ++;
      }
      let p;
      if (s === 1 || s === 2) p = progress[s][i];
      dataGroups[groupIndex].values.push({value: [t-prevT, p?p:0]});
      prevS = s;
    }
    return dataGroups;
  }
}

const toControlMapGroups = (data, range) => {
  if (data.objective.type !== 'control') return [];

  let r = range[1]-range[0]-1;
  let map = data.objective.map;

  let groups = [];
  for (let i = range[0]; i < range[1]; i++) {
    if (map[i] !== null && map[i-1] === null) {
      groups.push({map: map[i], ratio: (i-range[0])/r});
    }
  }
  return groups;
}

export const toProgress = (i, progress, type) => {
  if (type === 'control') return;

  let p
  if (type==='hybrid') {
    p = progress.point[i]/3;
    if (p === 100/3) p = progress.payload[i]/3*2+p;
  } else if (type === 'assault'){
    p = progress['A'][i]/2;
    if (p === 100/2) p = progress['B'][i]/2+p;
  } else {
    p = progress[i];
  }

  return Math.round(p);
}
