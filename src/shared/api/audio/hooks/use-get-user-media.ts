import { useState } from 'react';

export const useGetUserMedia =
  ((audioContext: AudioContext) => {
    const [stream, setStream] = useState<MediaStream>();
    const [microphoneSource, setMicrophoneSource] = useState<MediaStreamAudioSourceNode>();
    const [scriptProcessor, setScriptProcessor] = useState(null);

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function (stream) {
        setStream(stream);
        setMicrophoneSource(audioContext.createMediaStreamSource(stream));
        //@ts-expect-error
        setScriptProcessor(audioContext.createScriptProcessor(256, 1, 1));
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  []);
