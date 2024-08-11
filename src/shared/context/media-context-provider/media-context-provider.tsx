import { createContext, useContext, useEffect, useState } from 'react';
import { PropsWithChildrenOnly } from '@shared/types';
import { getAudioContext } from 'src/app/utils';

type MediaContextType = {
  stream: MediaStream | null;
  // @ts-ignore
  media: any;
};

const mediaContextInitialValue = {
  stream: null,
};

// @ts-ignore
const MediaContext = createContext<MediaContextType>(mediaContextInitialValue);

export const useMediaContext = () => useContext(MediaContext);

const FFT_SIZE = 256;

export const MediaContextProvider = ({ children }: PropsWithChildrenOnly) => {
  const { audioContext } = getAudioContext({ fftSize: FFT_SIZE });
  // @ts-ignore
  const [media, setMedia] = useState<{ microphoneSource: any; scriptProcessor: any }>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
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

  return (
    <MediaContext.Provider
      value={{
        media,
        // @ts-ignore
        setMedia,
      }}>
      {children}
    </MediaContext.Provider>
  );
};
