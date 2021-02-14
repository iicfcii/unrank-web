import { useState, useEffect } from 'react';

export const teamToColor = (team) => {
  if (team === 2) return 'red';
  return 'blue';
}

export const formatSeconds = (s) => {
  let min = Math.floor(s/60);
  let sec = s-min*60

  if (min === 0) return `${sec}秒`;

  return `${min}分${sec}秒`;
}

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
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    }
  },[])

  return mouseUp;
}
