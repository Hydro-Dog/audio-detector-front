import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { DETECTION_SOURCE } from '@shared/enum';
import { SCREEN_SIZE } from '@shared/enum/screen-size';
import classNames from 'classnames';
import { useWindowSize } from 'usehooks-ts';
import { AudioDetectorComponent } from '../audio-detector-component';
import { VideoDetectorComponent } from '../video-detector-component';
import './detectors.css';

type Props = {
  detectors: DETECTION_SOURCE[];
  monitoringStatus: 'running' | 'idle' | 'scheduled';
  onVideoAlert: () => void;
  onAudioAlert: () => void;
};

export const Detectors = ({ detectors, monitoringStatus, onVideoAlert, onAudioAlert }: Props) => {
  const { width } = useWindowSize();

  const containerClasses = classNames(
    'flex h-100 gap-3',
    width > SCREEN_SIZE.MD ? 'flex-row-reverse' : 'flex-col',
  );

  const audioRecordIconClasses = classNames(
    'absolute animated-icon',
    width > SCREEN_SIZE.MD ? 'left-0 -top-8 ml-1' : '-left-8 top-1 ml-1',
  );

  const videoRecordIconClasses = classNames(
    'absolute animated-icon',
    width > SCREEN_SIZE.MD ? 'left-0 -top-8 ml-1' : '-left-8 top-1 ml-1',
  );

  return (
    <div className={containerClasses}>
      <div className="relative">
        {monitoringStatus === 'running' && detectors.includes(DETECTION_SOURCE.AUDIO) && (
          <RadioButtonCheckedIcon className={audioRecordIconClasses} />
        )}
        <AudioDetectorComponent onAlert={onAudioAlert} />
      </div>
      <div className="relative">
        {monitoringStatus === 'running' && detectors.includes(DETECTION_SOURCE.VIDEO) && (
          <RadioButtonCheckedIcon className={videoRecordIconClasses} />
        )}
        <VideoDetectorComponent onAlert={onVideoAlert} />
      </div>
    </div>
  );
};
