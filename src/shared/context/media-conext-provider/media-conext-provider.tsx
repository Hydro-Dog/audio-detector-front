/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { useMediaListenerHook } from '@shared/index';
import { PropsWithChildrenOnly } from '@shared/types';

export type VideoSettingsType = {
  range: { min: number; max: number };
  width: number;
  height: number;
  interval: number;
  motionCoefficient: number;
};

type AudioContextType = {
  capturedVolumeLevel: number;
  sensitivityCoefficient: number;
  setSensitivityCoefficient: Dispatch<SetStateAction<number>>;
  thresholdVolumeLevelNormalized: number;
  setThresholdVolumeLevelNormalized: Dispatch<SetStateAction<number | null>>;
  maxCapturedVolumeLevel: number;
  isMicOn: boolean;
  setMicOn: () => void;
  setMicOff: () => void;
  toggleMic: () => void;
  isListening: boolean;
  setIsListeningTrue: () => void;
  setIsListeningFalse: () => void;
  toggleIsListening: () => void;
  stream: MediaStream | null;
  videoSettings: VideoSettingsType;
  setVideoSettings: Dispatch<SetStateAction<VideoSettingsType>>;
};

const videoSettingsInitialValue = {
  range: { min: 124, max: 134 },
  width: 640,
  height: 480,
  interval: 30,
  motionCoefficient: 0.005,
};

const mediaContextInitialValue = {
  capturedVolumeLevel: 0,
  sensitivityCoefficient: 1,
  thresholdVolumeLevelNormalized: 80,
  setSensitivityCoefficient: () => null,
  setThresholdVolumeLevelNormalized: () => null,
  maxCapturedVolumeLevel: 0,
  isMicOn: false,
  setMicOn: () => null,
  setMicOff: () => null,
  toggleMic: () => null,
  isListening: false,
  setIsListeningTrue: () => null,
  setIsListeningFalse: () => null,
  toggleIsListening: () => null,
  stream: null,
  videoSettings: videoSettingsInitialValue,
  setVideoSettings: () => null,
};

const MediaContext = createContext<AudioContextType>(mediaContextInitialValue);

export const useMediaContext = () => useContext(MediaContext);

export const MediaContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const [videoSettings, setVideoSettings] = useState(videoSettingsInitialValue)
  const value = useMediaListenerHook();

  return (
    <MediaContext.Provider value={{ ...value, videoSettings, setVideoSettings }}>{children}</MediaContext.Provider>
  );
};
