import { useState, useEffect } from 'react';
import { initAudioContext } from 'src/app/utils';
import { useBoolean } from 'usehooks-ts';

const FFT_SIZE = 256;
const BYTE_FREQUENCY_DATA_MAX = 256;
const { audioContext, analyser } = initAudioContext({ fftSize: FFT_SIZE });

export const useMediaListenerHook = () => {
  const [videoSettings, setVideoSettings] = useState({});
  const [sensitivityCoefficient, setSensitivityCoefficient] = useState(1);
  const [thresholdVolumeLevelNormalized, setThresholdVolumeLevelNormalized] = useState(80);
  const [maxCapturedVolumeLevel, setMaxCapturedVolumeLevel] = useState(0);
  const [capturedVolumeLevel, setCapturedVolumeLevel] = useState(0);
  const {
    value: isMicOn,
    setTrue: setMicOn,
    setFalse: setMicOff,
    toggle: toggleMic,
  } = useBoolean(true);
  const {
    value: isListening,
    setTrue: setIsListeningTrue,
    setFalse: setIsListeningFalse,
    toggle: toggleIsListening,
  } = useBoolean(false);
  const [stream, setStream] = useState<MediaStream>();
  const [microphoneSource, setMicrophoneSource] = useState<MediaStreamAudioSourceNode>();
  const [scriptProcessor, setScriptProcessor] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setStream(stream);
        setMicrophoneSource(audioContext.createMediaStreamSource(stream));
        //@ts-ignore
        setScriptProcessor(audioContext.createScriptProcessor(256, 1, 1));
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });
  }, []);

  useEffect(() => {
    if (stream && microphoneSource && scriptProcessor) {
      // if (isMicOn && isListening) {
      microphoneSource.connect(analyser);
      analyser.connect(scriptProcessor);
      //@ts-ignore
      scriptProcessor.connect(audioContext.destination);
      audioContext.resume();

      let lastUpdateTime = Date.now();

      //@ts-ignore
      scriptProcessor.onaudioprocess = function () {
        if (Date.now() - lastUpdateTime > 20) {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);

          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          const averageNormalized = Math.round(
            (average * 100 * sensitivityCoefficient) / BYTE_FREQUENCY_DATA_MAX,
          );
          setCapturedVolumeLevel(averageNormalized > 100 ? 100 : averageNormalized);
          lastUpdateTime = Date.now();
        }
      };
    }

    return () => {
      if (scriptProcessor) {
        scriptProcessor.onaudioprocess = null;
        analyser.disconnect();
        microphoneSource.disconnect();
      }
    };
  }, [stream, microphoneSource, scriptProcessor, sensitivityCoefficient, isMicOn]);

  useEffect(() => {
    if (maxCapturedVolumeLevel < capturedVolumeLevel) {
      setMaxCapturedVolumeLevel(capturedVolumeLevel);
    }
  }, [maxCapturedVolumeLevel, capturedVolumeLevel]);

  return {
    capturedVolumeLevel,
    sensitivityCoefficient,
    setSensitivityCoefficient,
    thresholdVolumeLevelNormalized,
    setThresholdVolumeLevelNormalized,
    maxCapturedVolumeLevel,
    isMicOn,
    setMicOn,
    setMicOff,
    toggleMic,
    isListening,
    setIsListeningTrue,
    setIsListeningFalse,
    toggleIsListening,
    stream,
    videoSettings,
    setVideoSettings,
  };
};
