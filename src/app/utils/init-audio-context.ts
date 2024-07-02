type InitAudioContextArgs = {
  sampleRate?: number;
  smoothingTimeConstant?: number;
  fftSize?: number;
};

// Замыкание для хранения экземпляра
const singletonInstance = (function () {
  let instance: any;

  return (args: InitAudioContextArgs) => {
    if (!instance) {
      const { sampleRate = 44100, smoothingTimeConstant = 0.8, fftSize = 256 } = args;
      const audioContext = new AudioContext({ sampleRate });
      const analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyser.fftSize = fftSize;

      instance = { audioContext, analyser };
    }
    return instance;
  };
})();

export const getAudioContext = ({
  sampleRate = 44100,
  smoothingTimeConstant = 0.8,
  fftSize = 256,
}: InitAudioContextArgs = {}) => {
  return singletonInstance({ sampleRate, smoothingTimeConstant, fftSize });
};
