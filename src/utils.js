export const formatSeconds = (s) => {
  let min = Math.floor(s/60);
  let sec = s-min*60

  if (min === 0) return `${sec}秒`;

  return `${min}分${sec}秒`;
}
