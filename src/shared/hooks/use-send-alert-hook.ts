import { useEffect, useState } from 'react';
import axios from 'axios';
import { useBoolean, useDebounceCallback } from 'usehooks-ts';
import useThrottle from './use-throttle';

type Arguments = {
  currentVolumeLevel: number;
  thresholdVolumeLevel: number;
  isListening: boolean;
};

export const useSendAlertHook = ({
  currentVolumeLevel,
  thresholdVolumeLevel,
  isListening,
}: Arguments) => {
  const [lastAlarmTimestamp, setLastAlarmTimestamp] = useState(new Date().getTime());
  const { value, setTrue, setFalse } = useBoolean(true);
  const sendAlarm = () => {
    axios.post<any>('/api/message/alarm', {
      peakAudioLevel: currentVolumeLevel,
      timestamp: new Date().toLocaleDateString(),
    });

    //-------------------------------------------
    const alertBox = document.createElement('div');

    // Set the text content
    alertBox.textContent = 'Alert!';

    // Apply styles to the div
    alertBox.style.position = 'fixed';
    alertBox.style.bottom = '20px';
    alertBox.style.right = '20px';
    alertBox.style.padding = '10px 20px';
    alertBox.style.backgroundColor = 'rgb(255, 77, 79)';
    alertBox.style.color = 'white';
    alertBox.style.borderRadius = '10px';
    alertBox.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    alertBox.style.fontSize = '16px';
    alertBox.style.fontWeight = 'bold';
    alertBox.style.zIndex = '1000';

    // Append the alert box to the body
    document.body.appendChild(alertBox);
    setTimeout(() => {
      document.body.removeChild(alertBox);
    }, 3000);
  };
  const debounced = useThrottle(sendAlarm, 5000);

  useEffect(() => {
    if (currentVolumeLevel > thresholdVolumeLevel && isListening) {
      if (value) {
        //TODO: remove any
        debounced();
      }
    }
  }, [currentVolumeLevel, thresholdVolumeLevel, isListening, lastAlarmTimestamp, value, debounced]);
};
