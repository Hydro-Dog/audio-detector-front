import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
  import { decreaseBufferArrayLength } from "./utils/decreaseBufferArrayLength";

const BAR_WIDTH_PX = 10;

const audioContext = new AudioContext({
  sampleRate: 44100, // Явное указание использовать частоту дискретизации 44100 Гц
});
const analyser = audioContext.createAnalyser();
analyser.smoothingTimeConstant = 0.8;
//analyser.fftSize - количество бинов для частоты дискретизации
analyser.fftSize = 256;

function App() {
  const [volumeBars, setVolumeBars] = useState(
    Array(analyser.fftSize / 2).fill(0)
  );
  const [volume, setVolume] = useState(0);
  const [alertBackground, setAlertBackground] = useState("none");
  const [turnedOn, setTurnedOn] = useState(false);

  const [stream, setStream] = useState(null);
  const [microphoneSource, setMicrophoneSource] = useState(null);
  const [scriptProcessor, setScriptProcessor] = useState(null);
  const canvasRef = useRef<HTMLCanvasElement>({});

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function (stream) {
        setStream(stream);
        setMicrophoneSource(audioContext.createMediaStreamSource(stream));
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
        if (Date.now() - lastUpdateTime > 100) {
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
    const sendData = (volume) => {
      axios
        .post("http://localhost:3000/volumeData", { volume })
        .then(console.log)
        .catch(console.warn);
    };

    if (volume > 50) {
      setAlertBackground("red");
      sendData(volume);

      setTimeout(() => {
        setAlertBackground("none");
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
    if (canvasRef.current?.getContext) { 
      //TODO: вынести получение ctx в отдельный useRef()
      const ctx = canvasRef.current.getContext("2d")!;
      volumeBars.forEach((item, index) => {
        ctx.fillStyle = "blue";
        ctx.fillRect(index * BAR_WIDTH_PX, 0, BAR_WIDTH_PX, item);
      });
    }
  }, [volumeBars, canvasRef.current]);

  const onTunOn = () => {
    setTurnedOn((val) => !val);
    setVolumeBars(Array(analyser.fftSize / 2).fill(0));
  };

  return (
    <div>
      <button onClick={onTunOn}>{turnedOn ? "Off" : "On"}</button>
      <div style={{ background: alertBackground }}>
        Alert: {volume ? volume : "-"}
      </div>

      <canvas
        ref={canvasRef}
        width={`${(BAR_WIDTH_PX * analyser.fftSize) / 2}px`}
        height="255px"
      ></canvas>

      <div
        style={{
          position: "relative",
          width: "30px",
          height: "100px", // фиксированная высота контейнера
          border: "1px solid black", // граница контейнера для наглядности
          marginTop: "20px",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            height: `${volume}%`, // высота полосы громкости зависит от переменной volume
            backgroundColor: "lightblue",
            transition: "height 0.03s ease-in-out", // плавное изменение высоты
          }}
        ></div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "4px",
          position: "relative",
          height: "100px",
          border: "1px solid black",
        }}
      >
        {volumeBars.map((volume, index) => (
          <div
            style={{
              position: "relative",
              width: "30px",
              height: "100px", // фиксированная высота контейнера
              border: "1px solid black", // граница контейнера для наглядности
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                height: `${volume}%`, // высота полосы громкости зависит от переменной volume
                backgroundColor: "lightblue",
                transition: "height 0.03s ease-in-out", // плавное изменение высоты
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
