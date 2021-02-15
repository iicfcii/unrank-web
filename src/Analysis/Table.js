import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Text } from 'grommet';
import { Down, Up } from 'grommet-icons';
import { StatBox } from './StatBox';
import { heroAvatar } from '../assets/assets';
import { MouseUpContext, teamToColor } from '../utils';

const ROW_HEIGHT = 56;
const ROW_GAP = 12;

export const Table = ({data, team, range, hide, onHide}) => {
  const [select, setSelect] = useState(null);
  const [top, setTop] = useState(null);
  const [topOffset, setTopOffset] = useState(null);
  const [order, setOrder] = useState(teamToPlayers(team));
  const mouseUp = useContext(MouseUpContext);
  const containerRef = useRef(null)

  useEffect(() => {
    if (mouseUp) {
      setSelect(null);
      setTop(null);
    }
  },[mouseUp]);

  let color = teamToColor(team);
  let direction = team===1?'row':'row-reverse';
  let heroData = calcHero(data, range, team);
  let ultData = calcUlt(data, range, team);
  let deathData = calcDeath(data, range, team);
  let elimData = calcElim(data, range, team);

  let ultMax = 0;
  teamToPlayers(team).forEach((player) => {
    if (ultMax < ultData[player]) ultMax = ultData[player];
  })
  let deathMax = 0;
  teamToPlayers(team).forEach((player) => {
    if (deathMax < deathData[player]) deathMax = deathData[player];
  })
  let elimMax = 0;
  teamToPlayers(team).forEach((player) => {
    if (elimMax < elimData[player]) elimMax = elimData[player];
  })

  let playerRows = [];
  order.forEach((player, i) => {
    if (player === select) {
      playerRows.push(
        <PlayerRowEmpty key={player}/>
      );
    } else {
      playerRows.push(
        <PlayerRow
          key={player} player={player} team={team}
          hero={heroData[player]}
          ult={ultData[player]} ultMax={ultMax}
          death={deathData[player]} deathMax={deathMax}
          elim={elimData[player]} elimMax={elimMax}
          onSelect={(player, clientY, topOffsetNew) => {
            let rect = containerRef.current.getBoundingClientRect();
            setTop(calcTop(clientY, topOffsetNew, rect));
            setTopOffset(topOffsetNew);
            setSelect(player);
          }}/>
      );
    }
    // Manual gap
    if (i < 5) {
      playerRows.push(
        <Box key={player+'gap'} fill='horizontal' height={`${ROW_GAP}px`}></Box>
      )
    }
  });

  let playerRowHover = null;
  if (select) {
    let player = select
    playerRowHover = (
      <PlayerRow
        key={player} player={player} team={team}
        hero={heroData[player]}
        ult={ultData[player]} ultMax={ultMax}
        death={deathData[player]} deathMax={deathMax}
        elim={elimData[player]} elimMax={elimMax}
        onSelect={(player, clientY, topOffsetNew) => {
          let rect = containerRef.current.getBoundingClientRect();
          setTop(calcTop(clientY, topOffsetNew, rect));
          setTopOffset(topOffsetNew);
          setSelect(player);
        }}/>
    );
  }

  return(
    <StatBox fill='horizontal' pad='medium' justify='start'>
      <Box
        direction={direction} justify='between' align='center'
        pad={{horizontal: 'small', vertical: 'xsmall'}}
        background={{color:color, opacity:'0.1'}}>
        <Box
          justify='center' align='center'
          width='36px' height='36px'
          onClick={() => {if (onHide) onHide(!hide)}}>
          {hide?(
            <Down size='16px' color='text'/>
          ):(
            <Up size='16px' color='text'/>
          )}
        </Box>
        <Text weight={700} color={teamToColor(team)}>{`队伍${team}`}</Text>
      </Box>
      {!hide && (
        <Box>
          <TitleRow team={team}/>
          <Box
            ref={containerRef}
            style={{position:'relative'}}
            onMouseMove={(event) => {
              if (!select || mouseUp) return;
              let rect = containerRef.current.getBoundingClientRect();
              let topNew = calcTop(event.clientY, topOffset, rect)
              setTop(topNew);

              let i = order.indexOf(select)
              let iNew = Math.floor((topNew+ROW_HEIGHT/2+ROW_GAP/2)/(ROW_HEIGHT+ROW_GAP));
              // console.log(topNew, i, iNew)
              if (i !== iNew) { // Reorder
                let orderNew = [...order];
                orderNew.splice(i, 1);
                orderNew.splice(iNew, 0, select);
                setOrder(orderNew);
              }
            }}
            onMouseOut={(event) => {
              if (!select || mouseUp) return;
              let rect = containerRef.current.getBoundingClientRect();
              setTop(calcTop(event.clientY, topOffset, rect));
            }}>
            {playerRows}
            {top!==null && (
              <Box
                style={{
                  position:'absolute', top:`${top}px`,
                  left:'-8px', right:'-8px', maxWidth: 'none'
                }}
                pad={{horizontal:'6px'}}
                height={`${ROW_HEIGHT}px`} background='white' elevation='drag'
                border={{color:'orangeLight', size:'2px', side:'all', style:'solid'}}>
                {playerRowHover}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </StatBox>
  );
}

const calcTop = (clientY, topOffset, rect) => {
  let topNew = clientY-rect.top-topOffset;
  if (topNew < 0) topNew = 0;
  if (topNew > rect.height-ROW_HEIGHT) topNew = rect.height-ROW_HEIGHT;
  return topNew
}

const PlayerRow = ({
  player, team,
  hero,
  ult, ultMax,
  death, deathMax,
  elim, elimMax,
  onSelect
}) => {
  const containerRef = useRef(null);
  const direction = team===1?'row':'row-reverse';

  return(
    <Box
      ref={containerRef}
      onMouseDown={(event) => {
        event.preventDefault(); // Prevent chrome from dragging text
        let rect = containerRef.current.getBoundingClientRect()
        if (onSelect) onSelect(player, event.clientY, event.clientY-rect.top);
      }}>
      <Box
        direction={direction} height={`${ROW_HEIGHT}px`}
        align='center' justify='between' gap='xlarge'
        border={{color:'lineLight', size:'1px', side:'bottom', style:'solid'}}>
        <BarChart data={hero} team={team}/>
        <ValueChart value={ult} max={ultMax} team={team}/>
        <ValueChart value={death} max={deathMax} team={team}/>
        <ValueChart value={elim} max={elimMax} team={team}/>
      </Box>
    </Box>
  );
}

const PlayerRowEmpty = () => {
  return (
    <Box
      fill='horizontal' background='backgroundLight' height={`${ROW_HEIGHT}px`}
      border={{color:'lineLight', size:'1px', side:'all', style:'solid'}}>
    </Box>
  );
}

const TitleRow = ({team}) => {
  let direction = team===1?'row':'row-reverse';
  return (
    <Box
      direction={direction} height='48px'
      margin={{vertical: 'small'}}
      background='background' gap='xlarge' justify='between'
      border={{color:'line', size:'2px', side:'bottom', style:'solid'}}>
      <BarTitle label='英雄'/>
      <ValueTitle label='大招'/>
      <ValueTitle label='死亡'/>
      <ValueTitle label='击杀'/>
    </Box>
  );
}

const BarTitle = ({label}) => {
  return (
    <Box width='295px' height='100%' justify='center' align='center'>
      <Text size='medium'>{label}</Text>
    </Box>
  );
}

const ValueTitle = ({label}) => {
  return (
    <Box width='128px' height='100%' justify='center' align='center'>
      <Text size='medium'>{label}</Text>
    </Box>
  );
}

const BarChart = ({data, team}) => {
  let direction = team===1?'row':'row-reverse';
  let total = 0;
  data.forEach((d) => {
    total += d[1];
  });

  let subBars = [];
  data.forEach((d,i) => {
    subBars.push(
      <SubBar key={i} percent={d[1]/total*100} hero={d[0]} team={team}/>
    );
  });

  return(
    <Box width='295px' height='40px' gap='xxxsmall' direction={direction}>
      {subBars}
    </Box>
  )
}

const SubBar = ({percent, hero, team}) => {
  const [position, setPosition] = useState(null);
  const mouseUp = useContext(MouseUpContext);

  return (
    <Box height='100%' width={`${percent}%`} style={{position:'relative'}}>
      <Box
        direction='row' fill wrap overflow='hidden'
        justify='center' align='center' background={teamToColor(team)}
        onMouseMove={(event) => {
          if (!mouseUp) return;
          let rect;
          if (event.target.id === 'icon') {
            rect = event.target.parentElement.getBoundingClientRect();
          } else {
            rect =  event.target.getBoundingClientRect()
          }
          if (rect.width > 40) return;

          setPosition([team===2?-2:rect.width+2,rect.height/2]);
        }}
        onMouseOut={() => {
          setPosition(null);
        }}>
        <Box id='icon' width={{min: '4px'}} height='100%'></Box>
        <Box
          id='icon' background={`url(${heroAvatar[hero]}), white`}
          width={{min:'32px'}} height='32px' round margin={{right:'xxsmall'}}
          border={{color:'white', size:'2px', side:'all', style:'solid'}}>
        </Box>
      </Box>
      {position && (
        <Box
          style={{
            position: 'absolute', width: 'fit-content', maxWidth: 'none',
            left:`${position[0]}px`, top:`${position[1]}px`,
            transform: `translate(${team===2?'-100%':'0%'},-50%)`,
            zIndex: 1000
          }}
          background={{color:'black',opacity:0.5}} round='xxsmall'>
          <Box style={{whiteSpace:'nowrap'}}>
            <Box
              background={`url(${heroAvatar[hero]}), white`}
              width='32px' height='32px' round margin='xxsmall'
              border={{color:'white', size:'2px', side:'all', style:'solid'}}>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

const ValueChart = ({value, max, team}) => {
  return(
    <Box justify='between' background='backgroundLight'>
      <Text
        style={{lineHeight: '24px'}}
        weight={700} size='20px' color='blue'
        margin={{vertical:'xxsmall', left:'xsmall'}}>
        {value}
      </Text>
      <Box
        background={{color:teamToColor(team), opacity:0.2}}
        height='8px' width='128px'
        align={team===2?'end':'start'}>
        <Box background={teamToColor(team)} height='8px' width={`${value/max*100}%`}>
        </Box>
      </Box>
    </Box>
  )
}

const teamToPlayers = (team) => {
  if (team === 2) return [7,8,9,10,11,12];
  return [1,2,3,4,5,6];
}

const calcHero = (data, range, team) => {
  let hero = {};
  teamToPlayers(team).forEach((player) => {
    hero[player] = [];
    for (let i=range[0]; i<range[1]; i++){
      let h = data['hero'][player][i];
      let hName = data['heroes'][h];
      if (h === null || h === -1) continue;
      if (hero[player].length === 0) {
        hero[player].push([hName,1]);
      } else {
        let lastI = hero[player].length-1;
        let lastHName = hero[player][lastI][0]
        if (lastHName === hName) {
          hero[player][lastI][1] ++;
        } else {
          hero[player].push([hName,1]);
        }
      }
    }
  });
  return hero;
}


const calcUlt = (data, range, team) => {
  let ult = {};
  teamToPlayers(team).forEach((player) => {
    ult[player] = 0;
    for (let i=range[0]; i<range[1]; i++){
      if (data.ult_use[player][i] !== null) ult[player] += 1;
    }
  });
  return ult;
}

const calcDeath = (data, range, team) => {
  let death = {};
  teamToPlayers(team).forEach((player) => {
    death[player] = 0;
    for (let i=range[0]; i<range[1]; i++){
      if (data.elim[player][i] !== null) death[player] += 1;
    }
  });
  return death;
}

const calcElim = (data, range, team) => {
  let elim = {};
  teamToPlayers(team).forEach((player) => {
    elim[player] = 0;
    if (player < 7) {
      for (let i=7; i<13; i++){
        for (let j=range[0]; j<range[1]; j++){
          if (data.elim[i][j] === player) elim[player] += 1;
        }
      }
    } else {
      for (let i=1; i<7; i++){
        for (let j=range[0]; j<range[1]; j++){
          if (data.elim[i][j] === player) elim[player] += 1;
        }
      }
    }
  });
  return elim;
}
