import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Chart, Stack, Text } from 'grommet';
import { FormClose, CaretDownFill, LineChart } from 'grommet-icons';
import { StatBox } from './StatBox';
import { TimeSelector} from './TimeSelector';
import { TeamHeader } from './TeamHeader';
import { teamToColor, teamToPlayers, teamToRowDirection, formatSeconds } from '../utils';
import { heroAvatar } from '../assets/assets';

const CHART_GAP = 24;
const CHART_HEIGHT = 96;

export const Detail = ({team, data, range, onRangeChange, hide, onHide}) => {
  const [pressed, setPressed] = useState(false);
  const [select, setSelect] = useState(null); // Selected chart(0,1,2,3,4,5)
  const [order, setOrder] = useState(teamToPlayers(team));
  const [top, setTop] = useState(null);
  const [topOffset, setTopOffset] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const containerRef = useRef(null);

  const onTap = useCallback((event) => {
    if (!containerRef.current) return;

    let rect = containerRef.current.getBoundingClientRect();
    let clientY = event.changedTouches?event.changedTouches[0].clientY:event.clientY;
    let clientX = event.changedTouches?event.changedTouches[0].clientX:event.clientX;
    let y = clientY-rect.top;
    let x = clientX-rect.left;
    if (y < 0 || y > rect.height-1 || x < 0 || x > rect.width-1) return;

    let player = order[Math.floor(y/(CHART_HEIGHT+CHART_GAP))];
    let i = team===1
      ?Math.floor((x/rect.width)*(range[1]-range[0]))+range[0]
      :Math.floor(((rect.width-x)/rect.width)*(range[1]-range[0]))+range[0];
    let status = data.objective.status[i];
    if (status !== -1 && status !== null) {
      let time = data.time.data[i];
      let progress = data.objective.progress[i];
      let elimBy;
      let elim;

      // Whether elim by any hero
      let health = data.health[player][i];
      if (health===0) {
        let start = i-1;
        let end = i+1;
        while (data.health[player][start] === 0) start --;
        start ++;
        while (data.health[player][end] === 0) end ++;
        for (let j = start; j < end; j ++) {
          let p = data.elim[player][j];
          if (p !== null) elimBy = data.heroes[data.hero[p][j]];
        }
      }

      // Whether elim any hero
      let elimHalfRange = Math.ceil(12/rect.width*(range[1]-range[0])/2); // Range a litte bigger than icon actual size
      let k = 0;
      let matchElim = (p) => {
        if (data.elim[p][i+k] === player) elim = data.heroes[data.hero[p][i+k]];
        if (data.elim[p][i-k] === player) elim = data.heroes[data.hero[p][i-k]];
      }
      while (
        k < elimHalfRange &&
        i-k >= 0 &&
        i+k < data.time.data.length &&
        !elim
      ) {
          teamToPlayers(team===1?2:1).forEach(matchElim);
          k ++;
      }
      setHoverInfo({
        left: x,
        top: y,
        time: time,
        progress: progress,
        elimBy: elimBy,
        elim: elim
      });
    } else {
      setHoverInfo(null);
    }
  },[range, data, order, team]);

  const onOut = (event) => {
    if (hoverInfo) setHoverInfo(null);
  }

  const onStart = (event) => {
    if (!event.touches) event.preventDefault(); // Prevent chrome from dragging text

    let rect = containerRef.current.getBoundingClientRect();
    let clientY = event.touches?event.touches[0].clientY:event.clientY;
    let selectNew = Math.floor((clientY-rect.top)/(CHART_HEIGHT+CHART_GAP));
    let topOffset = (clientY-rect.top)-selectNew*(CHART_HEIGHT+CHART_GAP);
    setSelect(selectNew);
    setTop(selectNew*(CHART_HEIGHT+CHART_GAP));
    setTopOffset(topOffset);
    setHoverInfo(null);
  };

  const onMove = useCallback((event) => {
    const onDrag = (event) => {
      let rect = containerRef.current.getBoundingClientRect();
      let clientY = event.touches?event.touches[0].clientY:event.clientY;
      let topNew = clientY-rect.top-topOffset;
      if (topNew < 0) topNew = 0;
      if (topNew > rect.height-CHART_HEIGHT-CHART_GAP)
      topNew = rect.height-CHART_HEIGHT-CHART_GAP;
      setTop(topNew);

      let drop = Math.floor((clientY-rect.top)/(CHART_HEIGHT+CHART_GAP));
      if (drop < 0) drop = 0;
      if (drop > 5) drop = 5;
      if (select !== drop) { // Reorder
        let orderNew = [...order];
        let p = orderNew.splice(select, 1)[0];
        orderNew.splice(drop, 0, p);
        setOrder(orderNew);
        setSelect(orderNew.indexOf(p));
      }
    }

    if (event.touches) {
      if (select === null) {
        onStart(event);
      } else {
        onDrag(event);
      }
    } else {
      if (!pressed) return;
      if (select === null) {
        onStart(event);
      } else {
        onDrag(event);
      }
    }
  },[select, pressed, order, topOffset]);

  const onRelease = useCallback((event) => {
    if (!pressed) {
      setHoverInfo(null);
    }

    if (pressed && select === null) {
      onTap(event);
    }

    if (select !== null) {
      setSelect(null);
      setTopOffset(null);
    }

    setPressed(false);
  },[select, pressed, onTap]);

  useEffect(() => {
    document.addEventListener('mousemove', onMove);
    return () => {
      document.removeEventListener('mousemove', onMove);
    }
  },[onMove, pressed])

  useEffect(() => {
    document.addEventListener('mouseup', onRelease);
    document.addEventListener('touchend', onRelease);
    return () => {
      document.removeEventListener('mouseup', onRelease);
      document.removeEventListener('touchend', onRelease);
    }
  },[onRelease])

  let ultCharts = [];
  order.forEach((p, i) => {
    if (i === select) {
      ultCharts.push(<UltChartEmpty key={p}/>)
    } else {
      ultCharts.push(
        <UltChart key={p} data={data} player={p} range={range}/>
      )
    }
  });

  let ultChartHover = null;
  if (select!==null) {
    ultChartHover = (
      <UltChart data={data} player={order[select]} range={range}/>
    );
  }

  return(
    <StatBox fill>
      <TeamHeader
        team={team} hide={hide} onHide={onHide}
          icon={(<LineChart size='24px' color={teamToColor(team)}/>)}/>
      {!hide && (
        <Box>
          <Box
            direction={teamToRowDirection(team)} justify='center' gap='large'
            margin={{top:'small'}}>
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
          <Stack interactiveChild='first'>
            <Box
              ref={containerRef}
              style={{touchAction:'none',cursor:pressed?'grabbing':'auto'}}
              height={`${(CHART_HEIGHT+CHART_GAP)*6}px`}
              onMouseDown={() => setPressed(true)}
              onMouseOut={onOut}
              onTouchStart={() => setPressed(true)}
              onTouchMove={onMove}
              onTouchEnd={(event) => {
                if (event.cancelable) event.preventDefault();
              }}>
            </Box>
            <Box fill>
              {ultCharts}
            </Box>
            {hoverInfo && (
              <Box
                fill='vertical' style={{marginLeft:`${hoverInfo.left}px`}}
                border={{color:'text', size:'1px', side:'left', style:'dashed'}}>
              </Box>
            )}
            {hoverInfo && ( // hoverPt
              <Box
                style={{marginTop: `${hoverInfo.top}px`}}
                border={{color:'text', size:'1px', side:'top', style:'dashed'}}>
              </Box>
            )}
            {hoverInfo && (
              <Box
                style={{
                  position: 'absolute',
                  left:`${hoverInfo.left+(team===1?8:-8)}px`,
                  top:`${hoverInfo.top+8}px`,
                  transform: `translate(${team===1?0:-100}%, 0%)`,
                  maxWidth: 'none', whiteSpace:'nowrap', zIndex: 1000,
                }}
                background={{color:'black',opacity:0.5}} pad='xsmall' round='xxsmall'>
                <Info label='时间：' value={formatSeconds(hoverInfo.time)}/>
                <Info label='进度：' value={`${hoverInfo.progress}%`}/>
                {hoverInfo.elimBy && (<Info label='死亡：' value={hoverInfo.elimBy}/>)}
                {hoverInfo.elim && (<Info label='击杀：' value={hoverInfo.elim}/>)}
              </Box>
            )}
            <Box fill style={{position: 'relative'}}>
              {select!==null && (
                <Box
                  style={{
                    position:'absolute', top:`${top}px`,
                    left:'-8px', right:'-8px', maxWidth: 'none'
                  }}
                  pad={{horizontal:'6px'}} background='white' elevation='drag'
                  border={{color:'orangeLight', size:'2px', side:'all', style:'solid'}}>
                  {ultChartHover}
                </Box>
              )}
            </Box>
          </Stack>
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

const Info = ({label, value}) => {
  return (
    <Box direction='row'>
      <Text size='small' color='white'>{label}</Text>
      <Text weight={900} size='small' color='white'>{value}</Text>
    </Box>
  )
}

const UltChartEmpty = () => {
  return (
    <Box
      fill='horizontal' height={`${CHART_HEIGHT}px`} background='backgroundLight'
      margin={{vertical:`${CHART_GAP/2}px`}}
      border={{color:'lineLight', size:'1px', side:'all', style:'solid'}}>
    </Box>
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
    <Box
      fill='horizontal' height={`${CHART_HEIGHT}px`}
      margin={{vertical:`${CHART_GAP/2}px`}}>
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
