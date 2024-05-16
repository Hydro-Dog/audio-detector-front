import { useEffect, useRef, useState } from 'react';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button } from 'antd';
import axios from 'axios';
import { initAudioContext } from '../../app/utils';

const BAR_WIDTH_PX = 10;
const FFT_SIZE = 256;
const BYTE_FREQUENCY_DATA_MAX = 256;
const { audioContext, analyser } = initAudioContext({ fftSize: FFT_SIZE });

export const MainPage = () => {
  const [volumeBars, setVolumeBars] = useState(Array(analyser.fftSize / 2).fill(0));
  const [volume, setVolume] = useState(0);
  const [alertBackground, setAlertBackground] = useState('none');
  const [turnedOn, setTurnedOn] = useState(false);

  const [stream, setStream] = useState<MediaStream>();
  const [microphoneSource, setMicrophoneSource] = useState<MediaStreamAudioSourceNode>();
  const [scriptProcessor, setScriptProcessor] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function (stream) {
        setStream(stream);
        setMicrophoneSource(audioContext.createMediaStreamSource(stream));
        //@ts-ignore
        setScriptProcessor(audioContext.createScriptProcessor(256, 1, 1));
      })
      .catch(function (err) {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (stream && microphoneSource && scriptProcessor) {
      // audioContext.resume();

      microphoneSource.connect(analyser);
      analyser.connect(scriptProcessor);
      //TODO: поставить фильтр на обрезание частот выше половины частоты дескретизации (антиалиасинговый фильтра)
      //@ts-ignore
      scriptProcessor.connect(audioContext.destination);
      let lastUpdateTime = Date.now();

      //@ts-ignore
      scriptProcessor.onaudioprocess = function () {
        if (Date.now() - lastUpdateTime > 20) {
          //analyser.frequencyBinCount - количество бинов в выходной АЧХ - в два раза меньше fftSize
          //создадим массив из {analyser.frequencyBinCount} элементов
          const array = new Uint8Array(analyser.frequencyBinCount);
          //заполним массив ачх поступающего с микрофона сигнала
          //getFloatFrequencyData использовать для получения величин в дицибеллах?
          // getByteFrequencyData использовать для получения величин в байтах [0-255]
          analyser.getByteFrequencyData(array);

          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          const avarageNormalized = Math.round((average * 100) / BYTE_FREQUENCY_DATA_MAX);
          setVolume(avarageNormalized);
          setVolumeBars(Array.from(array));
          lastUpdateTime = Date.now();
        }
      };
    }
  }, [microphoneSource, scriptProcessor, stream]);

  useEffect(() => {
    if (turnedOn) {
      audioContext.resume();
    } else {
      audioContext.suspend();
    }
  }, [turnedOn]);

  // useEffect(() => {
  //   //TODO: вынести получение ctx в отдельный useRef()
  //   const canvasContext = canvasRef.current?.getContext('2d');
  //   const canvas = canvasRef?.current;

  //   if (canvasContext) {
  //     requestAnimationFrame(() => {
  //       // drawLinearSpectrogram({
  //       //   canvasContext,
  //       //   volumeBars,
  //       //   barWidth: BAR_WIDTH_PX,
  //       //   maxBarHeight: FFT_SIZE - 1,
  //       // });
  //       drawVolumeLevel({ canvasContext, volume });
  //     });
  //   }

  //   return () => {
  //     if (canvasContext) {
  //       return canvasContext.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
  //     }
  //   };
  // }, [volumeBars]);

  const onTunOn = () => {
    setTurnedOn((val) => !val);
    setVolumeBars(Array(analyser.fftSize / 2).fill(0));
  };

  const onSendRequestClick = () => {
    axios
      .post('http://localhost:8080/message/alarm', {
        level: 88,
        time: new Date().toLocaleDateString(),
      })
      .then(function (response) {
        console.log(response);
      });
  };

  const containerStyle = {
    position: 'relative',
    transform: 'scaleY(-1)',
    width: '30px',
    height: '300px',
    border: '1px solid lightblue',
    borderRadius: '15px',
    overflow: 'hidden',
  };

  // Стили для полосы громкости
  const barStyle = {
    height: `${volume}%`,
    background: '#20A4F370',
    width: `100%`,
    transition: 'width 0.1s ease-in-out',
  };

  return (
    <div>
      <button onClick={onTunOn}>{turnedOn ? 'Off' : 'On'}</button>
      <div style={{ background: alertBackground }}>Alert: {volume ? volume : '-'}</div>

      {/* <canvas
        style={{ transform: 'scaleY(-1)' }}
        ref={canvasRef}
        width={`${(BAR_WIDTH_PX * analyser.fftSize) / 2}px`}
        height="255px"></canvas> */}

      <VolumeLevelBarWidget volumeLevel={volume} />

      <Button onClick={onSendRequestClick}>Send request</Button>
    </div>
  );
};
