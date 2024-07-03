import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';

export type AudioSettingsType = {
  capturedVolumeLevel: number;
  sensitivityCoefficient: number;
  thresholdVolumeLevelNormalized: number;
};

type AudioSettingsContextType = {
  audioSettings: AudioSettingsType | null;
  setAudioSettings: Dispatch<SetStateAction<AudioSettingsType>>;
};

const audioSettingsInitialValue = {
  capturedVolumeLevel: 0,
  sensitivityCoefficient: 3,
  thresholdVolumeLevelNormalized: 80,
};

const audioContextInitialValue = {
  audioSettings: null,
  setAudioSettings: () => null,
};

const AudioSettingsContext = createContext<AudioSettingsContextType>(audioContextInitialValue);

export const useAudioSettingsContext = () => useContext(AudioSettingsContext);

export const AudioSettingsContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const [audioSettings, setAudioSettings] = useState<AudioSettingsType>(audioSettingsInitialValue);

  return (
    <AudioSettingsContext.Provider
      value={{
        audioSettings,
        setAudioSettings,
      }}>
      {children}
    </AudioSettingsContext.Provider>
  );
};
