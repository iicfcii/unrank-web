import React, { useState, useEffect } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';
import { FormClose, CaretDownFill, LineChart } from 'grommet-icons';
import { StatBox } from './StatBox';
import { TimeSelector} from './TimeSelector';
import { TeamHeader } from './TeamHeader';
import { teamToColor, teamToPlayers, teamToRowDirection } from '../utils';
import { heroAvatar } from '../assets/assets';

export const Detail = ({team, data, range, onRangeChange, hide, onHide}) => {
  let ultCharts = [];
  teamToPlayers(team).forEach((p) => {
    ultCharts.push(
      <UltChart key={p} data={data} player={p} range={range}/>
    )
  });

  return(
    <StatBox fill gap='small'>
      <TeamHeader
        team={team} hide={hide} onHide={onHide}
          icon={(<LineChart size='24px' color={teamToColor(team)}/>)}/>
      {!hide && (
        <Box gap='small'>
          <Box direction={teamToRowDirection(team)} justify='center' gap='large'>
            <Box direction='row' align='center'>
              <CaretDownFill size='24px' color='orange'/>
              <Text size='small' color='text'>大招</Text>
            </Box>
            <Box direction='row' align='center'>
              <FormClose size='24px' color={teamToColor(team===1?2:1)}/>
              <Text size='small' color='text'>击杀</Text>
            </Box>
            <Box direction='row' align='center'>
              <Box background='line' width='12px' height='12px' margin='6px'></Box>
              <Text size='small' color='text'>死亡</Text>
            </Box>
          </Box>
          <Box gap='medium'>
            {ultCharts}
          </Box>
          <TimeSelector
            reverse={team===2}
            range={[range[0],range[1]-1]}
            max={data.time.data.length-1}
            onChange={(values) => {
              let rangeNew = [values[0],values[1]+1]
              if(onRangeChange) onRangeChange(rangeNew);
            }}/>
        </Box>
      )}
    </StatBox>
  );
}

const UltChart = ({data, player, range}) => {
  const [ultGroups, setUltGroups] = useState([]);
  const [ultUseGroups, setUltUseGroups] = useState([]);
  const [heroGroups, setHeroGroups] = useState([]);
  const [deathGroups, setDeathGroups] = useState([]);
  const [elimGroups, setElimGroups] = useState([]);

  let team = player>6?2:1;

  useEffect(() => {
    setUltGroups(toUltGroups(data, player, range));
    setUltUseGroups(toUltUseGroups(data, player, range));
    setHeroGroups(toHeroGroups(data, player, range));
    setDeathGroups(toDeathGroups(data, player, range));
    setElimGroups(toElimGroups(data, player, range));
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
            type='line' thickness='2px'
            bounds={[[0,length],[0,100]]}
            values={g.values}/>
        </Box>
      );
    }
  });


    let deathCharts = [];
    deathGroups.forEach((g, i) => {
      let length = g.values.length;
      // Change the key based on states so that Chart will rerender
      let key = range[0].toString()+range[1].toString();
      if (!g.death) {
        deathCharts.push(
          <Box key={i} fill='vertical' style={{width:length/(range[1]-range[0])*100+'%'}}>
            <Chart
              key={key}
              size='fill' type='area' thickness='0px'
              bounds={[[0,length],[0,100]]}
              values={g.values}/>
          </Box>
        );
      } else {
        deathCharts.push(
          <Box key={i} fill='vertical' style={{width:length/(range[1]-range[0])*100+'%'}}>
            <Chart
              key={key}
              size='fill' color='line'
              type='area' thickness='0px'
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

  let elimPoints = [];
  elimGroups.forEach((g, i) => {
    elimPoints.push(
      <Box
        key={g.ratio}
        style={{
          position:'absolute', left:`${g.ratio*100}%`, bottom:'0px',
          transform: `translate(-50%,50%)`,
        }}>
        <FormClose size='24px' color={teamToColor(team===1?2:1)}/>
      </Box>
    );
  });

  let ultUseCharts = [];
  ultUseGroups.forEach((g, i) => {
    ultUseCharts.push(
      <Box
        key={g.ratio}
        style={{
          position:'absolute', left:`${g.ratio*100}%`, top:'0px',
          transform: `translate(-50%,-50%)`,
        }}>
        <CaretDownFill size='24px' color='orange'/>
      </Box>
    );
  });

  return (
    <Box fill='horizontal' height='96px'>
      <Stack fill>
        <Box fill>
          <GridLine/><GridLine/><GridLine/><GridLine/><GridLine/>
        </Box>
        <Box fill direction='row'>{deathCharts}</Box>
        <Box fill direction='row'>{areaCharts}</Box>
        <Box fill direction='row'>{lineCharts}</Box>
        <Box fill border={{color:'line', size:'1px', side:'bottom', style:'solid'}}></Box>
        <Box fill style={{position:'relative'}}>{heroPoints}</Box>
        <Box fill style={{position:'relative'}}>{elimPoints}</Box>
        <Box fill direction='row'>{ultUseCharts}</Box>
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

const reverseData = (array, player) => {
  if (player > 6) {
    return array.slice().reverse();
  } else {
    return array;
  }
}

const reverseRatio = (r, player) => {
  if (player > 6) {
    return 1-r;
  } else {
    return r;
  }
}

const reverseRange = (r, player, data) => {
  let l = data.time.data.length;
  if (player > 6) {
    return [l-r[1],l-r[0]];
  } else {
    return r;
  }
}

const toUltGroups = (data, player, range) => {
  range = reverseRange(range, player, data);
  let color = teamToColor(player>6?2:1);

  let time = data.time.data;
  let status = reverseData(data.objective.status, player);
  let ult  = reverseData(data.ult[player], player);

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

const toDeathGroups = (data, player, range) => {
  range = reverseRange(range, player, data);
  let time = data.time.data;
  let health = reverseData(data['health'][player], player);

  let prevT = time[range[0]];
  let prevH = health[range[0]];
  let groups = [{death: prevH===0, values: []}];
  let groupIndex = 0;
  for (let i = range[0]; i < range[1]; i++) {
    let t = time[i];
    let h = health[i];

    if (
      (h === 0 && prevH !== 0) ||
      (h === 1 && prevH === 0) ||
      (h === null && prevH === 0) // Between round counts as not dead
    ) {
      // Only color when status > 0
      prevT = t;
      prevH = h;
      groups.push({death: prevH===0, values: []});
      groupIndex ++;
    }
    groups[groupIndex].values.push({value: [t-prevT, prevH===0?100:0]});
  }

  return groups;
}

const toHeroGroups = (data, player, range) => {
  let r = range[1]-range[0]-1;
  let hero = data['hero'][player];

  let prevH = hero[range[0]];
  let groups = [];
  if (prevH !== null) groups.push({
    ratio: reverseRatio(0, player),
    hero: data['heroes'][prevH]
  });
  for (let i = range[0]; i < range[1]; i++) {
    let h = hero[i];
    if (h >= 0 && h !== prevH) {
      // Only color when status > 0
      prevH = h;
      groups.push({
        ratio: reverseRatio((i-range[0])/r, player),
        hero: data['heroes'][prevH]
      });
    }
  }

  return groups;
}

const toElimGroups = (data, player, range) => {
  let enemyPlayers = teamToPlayers(player>6?1:2);
  let r = range[1]-range[0]-1;
  let elim = data['elim'];

  let groups = [];
  for (let i = range[0]; i < range[1]; i++) {
    let numElim = 0;
    enemyPlayers.forEach((ep) => {
      if (elim[ep][i] === player) {
        numElim ++;
      }
    });

    if (numElim > 0)
    groups.push({
      ratio: reverseRatio((i-range[0])/r, player),
      elim: numElim
    });
  }

  return groups;
}

const toUltUseGroups = (data, player, range) => {
  let r = range[1]-range[0]-1;
  let ultUse = data['ult_use'][player];

  let groups = [];
  for (let i = range[0]; i < range[1]; i++) {
    if (ultUse[i] === 1) {
      groups.push({
        ratio: reverseRatio((i-range[0])/r, player)
      });
    }
  }

  return groups;
}
