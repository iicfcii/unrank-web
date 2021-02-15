import { useState, useEffect, createContext } from 'react';

export const teamToColor = (team) => {
  if (team === 2) return 'red';
  return 'blue';
}

export const teamToRowDirection = (team) => {
  return team===1?'row':'row-reverse';
}

export const formatSeconds = (s) => {
  let min = Math.floor(s/60);
  let sec = s-min*60

  if (min === 0) return `${sec}秒`;

  return `${min}分${sec}秒`;
}

export const MouseUpContext = createContext(true);

export const useMouseUp = () => {
  const [mouseUp, setMouseUp] = useState(true);

  useEffect(() => {
    let onMouseDown = () => {
      setMouseUp(false);
    };
    let onMouseUp = () => {
      setMouseUp(true);
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchstart', onMouseDown);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchstart', onMouseDown);
      document.removeEventListener('touchend', onMouseUp);
    }
  },[])

  return mouseUp;
}
