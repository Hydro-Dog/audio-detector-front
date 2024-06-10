type InitAudioContextArgs = {
  sampleRate?: number;
  smoothingTimeConstant?: number;
  fftSize?: number;
};

export const initAudioContext = ({
  sampleRate = 44100,
  smoothingTimeConstant = 0.8,
  fftSize = 256,
}: InitAudioContextArgs = {}) => {
  console.log('!initAudioContext')
  const audioContext = new AudioContext({
    sampleRate, // Явное указание использовать частоту дискретизации 44100 Гц
  });
  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = smoothingTimeConstant;
  //fftSize - количество бинов для частоты дискретизации
  analyser.fftSize = fftSize;

  return { audioContext, analyser };
};
