import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Text, Stack } from 'grommet';
import { Down, Up } from 'grommet-icons';
import { StatBox } from './StatBox';
import { heroAvatar } from '../assets/assets';
import { MouseUpContext, teamToColor, teamToRowDirection } from '../utils';

const ROW_HEIGHT = 56;
const ROW_GAP = 12;

export const Table = ({data, team, range, hide, onHide}) => {
  const [select, setSelect] = useState(null); // Selected player
  const [top, setTop] = useState(null); // Top for hovering row
  const [topOffset, setTopOffset] = useState(null); // Top offset to the hold point
  const [order, setOrder] = useState(teamToPlayers(team));
  const [areaOrder, setAreaOrder] = useState(teamToPlayers(team)); // Order for the underneath interaction area, synced with order after drag is completed
  const mouseUp = useContext(MouseUpContext);
  const containerRef = useRef(null);

  useEffect(() => {
    if (mouseUp) {
      // console.log('mouse up');
      setSelect(null);
      setTop(null);
      setAreaOrder(order);
    }
  },[mouseUp, order]);

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

  let rowAreas = [];
  areaOrder.forEach((player, i) => {
    rowAreas.push(
      <RowArea key={player} player={player} team={team} hero={heroData[player]}/>
    );
    if (i < 5)
    rowAreas.push(
      <Box key={player+'gap'} fill='horizontal' height={`${ROW_GAP}px`}></Box>
    ); // Manual Gap
  });

  let rows = [];
  order.forEach((player, i) => {
    if (select === player) {
      rows.push(
        <EmptyRow key={player}/>
      );
    } else {
      rows.push(
        <Row
          key={player} player={player} team={team}
          hero={heroData[player]}
          ult={ultData[player]} ultMax={ultMax}
          death={deathData[player]} deathMax={deathMax}
          elim={elimData[player]} elimMax={elimMax}/>
      );
    }
    if (i < 5)
    rows.push(
      <Box key={player+'gap'} fill='horizontal' height={`${ROW_GAP}px`}></Box>
    ); // Manual Gap
  });

  let rowHover = null;
  if (select) {
    let player = select;
    rowHover = (
      <Row
        key={player} player={player} team={team}
        hero={heroData[player]}
        ult={ultData[player]} ultMax={ultMax}
        death={deathData[player]} deathMax={deathMax}
        elim={elimData[player]} elimMax={elimMax}/>
    );
  }

  // For mouse, selct when mouse is down
  const onPress = (event) => {
    let rowNode = event.target.closest("[id^='row']");
    if (!rowNode) return;

    if (!event.touches) event.preventDefault(); // Prevent chrome from dragging text
    let idArray = rowNode.id.split('-');
    let player = parseInt(idArray[idArray.length-1],10);
    let rowRect = rowNode.getBoundingClientRect();
    let rect = containerRef.current.getBoundingClientRect();
    let clientY = event.touches?event.touches[0].clientY:event.clientY;
    let topOffsetNew = clientY-rowRect.top;
    setTop(calcTop(clientY, topOffsetNew, rect));
    setTopOffset(topOffsetNew);
    setSelect(player);
  }

  // While moving above component, handle hover or drag.
  const onMove = (event) => {
    if (mouseUp) {
      if (!event.target.id.includes('sub-bar')) return;
      let idArray = event.target.id.split('-');
      let hero = idArray[idArray.length-1];
      console.log(hero)
      // Handle hover
    } else {
      if (!select && event.touches) {
        // For touch, only select when move starts
        onPress(event);
      }

      if (select) {
        // Same moving logic if moving and selected
        let rect = containerRef.current.getBoundingClientRect();
        let clientY = event.touches?event.touches[0].clientY:event.clientY;
        let topNew = calcTop(clientY, topOffset, rect);
        setTop(topNew);

        let i = order.indexOf(select);
        let iNew = Math.floor((topNew+ROW_HEIGHT/2+ROW_GAP/2)/(ROW_HEIGHT+ROW_GAP));
        if (i !== iNew) { // Reorder
          let orderNew = [...order];
          orderNew.splice(i, 1);
          orderNew.splice(iNew, 0, select);
          setOrder(orderNew);
        }
      }
    }
  }

  // If press moves out of component, move to top or bottom.
  const onOut = (event) => {
    if (event.changedTouches) {
      event.preventDefault(); // Prevent triggering on mouse move
      // Handle tap
      if (!event.target.id.includes('sub-bar')) return;
      let idArray = event.target.id.split('-');
      let hero = idArray[idArray.length-1];
      console.log(hero)
    } else {
      if (!select) return;
      let rect = containerRef.current.getBoundingClientRect();
      let clientY = event.changedTouches?event.changedTouches[0].clientY:event.clientY;
      setTop(calcTop(clientY, topOffset, rect));
    }
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
          <Stack interactiveChild='first'>
            <Box
              ref={containerRef}
              onMouseDown={onPress}
              onMouseMove={onMove}
              onMouseLeave={onOut}
              onTouchMove={onMove}
              onTouchEnd={onOut}>
              {rowAreas}
            </Box>
            <Box style={{position:'relative'}} fill>
              {rows}
              {select && (
                <Box
                  style={{
                    position:'absolute', top:`${top}px`,
                    left:'-8px', right:'-8px', maxWidth: 'none'
                  }}
                  pad={{horizontal:'6px'}} height={`${ROW_HEIGHT}px`}
                  background='white' elevation='drag'
                  border={{color:'orangeLight', size:'2px', side:'all', style:'solid'}}>
                  {rowHover}
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </StatBox>
  );
}

// Interaction area
const RowArea = ({player, team, hero}) => {
  let total = 0;
  hero.forEach((h) => total += h[1]);

  let subBarAreas = [];
  hero.forEach((h,i) => {
    subBarAreas.push(
      <Box
        key={i} id={`sub-bar-${h[0]}`}
        height='100%' width={`${h[1]/total*100}%`} background='red'>
      </Box>
    );
  });

  return (
    <Box
      id={`row-${player}`} style={{touchAction: 'none'}}
      direction={teamToRowDirection(team)} height={`${ROW_HEIGHT}px`}
      align='center' justify='between' gap='xlarge'
      border={{color:'black', size:'1px', side:'bottom', style:'solid'}}>
      <BarContainer team={team}>
        {subBarAreas}
      </BarContainer>
      <ValueContainer></ValueContainer>
      <ValueContainer></ValueContainer>
      <ValueContainer></ValueContainer>
    </Box>
  );
}

const Row = ({
  player, team,
  hero,
  ult, ultMax,
  death, deathMax,
  elim, elimMax
}) => {
  const direction = team===1?'row':'row-reverse';

  return(
    <Box
      direction={direction} height={`${ROW_HEIGHT}px`}
      align='center' justify='between' gap='xlarge' background='white'
      border={{color:'lineLight', size:'1px', side:'bottom', style:'solid'}}>
      <BarChart data={hero} team={team}/>
      <ValueChart value={ult} max={ultMax} team={team}/>
      <ValueChart value={death} max={deathMax} team={team}/>
      <ValueChart value={elim} max={elimMax} team={team}/>
    </Box>
  );
}

const EmptyRow = () => {
  return (
    <Box
      height={`${ROW_HEIGHT}px`} fill='horizontal'
      background='backgroundLight'
      border={{color:'lineLight', size:'1px', side:'all', style:'solid'}}>
    </Box>
  );
}

const TitleRow = ({team}) => {
  let direction = team===1?'row':'row-reverse';
  return (
    <Box
      direction={direction} height='48px' background='background'
      justify='between' align='center'
      gap='xlarge' margin={{vertical: 'small'}}
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
    <BarContainer>
      <Box fill justify='center' align='center'>
        <Text size='medium'>{label}</Text>
      </Box>
    </BarContainer>
  );
}

const ValueTitle = ({label}) => {
  return (
    <ValueContainer>
      <Box fill justify='center' align='center'>
        <Text size='medium'>{label}</Text>
      </Box>
    </ValueContainer>
  );
}

const BarChart = ({data, team}) => {
  let total = 0;
  data.forEach((d) => total += d[1]);

  let subBars = [];
  data.forEach((d,i) => {
    subBars.push(
      <Box key={i} height='100%' width={`${d[1]/total*100}%`} style={{position:'relative'}}>
        <Box
          direction='row' fill wrap overflow='hidden'
          justify='center' align='center' background={teamToColor(team)}>
          <Box id='icon' width={{min: '4px'}} height='100%'></Box>
          <Box
            id='icon' background={`url(${heroAvatar[d[0]]}), white`}
            width={{min:'32px'}} height='32px' round margin={{right:'xxsmall'}}
            border={{color:'white', size:'2px', side:'all', style:'solid'}}>
          </Box>
        </Box>
      </Box>
    );
  });

  return(
    <BarContainer team={team}>
      {subBars}
    </BarContainer>
  );
}

const ValueChart = ({value, max, team}) => {
  return(
    <ValueContainer>
      <Box fill justify='between' background='backgroundLight'>
        <Text
          style={{lineHeight:'24px',userSelect:'none'}}
          weight={700} size='20px' color='blue'
          margin={{vertical:'xxsmall', left:'xsmall'}}>
          {value}
        </Text>
        <Box
          background={{color:teamToColor(team), opacity:0.2}}
          height='8px' align={team===2?'end':'start'}>
          <Box background={teamToColor(team)} height='8px' width={`${value/max*100}%`}>
          </Box>
        </Box>
      </Box>
    </ValueContainer>
  )
}

const BarContainer = (props) => {
  return(
    <Box
      width='295px' height='40px'
      gap='xxxsmall' direction={teamToRowDirection(props.team)}>
      {props.children}
    </Box>
  )
}

const ValueContainer = (props) => {
  return(
    <Box width='128px' height='40px'>
      {props.children}
    </Box>
  )
}

// {position && (
//   <Box
//     style={{
//       position: 'absolute', width: 'fit-content', maxWidth: 'none',
//       left:`${position[0]}px`, top:`${position[1]}px`,
//       transform: `translate(${team===2?'-100%':'0%'},-50%)`,
//       zIndex: 1000
//     }}
//     background={{color:'black',opacity:0.5}} round='xxsmall'>
//     <Box style={{whiteSpace:'nowrap'}}>
//       <Box
//         background={`url(${heroAvatar[hero]}), white`}
//         width='32px' height='32px' round margin='xxsmall'
//         border={{color:'white', size:'2px', side:'all', style:'solid'}}>
//       </Box>
//     </Box>
//   </Box>
// )}

// const calcPosition = (event, team) => {
//   let rect;
//   if (event.target.id === 'icon') {
//     rect = event.target.parentElement.getBoundingClientRect();
//   } else {
//     rect =  event.target.getBoundingClientRect()
//   }
//   if (rect.width > 40) return null;
//
//   return [team===2?-2:rect.width+2,rect.height/2]
// }

const teamToPlayers = (team) => {
  if (team === 2) return [7,8,9,10,11,12];
  return [1,2,3,4,5,6];
}

const calcTop = (clientY, topOffset, rect) => {
  let topNew = clientY-rect.top-topOffset;
  if (topNew < 0) topNew = 0;
  if (topNew > rect.height-ROW_HEIGHT) topNew = rect.height-ROW_HEIGHT;
  return topNew
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
