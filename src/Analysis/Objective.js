import React, { useState, useEffect, useRef } from 'react';
import { Box, Chart, Stack, Text, Button, RangeSelector, ThemeContext } from 'grommet';
import { StatBox } from './StatBox';

export const Objective = (props) => {
  const containerRef = useRef(null);

  const [mouseUp, setMouseUp] = useState(true);
  const [hoverPt, setHoverPt] = useState(null);
  const [value, setValue] = useState(null);
  const [range, setRange] = useState([0,0]);
  const [dataGroups, setDataGroups] = useState([]);

  const [movingRangeBar, setMovingRangeBar] = useState(false);

  let data = props.data;
  let maxRange = data.objective.status.length-1

  // console.log(data.objective.status)
  useEffect(() => {
    let status = data.objective.status;
    let time = [];
    for (let i = 0; i < status.length; i++) {
      time.push(i);
    }
    let rangeNew = [0,time[time.length-1]];
    // let rangeNew = [0,500];

    setDataGroups(toDataGroups(data, rangeNew));
    setRange(rangeNew);
  },[data]);

  // Hover only works when mouse not pressed
  useEffect(() => {
    let onMouseDown = () => {
      setMouseUp(false);
      setHoverPt(null);
      setValue(null);
    };
    let onMouseUp = () => {
      setMouseUp(true);
      setMovingRangeBar(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    }
  },[])

  useEffect(() => {
    let onMouseMove = (event) => {
      if (!movingRangeBar || !containerRef.current) return;

      let rect = containerRef.current.getBoundingClientRect()
      let x = event.clientX - rect.left;
      let rangeValue = range[1]-range[0];
      let values;
      if (x < 0){
        values = [0,rangeValue];
      }
      if (x > rect.width){
        values = [maxRange-rangeValue,maxRange];
      }

      if (values) {
        setDataGroups(toDataGroups(data, values));
        setRange(values);
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    }
  },[movingRangeBar, range, maxRange, data])

  let chartAreas = [];
  dataGroups.forEach((g, i) => {
    let length = g.values.length;
    if (g.color === 'none') {
      chartAreas.push(
        <Box key={i} fill='vertical' width={length/(range[1]-range[0])*100+'%'}>
          <Chart
            key={range[0].toString()+range[1].toString()}
            size='fill' type='area' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      chartAreas.push(
        <Box key={i} fill='vertical' width={length/(range[1]-range[0])*100+'%'}>
          <Chart
            key={range[0].toString()+range[1].toString()}
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
        <Box key={i} fill='vertical' width={length/(range[1]-range[0])*100+'%'}>
          <Chart
            key={range[0].toString()+range[1].toString()}
            size='fill' type='line' thickness='0px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    } else {
      chartLines.push(
        <Box key={i} fill='vertical' width={length/(range[1]-range[0])*100+'%'}>
          <Chart
            key={range[0].toString()+range[1].toString()}
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
      <Box direction='row' justify='between' flex={false}>
        <Box direction='row' align='center' gap='xxsmall'>
          <Box background='orange' width='4px' height='12px'></Box>
          <Text weight={700} size='small'>目标进度</Text>
        </Box>
        <Box direction='row' gap='xlarge'>
          <Box direction='row' align='center' gap='xsmall'>
            <Box width='12px' height='12px' round background='blue'></Box>
            <Text size='small' color='textLight'>队伍1防守</Text>
          </Box>
          <Box direction='row' align='center' gap='xsmall'>
            <Box width='12px' height='12px' round background='red'></Box>
            <Text size='small' color='textLight'>队伍2防守</Text>
          </Box>
        </Box>
        <Button primary label='整场数据' size='small'/>
      </Box>
      <Box fill pad={{top:'12px', left:'48px', right:'24px'}}>
        <Stack fill>
          <Box fill>
            <GridLine label='100'/>
            <GridLine label='80'/>
            <GridLine label='60'/>
            <GridLine label='40'/>
            <GridLine label='20'/>
          </Box>
          <Box fill direction='row'>
            {chartAreas}
          </Box>
          <Box fill direction='row'>
            {chartLines}
          </Box>
          <GridLineBottom/>
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
              <Box direction='row'>
                <Text size='small' color='white'>{`进度：`}</Text>
                <Text weight={900} size='small' color='white'>{`${value[1]}%`}</Text>
              </Box>
              <Box direction='row'>
                <Text size='small' color='white'>{`时间：`}</Text>
                <Text weight={900} size='small' color='white'>{formatSeconds(value[0])}</Text>
              </Box>
            </Box>
          )}
          <Box
            fill
            onMouseMove={(event) => {
              if (!mouseUp) return;

              let rect = event.target.getBoundingClientRect()
              let x = event.clientX - rect.left;
              // let y = event.clientY - rect.top;

              let t = Math.round(x/rect.width*(range[1]-range[0]))+range[0];
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
        <ThemeContext.Extend value={{box:{extend:`:focus{outline:none}`}}}>
          <Box
            ref={containerRef}
            margin={{top:'small'}}
            background='#F4F4F4'
            onMouseDown={(event) => {
              // NOTE: use style to detect which element is pressed
              if (event.target.style.cursor) setMovingRangeBar(true);
            }}>
            <RangeSelector
              disabled
              opacity='1'
              direction="horizontal"
              min={0}
              max={maxRange}
              values={range}
              size='8px'
              round='small'
              onChange={(values) => {
                setDataGroups(toDataGroups(data, values));
                setRange(values);
              }}/>
          </Box>
        </ThemeContext.Extend>
      </Box>
    </StatBox>
  );
}

const GridLine = (props) => {
  return (
    <Box
      style={{position:'relative'}}
      fill border={{color:'#EFEFEF', size:'1px', side:'top', style:'dashed'}}>
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
      fill border={{color:'#A9A9A9', size:'1px', side:'bottom', style:'solid'}}>
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

const chartColor = (s) => {
  if (s === 2) return 'red';
  if (s === 1) return 'blue';
  return 'none';
}

const formatSeconds = (s) => {
  let min = Math.floor(s/60);
  let sec = s-min*60
  return `${min}分${sec}秒`
}

const toDataGroups = (data, range) => {
  let status = data.objective.status;
  let progress = data.objective.progress;

  let prevT = range[0];
  let prevS = status[prevT];
  let dataGroupsNew = [{color: chartColor(prevS), values: []}];
  let groupIndex = 0;
  for (let t = range[0]; t < range[1]; t++) {
    let s = status[t];
    if (
      (s > 0 && prevS <= 0) ||
      (s < 0 && prevS >= 0 && prevS !== null) ||
      (s === null && prevS > 0)
    ) {
      // Only color when status > 0
      prevT = t;
      prevS = s;
      dataGroupsNew.push({color: chartColor(s), values: []});
      groupIndex ++;
    }
    dataGroupsNew[groupIndex].values.push({value: [t-prevT, s>0&&s!==null?progress[t]:0]});
  }

  return dataGroupsNew;
}
