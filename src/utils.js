import { useState, useEffect, createContext } from 'react';

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const teamToColor = (team) => {
  if (team === 2) return 'red';
  return 'blue';
}

export const teamToRowDirection = (team) => {
  return team===1?'row':'row-reverse';
}

export const teamToPlayers = (team) => {
  if (team === 2) return [7,8,9,10,11,12];
  return [1,2,3,4,5,6];
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
  },[]);

  return mouseUp;
}
