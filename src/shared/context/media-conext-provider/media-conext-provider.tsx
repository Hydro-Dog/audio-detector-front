/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { useMediaListenerHook } from '@shared/index';
import { PropsWithChildrenOnly } from '@shared/types';

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
};

const MediaContext = createContext<AudioContextType>(mediaContextInitialValue);

export const useMediaContext = () => useContext(MediaContext);

export const MediaContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const value = useMediaListenerHook();

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};
