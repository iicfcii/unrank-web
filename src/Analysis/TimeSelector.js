import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, RangeSelector, ThemeContext } from 'grommet';
import { formatSeconds } from '../utils';

export const TimeSelector = ({data, range, onChange}) => {
  const containerRef = useRef(null);

  const [movingRange, setMovingRange] = useState(false);

  let maxRange = data.time.data.length-1

  useEffect(() => {
    let onMouseUp = () => {
      setMovingRange(false);
    }
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    }
  },[])

  useEffect(() => {
    let onMouseMove = (event) => {
      if (movingRange !=='bar' || !containerRef.current) return;

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

      if (values && onChange) onChange(values);
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    }
  },[movingRange, range, maxRange, data, onChange])

  return(
    <ThemeContext.Extend value={{box:{extend:`:focus{outline:none}`}}}>
      <Box direction='row' margin={{top:'xxsmall', bottom:'xsmall'}} justify='between' flex={false}>
        <Text size='small'>{formatSeconds(range[0])}</Text>
        <Text size='small'>{formatSeconds(range[1])}</Text>
      </Box>
      <Box flex={false}>
        <Box
          ref={containerRef}
          background='#F4F4F4' height='8px'
          onMouseDown={(event) => {
            // NOTE: use style to detect which element is pressed
            setMovingRange(event.target.style.cursor?'bar':'other')
          }}>
        <RangeSelector
          opacity='0.2' size='8px' round='small'
          direction="horizontal"
          min={0} max={maxRange}
          values={range}
          onChange={(values) => {
            if (values && onChange) onChange(values);
          }}/>
        </Box>
      </Box>
    </ThemeContext.Extend>
  );
}
