import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import { initAudioContext } from './utils';
import { drawLinearSpectrogram } from '../shared/utils/draw-linear-spectrogram';

const BAR_WIDTH_PX = 10;
const { audioContext, analyser } = initAudioContext();
// const audioContext = new AudioContext({
//   sampleRate: 44100, // Явное указание использовать частоту дискретизации 44100 Гц
// });

// const analyser = audioContext.createAnalyser();

// analyser.smoothingTimeConstant = 0.8;
// //analyser.fftSize - количество бинов для частоты дискретизации
// analyser.fftSize = 256;

// const draw = (
//   ctx: {
//     fillStyle: string;
//     fillRect: (arg0: number, arg1: number, arg2: number, arg3: any) => void;
//   },
//   volumeBars: any[],
// ) => {
//   volumeBars.forEach((item: any, index: number) => {
//     ctx.fillStyle = 'blue';
//     ctx.fillRect(index * BAR_WIDTH_PX, 0, BAR_WIDTH_PX, item);
//   });
// };

function App() {
  const [volumeBars, setVolumeBars] = useState(Array(analyser.fftSize / 2).fill(0));
  const [volume, setVolume] = useState(0);
  const [alertBackground, setAlertBackground] = useState('none');
  const [turnedOn, setTurnedOn] = useState(false);

  const [stream, setStream] = useState<MediaStream>();
  const [microphoneSource, setMicrophoneSource] = useState<MediaStreamAudioSourceNode>();
  const [scriptProcessor, setScriptProcessor] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement>();

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
      scriptProcessor.connect(audioContext.destination);
      let lastUpdateTime = Date.now();

      scriptProcessor.onaudioprocess = function () {
        if (Date.now() - lastUpdateTime > 50) {
          //analyser.frequencyBinCount - количество бинов в выходной АЧХ - в два раза меньше fftSize
          //создадим массив из {analyser.frequencyBinCount} элементов
          const array = new Uint8Array(analyser.frequencyBinCount);
          //заполним массив ачх поступающего с микрофона сигнала
          //getFloatFrequencyData использовать для получения величин в дицибеллах?
          analyser.getByteFrequencyData(array);

          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          setVolume(Math.round(average));
          // console.log("array: ", array);
          // const decreasedBuffer = decreaseBufferArrayLength(
          //   array as unknown as number[],
          //   100
          // );
          setVolumeBars(Array.from(array));
          lastUpdateTime = Date.now();
        }
      };
    }
  }, [microphoneSource, scriptProcessor, stream]);

  useEffect(() => {
    const sendData = (volume: number) => {
      axios
        .post('http://localhost:3000/volumeData', { volume })
        .then(console.log)
        .catch(console.warn);
    };

    if (volume > 50) {
      setAlertBackground('red');
      sendData(volume);

      setTimeout(() => {
        setAlertBackground('none');
      }, 2000);
    }
  }, [volume]);

  useEffect(() => {
    if (turnedOn) {
      audioContext.resume();
    } else {
      audioContext.suspend();
    }
  }, [turnedOn]);

  useEffect(() => {
    //TODO: вынести получение ctx в отдельный useRef()
    const ctx = canvasRef.current.getContext('2d')!;
    // volumeBars.forEach((item, index) => {
    //   ctx.fillStyle = "blue";
    //   ctx.fillRect(index * BAR_WIDTH_PX, 0, BAR_WIDTH_PX, item);
    // });

    requestAnimationFrame(() => {
      drawLinearSpectrogram({ ctx, volumeBars, barWidth: BAR_WIDTH_PX });
    });

    return () => ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [volumeBars, canvasRef.current]);

  const onTunOn = () => {
    setTurnedOn((val) => !val);
    setVolumeBars(Array(analyser.fftSize / 2).fill(0));
  };

  return (
    <div>
      <button onClick={onTunOn}>{turnedOn ? 'Off' : 'On'}</button>
      <div style={{ background: alertBackground }}>Alert: {volume ? volume : '-'}</div>

      <canvas
        style={{ transform: 'scaleY(-1)' }}
        ref={canvasRef}
        width={`${(BAR_WIDTH_PX * analyser.fftSize) / 2}px`}
        height="255px"></canvas>
    </div>
  );
}

export default App;
