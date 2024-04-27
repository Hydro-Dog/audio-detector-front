export const decreaseBufferArrayLength = (array: number[], newLength: number) => {
  const barSize = Math.floor(array.length / newLength);
  const volumes = new Array(newLength).fill(0).map((_, i) => {
    const start = i * barSize;
    const end = start + barSize;
    const sum = array.slice(start, end).reduce((a, b) => a + b, 0);
    return sum / barSize;
  });

  return volumes.map((volume) => Math.round(volume));
};
