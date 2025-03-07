import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Box, Text, Stack } from 'grommet';
import { TextAlignLeft } from 'grommet-icons';
import { StatBox } from './StatBox';
import { TeamHeader } from './TeamHeader';
import { heroAvatar } from '../assets/assets';
import { teamToColor, teamToRowDirection, teamToPlayers } from '../utils';

const ROW_HEIGHT = 56;
const ROW_GAP = 12;

export const Table = ({data, team, range, hide, onHide}) => {
  const [select, setSelect] = useState(null); // Selected player
  const [top, setTop] = useState(null); // Top for hovering row
  const [topOffset, setTopOffset] = useState(null); // Top offset to the hold point
  const [order, setOrder] = useState(teamToPlayers(team));
  const [areaOrder, setAreaOrder] = useState(teamToPlayers(team)); // Order for the underneath interaction area, synced with order after drag is completed
  const [hoverInfo, setHoverInfo] = useState(null);
  const containerRef = useRef(null);
  const pressStarted = useRef(false);

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

  const inside = (event) => {
    if (!containerRef.current) return false;
    // Make sure hovering inside container, may be triggered by other table
    let containerRect = containerRef.current.getBoundingClientRect();
    let clientX = event.changedTouches?event.changedTouches[0].clientX:event.clientX;
    let x = clientX-containerRect.left;
    if (x < 0 || x > containerRect.width) return false;
    return true
  }

  const onStart = (event) => {
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

    // Prevent scrolling on touch devices
    if (event.touches) document.body.style.overflow = 'hidden';
  }

  const onHover = useCallback((event) => {
    if (!inside(event)) return;

    let rect;
    if (event.target.id.includes('sub-bar')){
      rect = event.target.getBoundingClientRect();
    }

    if (!rect || rect.width > 40) {
      setHoverInfo(null);
      return;
    }

    let idArray = event.target.id.split('-');
    let hero = idArray[idArray.length-1];
    let rectContainer =  containerRef.current.getBoundingClientRect();
    let left = rect.left-rectContainer.left+(team===2?-2:rect.width+2);
    let top = rect.top-rectContainer.top+rect.height/2;
    setHoverInfo([left,top,hero]);
  }, [team]);

  const onMove = useCallback((event) => {
    // Same logic for mouse or touch moving
    const onDrag = () => {
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

    if (event.touches) {
      if (!select) {
        // pressStarted.current = false;
      } else{
        onDrag();
      }
    } else {
      if (!pressStarted.current) {
        onHover(event);
      } else {
        if (!select) {
          let v = Math.pow(event.movementX,2)+Math.pow(event.movementY,2)
          // Move slowly consider as holding
          if (v > 40) pressStarted.current = false;
        } else {
          onDrag();
        }
      }
    }
  }, [select, onHover, order, topOffset]);

  const onRelease = useCallback((event) => {
    if (!pressStarted.current) {
      setHoverInfo(null);
    } else {
      if (event.touches && select === null) {
        onHover(event);
      }
    }

    setSelect(null);
    setTop(null);
    setAreaOrder(order);
    pressStarted.current = false;
    document.body.style.overflow = '';
  },[order, onHover, select]);

  useEffect(() => {
    document.addEventListener('mousemove', onMove);
    return () => {
      document.removeEventListener('mousemove', onMove);
    }
  },[onMove])

  useEffect(() => {
    document.addEventListener('mouseup', onRelease);
    document.addEventListener('touchend', onRelease);
    return () => {
      document.removeEventListener('mouseup', onRelease);
      document.removeEventListener('touchend', onRelease);
    }
  },[onRelease])

  let rowAreas = [];
  areaOrder.forEach((player, i) => {
    rowAreas.push(
      <RowArea key={player} player={player} team={team} hero={heroData[player]} select={select}/>
    );
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

  return(
    <StatBox id='table' fill='horizontal' pad='medium' justify='start'>
      <TeamHeader
        team={team} hide={hide} onHide={onHide}
        icon={(<TextAlignLeft size='24px' color={teamToColor(team)}/>)}/>
      {!hide && (
        <Box>
          <TitleRow team={team}/>
          <Stack interactiveChild='first'>
            <Box
              ref={containerRef}
              style={{cursor:select?'grabbing':'auto'}}
              onMouseDown={(event) => {
                // Prevent text drag and selection
                if (!event.touches) event.preventDefault();

                pressStarted.current = true;
                setTimeout(() => {
                  if (pressStarted.current) onStart(event);
                },1000);
              }}
              onTouchStart={(event) => {
                pressStarted.current = true;
                setTimeout(() => {
                  if (pressStarted.current) onStart(event);
                },1000);

                // Prevent selecting other elements and clear existing selection
                document.body.style.WebkitUserSelect='none';
                window.getSelection().removeAllRanges();
              }}
              onTouchMove={onMove}
              onTouchEnd={(event) => {
                if (event.cancelable) event.preventDefault();
                document.body.style.WebkitUserSelect='';
              }}>
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
            <Box fill style={{position: 'relative'}}>
              {hoverInfo && (
                <Box
                  style={{
                    position:'absolute',maxWidth: 'none',
                    top:`${hoverInfo[1]}px`,left:`${hoverInfo[0]}px`,
                    transform: `translate(${team===2?'-100%':'0%'},-50%)`,
                    zIndex: 1000, whiteSpace:'nowrap'
                  }}
                  pad={{left:'4px'}} round='xxsmall'
                  background={{color:'black',opacity:0.5}}>
                  <HeroAvatar avatar={heroAvatar[hoverInfo[2]]}/>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </StatBox>
  );
}

const rowPropsNotChanged = (prevProps, nextProps) => {
  let notEqual = Object.keys(prevProps).some((key) => {
    if (key !== 'hero') {
      return prevProps[key] !== nextProps[key]
    } else {
      if (prevProps[key].length !== nextProps[key].length) {
        return true;
      } else {
        return prevProps[key].some((ph,i) => {
          let nh = nextProps[key][i];
          return ph[0] !== nh[0] || ph[1] !== nh[1];
        });
      }
    }
  });
  return !notEqual;
}

// Interaction area
const RowArea = memo(({player, team, hero, select}) => {
  let total = 0;
  hero.forEach((h) => total += h[1]);

  let subBarAreas = [];
  hero.forEach((h,i) => {
    subBarAreas.push(
      <Box
        background='red'
        key={i} id={`sub-bar-${h[0]}`} height='100%'
        style={{width:`${h[1]/total*100}%`}}>
      </Box>
    );
  });

  return (
    <Box
      id={`row-${player}`}
      direction={teamToRowDirection(team)} height={`${ROW_HEIGHT+ROW_GAP}px`}
      align='center' justify='between' gap='xlarge'>
      <BarContainer team={team}>
        {subBarAreas}
      </BarContainer>
      <ValueContainer></ValueContainer>
      <ValueContainer></ValueContainer>
      <ValueContainer></ValueContainer>
    </Box>
  );
},rowPropsNotChanged);

const Row = memo(({
  player, team,
  hero,
  ult, ultMax,
  death, deathMax,
  elim, elimMax
}) => {
  const direction = team===1?'row':'row-reverse';

  return(
    <Box
      direction={direction} height={`${ROW_HEIGHT+ROW_GAP}px`}
      align='center' justify='between' gap='xlarge' background='white'
      border={{color:'lineLight', size:'1px', side:'bottom', style:'solid'}}>
      <BarChart data={hero} team={team}/>
      <ValueChart value={ult} max={ultMax} team={team}/>
      <ValueChart value={death} max={deathMax} team={team}/>
      <ValueChart value={elim} max={elimMax} team={team}/>
    </Box>
  );
},rowPropsNotChanged);

const EmptyRow = () => {
  return (
    <Box
      height={`${ROW_HEIGHT+ROW_GAP}px`} fill='horizontal'
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
      <BarTitle label='Hero'/>
      <ValueTitle label='Ult'/>
      <ValueTitle label='Death'/>
      <ValueTitle label='Elim'/>
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
      <Box
        key={i} height='100%'
        style={{position:'relative',width:`${d[1]/total*100}%`}}>
        <Box
          direction='row' fill wrap overflow='hidden'
          justify='center' align='center' background={teamToColor(team)}>
          <Box id='icon' width={{min: '4px'}} height='100%'></Box>
          <HeroAvatar avatar={heroAvatar[d[0]]}/>
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
          <Box background={teamToColor(team)} height='8px' style={{width:`${value/max*100}%`}}>
          </Box>
        </Box>
      </Box>
    </ValueContainer>
  )
}

const BarContainer = (props) => {
  return(
    <Box
      width='295px' height='40px' margin={{vertical:`${ROW_GAP/2}px`}}
      gap='xxxsmall' direction={teamToRowDirection(props.team)}>
      {props.children}
    </Box>
  )
}

const HeroAvatar = ({avatar}) => {
  return (
    <Box
      background={`url(${avatar}), white`}
      width='32px' height='32px' round margin={{vertical:'xxsmall', right:'4px'}}
      border={{color:'white', size:'2px', side:'all', style:'solid'}}>
    </Box>
  )
}

const ValueContainer = (props) => {
  return(
    <Box width='128px' height='40px' margin={{vertical:`${ROW_GAP/2}px`}}>
      {props.children}
    </Box>
  )
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
