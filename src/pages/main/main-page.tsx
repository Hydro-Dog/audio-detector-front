import { useEffect, useRef, useState } from 'react';
import { VolumeLevelBarWidget } from '@widgets/index';
import { Button, Slider, SliderSingleProps } from 'antd';
import axios from 'axios';
import { initAudioContext } from '../../app/utils';

const BAR_WIDTH_PX = 10;
const FFT_SIZE = 256;
const BYTE_FREQUENCY_DATA_MAX = 256;
const { audioContext, analyser } = initAudioContext({ fftSize: FFT_SIZE });
const MIN_SLIDER = 1;

const marks: SliderSingleProps['marks'] = {
  0: '0',
  10: {
    style: { color: '#f50' },
    label: <strong>10</strong>,
  },
};

export const MainPage = () => {
  const [sensitivityCoefficient, setSensitivityCoefficient] = useState(1);
  const [MAX, SET_MAX] = useState(0);

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
    if (stream && microphoneSource && scriptProcessor && turnedOn) {
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
          const avarageNormalized = Math.round(
            (average * 100 * sensitivityCoefficient) / BYTE_FREQUENCY_DATA_MAX,
          );
          setVolume(avarageNormalized);
          lastUpdateTime = Date.now();
        }
      };
    }
  }, [microphoneSource, scriptProcessor, sensitivityCoefficient, stream, turnedOn]);

  useEffect(() => {
    if (MAX < volume) {
      SET_MAX(volume);
    }
  }, [MAX, volume]);

  useEffect(() => {
    if (turnedOn) {
      audioContext.resume();
    } else {
      audioContext.suspend();
    }
  }, [turnedOn]);

  const onTunOn = () => {
    setTurnedOn((val) => !val);
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

  return (
    <div>
      <button onClick={onTunOn}>{turnedOn ? 'Off' : 'On'}</button>
      <div style={{ background: alertBackground }}>Alert: {volume ? volume : '-'}</div>
      <VolumeLevelBarWidget volumeLevel={volume} />
      {/* TODO: переименовать слайдер в "чувствительность" 0 - 100 для тупых */}
      <div
        style={{
          display: 'inline-block',
          height: 300,
          marginLeft: 70,
        }}>
        <Slider
          vertical
          marks={marks}
          value={sensitivityCoefficient}
          onChange={(val) => {
            if (val >= MIN_SLIDER) setSensitivityCoefficient(val);
          }}
          max={10}
          min={MIN_SLIDER}
          step={0.2}
        />
      </div>
      <Button onClick={onSendRequestClick}>Send request</Button>
      <div>MAX: {MAX}</div>
      <div>sensitivityCoefficient: {sensitivityCoefficient}</div>
    </div>
  );
};
