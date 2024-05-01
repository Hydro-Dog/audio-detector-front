import { useEffect, useRef, useState } from 'react';
import { initAudioContext } from '../../app/utils';
import { drawLinearSpectrogram } from '../../shared/utils/draw-linear-spectrogram';

const BAR_WIDTH_PX = 10;
const FFT_SIZE = 256;
const { audioContext, analyser } = initAudioContext({ fftSize: FFT_SIZE });

function App() {
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

  // useEffect(() => {
  //   const sendData = (volume: number) => {
  //     axios
  //       .post('http://localhost:3000/volumeData', { volume })
  //       .then(console.log)
  //       .catch(console.warn);
  //   };

  //   if (volume > 50) {
  //     setAlertBackground('red');
  //     sendData(volume);

  //     setTimeout(() => {
  //       setAlertBackground('none');
  //     }, 2000);
  //   }
  // }, [volume]);

  useEffect(() => {
    if (turnedOn) {
      audioContext.resume();
    } else {
      audioContext.suspend();
    }
  }, [turnedOn]);

  useEffect(() => {
    //TODO: вынести получение ctx в отдельный useRef()
    const canvasContext = canvasRef.current?.getContext('2d');
    const canvas = canvasRef?.current;

    if (canvasContext) {
      requestAnimationFrame(() => {
        drawLinearSpectrogram({
          canvasContext,
          volumeBars,
          barWidth: BAR_WIDTH_PX,
          maxBarHeight: FFT_SIZE - 1,
        });
      });
    }

    return () => {
      if (canvasContext) {
        return canvasContext.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
      }
    };
  }, [volumeBars]);

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
