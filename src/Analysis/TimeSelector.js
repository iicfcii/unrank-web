import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Text, Stack } from 'grommet';
import { formatSeconds } from '../utils';

const THUMB_WIDTH = 12;

// This range includes end while others don't
export const TimeSelector = ({range, max, onChange, reverse}) => {
  range = reverseRange(range,max,reverse)
  const containerRef = useRef(null);
  const [ltLeft, setLTLeft] = useState(null);
  const [rtLeft, setRTLeft] = useState(null);

  const [ltViewLeft, setLTViewLeft] = useState(null);
  const [rtViewLeft, setRTViewLeft] = useState(null);

  const [select, setSelect] = useState(null);
  const [barOffset, setBarOffset] = useState(null);

  const [pressed, setPressed] = useState(null);
  const [mouseLeft, setMouseLeft] = useState(null);

  const onRange = (range, max, width) => {
    let left = range[0]/max*width;
    let right = range[1]/max*width-THUMB_WIDTH;
    return [left, right];
  }

  const onStart = (event) => {
    if (!event.touches) event.preventDefault(); // Prevent text selection
    if (event.target.id === 'left' || event.target.id === 'right') {
      setSelect(event.target.id);
    } else if (event.target.id ==='bar') {
      setPressed('bar');
    } else {
      setPressed('outside');
    }
  }

  const onMove = useCallback((event) => {
    if (!containerRef.current) return;

    let rect = containerRef.current.getBoundingClientRect();
    let clientX = event.touches?event.touches[0].clientX:event.clientX;
    let left = clientX-rect.left;

    if (select) {
      if (left < 0) left = 0;
      if (left > rect.width-THUMB_WIDTH) left = rect.width-THUMB_WIDTH;
      setMouseLeft(left);
      let rangeNew = toRange(left, select, rect.width, ltLeft, rtLeft, max, barOffset);
      let thumbsLeft = onRange(rangeNew, max, rect.width);
      setLTViewLeft(thumbsLeft[0]);
      setRTViewLeft(thumbsLeft[1]);
      if (onChange) onChange(reverseRange(rangeNew,max,reverse));
    }

    if (pressed === 'bar') {
      let thumbsLeft = onRange(range, max, rect.width);
      setSelect('bar');
      setBarOffset(left-thumbsLeft[0]);
    }

    setPressed(null);
  },[select, ltLeft, rtLeft, max, onChange, reverse, barOffset, pressed, range])

  const toRange = (left, select, width, ltLeft, rtLeft, max, offset) => {
    let leftValue; let rightValue;

    const toValue = (l) => {
      return Math.round(l/width*max);
    }
    const valueTooClose = (lV, rV) => {
      return Math.abs(lV-rV)*width/max < 2*THUMB_WIDTH;
    }

    if (select === 'left') {
      if (left > rtLeft-THUMB_WIDTH) left = rtLeft-THUMB_WIDTH;
      leftValue = toValue(left);
      rightValue = toValue(rtLeft+THUMB_WIDTH);
      if (valueTooClose(leftValue, rightValue)) leftValue -= 1;
    } else if (select === 'right') {
      if (left < ltLeft+THUMB_WIDTH) left = ltLeft+THUMB_WIDTH;
      leftValue = toValue(ltLeft);
      rightValue = toValue(left+THUMB_WIDTH);
      if (valueTooClose(leftValue, rightValue)) rightValue += 1;
    } else {

      let barLeft = left-offset;
      let barRight = barLeft+(rtLeft-ltLeft)+THUMB_WIDTH;
      let totalLength = barRight-barLeft;
      if (barLeft < 0) {
        barLeft = 0;
        barRight = totalLength;
      } else if (barRight > width) {
        barLeft = width-totalLength;
        barRight = width;
      } else {
      }
      leftValue = toValue(barLeft);
      rightValue = toValue(barRight);
    }
    return [leftValue, rightValue];
  }

  const onRelease = useCallback((event) => {
    let selected = select;
    let left = mouseLeft;
    let rect = containerRef.current.getBoundingClientRect();

    if (pressed) {
      let clientX = event.changedTouches?event.changedTouches[0].clientX:event.clientX;
      let lDist = Math.abs((clientX-rect.left)-ltLeft);
      let rDist = Math.abs((clientX-rect.left)-(rtLeft+THUMB_WIDTH));
      selected = lDist < rDist?'left':'right';
      left = clientX-rect.left;
      left = selected==='left'?left:left-THUMB_WIDTH;
      setPressed(null);
    }

    if (selected && left) {
      let rangeNew = toRange(left, selected, rect.width, ltLeft, rtLeft, max, barOffset);
      let thumbsLeft = onRange(rangeNew, max, rect.width);
      setLTLeft(thumbsLeft[0]);
      setRTLeft(thumbsLeft[1]);
      setLTViewLeft(thumbsLeft[0]);
      setRTViewLeft(thumbsLeft[1]);
      setSelect(null);
      setBarOffset(null);
      setMouseLeft(null);
      if (onChange) onChange(reverseRange(rangeNew,max,reverse));
    } else {
      setSelect(null);
      setMouseLeft(null);
    }
  },[select, rtLeft, ltLeft, onChange, max, reverse, mouseLeft, pressed, barOffset]);

  // Handle resize and first time
  useEffect(() => {
    const onResize = () => {
      let rect = containerRef.current.getBoundingClientRect();
      let thumbsLeft = onRange(range, max, rect.width);
      setLTLeft(thumbsLeft[0]);
      setRTLeft(thumbsLeft[1]);
      setLTViewLeft(thumbsLeft[0]);
      setRTViewLeft(thumbsLeft[1]);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  },[max, range]);

  // Handle mouse move from document so that mouse does not need to stay inside element
  useEffect(() => {
    document.addEventListener('mousemove', onMove);
    return () => {
      document.removeEventListener('mousemove', onMove);
    }
  },[onMove])

  // Handle release
  useEffect(() => {
    window.addEventListener('mouseup', onRelease);
    window.addEventListener('touchend', onRelease);
    return () => {
      window.removeEventListener('mouseup', onRelease);
      window.removeEventListener('touchend', onRelease);
    }
  },[onRelease])

  let barLeft;
  let barRight;
  let barViewLeft;
  let barViewRight;
  if (containerRef.current) {
    let rect = containerRef.current.getBoundingClientRect();
    barLeft = ltLeft;
    barRight = rect.width-rtLeft-THUMB_WIDTH;
    barViewLeft = ltViewLeft;
    barViewRight = rect.width-rtViewLeft-THUMB_WIDTH;
  }

  return(
    <Box>
      <Box
        ref={containerRef} height='8px' justify='center' flex={false}
        margin={{top:'xsmall', bottom:'xxsmall'}}>
        <Stack fill interactiveChild='first'>
          <Box
            fill
            onMouseDown={onStart}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={(event) => {
               // Prevent triggering mouse down when touch started
              if (event.cancelable) event.preventDefault();
            }}>
            <Bar id='bar' left={barLeft} right={barRight} hidden/>
            <Thumb id='left' left={ltLeft} hidden/>
            <Thumb id='right' left={rtLeft} hidden/>
          </Box>
          <Box fill background='background'>
            <Bar left={barViewLeft} right={barViewRight}/>
            <Thumb left={ltViewLeft}/>
            <Thumb left={rtViewLeft}/>
          </Box>
        </Stack>
      </Box>
      <Box direction={reverse?'row-reverse':'row'} justify='between' flex={false}>
        <Text size='small'>{formatSeconds(reverseRange(range,max,reverse)[0])}</Text>
        <Text size='small'>{formatSeconds(reverseRange(range,max,reverse)[1])}</Text>
      </Box>
    </Box>
  );
}

const Bar = ({id, left, right, hidden}) => {
  return (
    <Box
      id={id}
      style={{
        position:'absolute',
        top:'0px',bottom:'0px',
        left:`${left}px`,
        right:`${right}px`,
      }}
      background={!hidden?{color:'orange',opacity:0.2}:'none'}>
    </Box>
  );
}

const Thumb = ({id, left, hidden}) => {
  return (
    <Box
      id={id}
      style={{
        touchAction:'none',
        position:'absolute',
        top:'-4px',left:`${left}px`,
        boxShadow: !hidden?'0px 0px 5px rgba(0, 0, 0, 0.2)':'none'
      }}
      background={!hidden?'orange':undefined} flex={false}
      width={`${THUMB_WIDTH}px`} height='16px' round='xxxsmall'>
    </Box>
  );
}

const reverseRange = (r, max, reverse) => {
  if (reverse) {
    return [max-r[1],max-r[0]];
  } else {
    return r;
  }
}
