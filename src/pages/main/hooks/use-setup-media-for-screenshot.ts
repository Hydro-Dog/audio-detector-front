import { useEffect } from 'react';

export const useSetupMediaForScreenShot = (videoEl: HTMLVideoElement) => {
  useEffect(() => {
    if (videoEl) {
      const getUserMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoEl) videoEl.srcObject = stream;
        } catch (error) {
          console.error('Error accessing the webcam', error);
        }
      };

      getUserMedia();
    }
  }, [videoEl]);
};
