import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';

export type VideoSettingsType = {
  motionCoefficient: number;
};

const videoSettingsInitialValue = {
  motionCoefficient: 0.1,
};

const videoContextInitialValue = {
  videoSettings: null,
  setVideoSettings: () => null,
};

type VideoSettingsContextType = {
  videoSettings: VideoSettingsType | null;
  setVideoSettings: Dispatch<SetStateAction<VideoSettingsType>>;
};

const VideoSettingsContext = createContext<VideoSettingsContextType>(videoContextInitialValue);

export const useVideoSettingsContext = () => useContext(VideoSettingsContext);

export const VideoSettingsContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const [videoSettings, setVideoSettings] = useState<VideoSettingsType>(videoSettingsInitialValue);

  return (
    <VideoSettingsContext.Provider
      value={{
        videoSettings,
        setVideoSettings,
      }}>
      {children}
    </VideoSettingsContext.Provider>
  );
};
