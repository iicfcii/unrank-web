import React, { useState, useEffect, useContext } from 'react';
import { Box, Chart, Stack, Text, Button } from 'grommet';
import { StatBox } from './StatBox';
import { TimeSelector} from './TimeSelector';
import { MouseUpContext, formatSeconds } from '../utils';

export const Objective = ({data, range, onRangeChange}) => {
  const [hoverPt, setHoverPt] = useState(null);
  const [value, setValue] = useState(null);
  const [dataGroups, setDataGroups] = useState([]);
  const mouseUp = useContext(MouseUpContext);

  useEffect(() => {
    setDataGroups(toDataGroups(data, range));
  },[data, range]);

  let areaCharts = [];
  dataGroups.forEach((g, i) => {
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
  dataGroups.forEach((g, i) => {
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
        <Button primary label='整场数据' size='small' onClick={() => {
          let rangeNew = [0,data.time.data.length];
          setDataGroups(toDataGroups(data, rangeNew));
          if(onRangeChange) onRangeChange(rangeNew);
        }}/>
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
            {areaCharts}
          </Box>
          <Box fill direction='row'>
            {lineCharts}
          </Box>
          <GridLineBottom/>
          {hoverPt && (
            <Box
              fill='vertical' style={{marginLeft: hoverPt[0]+'px'}}
              border={{color:'text', size:'1px', side:'left', style:'dashed'}}>
            </Box>
          )}
          {hoverPt && (
            <Box
              style={{marginTop: hoverPt[1]+'px'}}
              border={{color:'text', size:'1px', side:'top', style:'dashed'}}>
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
                maxWidth: 'none', whiteSpace:'nowrap'
              }}
              background={{color:'black',opacity:0.5}} pad='xsmall' round='xxsmall'>
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
              if (!mouseUp) {
                // Hover only works when mouse not pressed
                setHoverPt(null);
                setValue(null);
                return;
              }

              let rect = event.target.getBoundingClientRect();
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
        <TimeSelector
          range={[range[0],range[1]-1]}
          max={data.time.data.length-1}
          onChange={(values) => {
            let rangeNew = [values[0],values[1]+1]
            setDataGroups(toDataGroups(data, rangeNew));
            if(onRangeChange) onRangeChange(rangeNew);
          }}/>
      </Box>
    </StatBox>
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
      fill border={{color:'text', size:'1px', side:'bottom', style:'solid'}}>
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
