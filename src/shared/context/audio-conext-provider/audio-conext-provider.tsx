/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { useMicListenerHook } from '@shared/index';
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
};

const audioContextInitialValue = {
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
};

const AudioContext = createContext<AudioContextType>(audioContextInitialValue);

export const useAudioContext = () => useContext(AudioContext);

export const AudioContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const value = useMicListenerHook();

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
