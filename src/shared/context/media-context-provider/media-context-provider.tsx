import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';
import { getAudioContext } from 'src/app/utils';

// export type VideoSettingsType = {
//   range: { min: number; max: number };
//   width: number;
//   height: number;
//   interval: number;
//   motionCoefficient: number;
// };

// export type AudioSettingsType = {
//   capturedVolumeLevel: number;
//   sensitivityCoefficient: number;
//   thresholdVolumeLevelNormalized: number;
//   maxCapturedVolumeLevel: number;
//   microphoneSource: MediaStreamAudioSourceNode | null;
//   scriptProcessor: ScriptProcessorNode | null;
// };

type MediaContextType = {
  stream: MediaStream | null;
  // audioSettings: AudioSettingsType | null;
  // setAudioSettings: Dispatch<SetStateAction<AudioSettingsType>>;
  // videoSettings: VideoSettingsType | null;
  // setVideoSettings: Dispatch<SetStateAction<VideoSettingsType>>;
};

// const videoSettingsInitialValue = {
//   range: { min: 124, max: 134 },
//   width: 640,
//   height: 480,
//   interval: 30,
//   //TODO: опльзователь может менять этот параметр
//   motionCoefficient: 0.1,
// };

// const audioSettingsInitialValue = {
//   capturedVolumeLevel: 0,
//   //TODO: опльзователь может менять этот параметр
//   sensitivityCoefficient: 3,
//   thresholdVolumeLevelNormalized: 80,
//   maxCapturedVolumeLevel: 0,
//   microphoneSource: null,
//   scriptProcessor: null,
// };

const mediaContextInitialValue = {
  stream: null,
  // audioSettings: null,
  // setAudioSettings: () => null,
  // videoSettings: null,
  // setVideoSettings: () => null,
};

const MediaContext = createContext<MediaContextType>(mediaContextInitialValue);

export const useMediaContext = () => useContext(MediaContext);

const FFT_SIZE = 256;
const BYTE_FREQUENCY_DATA_MAX = 256;

export const MediaContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const { audioContext, analyser } = getAudioContext({ fftSize: FFT_SIZE });
  // const [videoSettings, setVideoSettings] = useState(videoSettingsInitialValue);
  // const [audioSettings, setAudioSettings] = useState<AudioSettingsType>(audioSettingsInitialValue);
  // const [stream, setStream] = useState<MediaStream | null>(null);
  const [media, setMedia] = useState<{ microphoneSource: any; scriptProcessor: any }>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        // setStream(stream);
        setMedia((prev) => {
          return {
            ...prev,
            stream,
            microphoneSource: audioContext.createMediaStreamSource(stream),
            scriptProcessor: audioContext.createScriptProcessor(256, 1, 1),
          };
        });
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });
  }, []);

  // useEffect(() => {
  //   if (stream && audioSettings?.microphoneSource && audioSettings?.scriptProcessor) {
  //     audioSettings.microphoneSource.connect(analyser);
  //     analyser.connect(audioSettings.scriptProcessor);
  //     audioSettings.scriptProcessor.connect(audioContext.destination);
  //     audioContext.resume();

  //     let lastUpdateTime = Date.now();

  //     audioSettings.scriptProcessor.onaudioprocess = function () {
  //       if (Date.now() - lastUpdateTime > 100) {
  //         const array = new Uint8Array(analyser.frequencyBinCount);
  //         analyser.getByteFrequencyData(array);

  //         const arraySum = array.reduce((a, value) => a + value, 0);
  //         const average = arraySum / array.length;
  //         const averageNormalized = Math.round(
  //           (average * 100 * audioSettings.sensitivityCoefficient) / BYTE_FREQUENCY_DATA_MAX,
  //         );
  //         //TODO: вот этот setState дергает ререндер всех компонентов, где используется useMediaContext
  //         setAudioSettings((prev) => ({
  //           ...prev,
  //           capturedVolumeLevel: averageNormalized > 100 ? 100 : averageNormalized,
  //         }));
  //         lastUpdateTime = Date.now();
  //       }
  //     };
  //   }

  //   return () => {
  //     if (audioSettings?.scriptProcessor) {
  //       audioSettings.scriptProcessor.onaudioprocess = null;
  //       analyser.disconnect();
  //       audioSettings?.microphoneSource?.disconnect();
  //     }
  //   };
  // }, [
  //   stream,
  //   audioSettings.microphoneSource,
  //   audioSettings.scriptProcessor,
  //   audioSettings.sensitivityCoefficient,
  // ]);

  return (
    <MediaContext.Provider
      value={{
        media,
        setMedia,
      }}>
      {children}
    </MediaContext.Provider>
  );
};
