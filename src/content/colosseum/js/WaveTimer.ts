/** Format 600 ms game ticks as minutes, seconds, and tenths. */
export function formatWaveTime(ticks: number) {
  const tenths = ticks * 6;
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor((tenths % 600) / 10);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths % 10}`;
}
