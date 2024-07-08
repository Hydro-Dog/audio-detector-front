import { useState, useEffect, Dispatch, SetStateAction, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SCREEN_SIZE } from '@shared/enum/screen-size';
import {
  DETECTION_SOURCE,
  ResponsiveModal,
  useNotificationContext,
  useThemeToken,
} from '@shared/index';
import { Button, Modal, Tooltip, Checkbox, Select, DatePicker, Typography, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useBoolean, useWindowSize } from 'usehooks-ts';

const { Title } = Typography;

enum SCHEDULE_START {
  NOW = 'now',
  LATER = 'later',
}

type Props = {
  handleOk: () => void;
  activeDetectors: DETECTION_SOURCE[];
  setActiveDetectors: Dispatch<SetStateAction<DETECTION_SOURCE[]>>;
  setStartTime: Dispatch<SetStateAction<Dayjs | null>>;
  startTime: Dayjs | null;
  closeModal: () => void;
};

export const DetectSettingsModal = ({
  handleOk,
  activeDetectors,
  setActiveDetectors,
  setStartTime,
  startTime,
  closeModal,
}: Props) => {
  const { t } = useTranslation();
  const [currentOption, setCurrentOptions] = useState(SCHEDULE_START.NOW);
  const { value: isTimeValid, setTrue: setTimeValid, setFalse: setTimeInvalid } = useBoolean();
  const { openNotification } = useNotificationContext();

  const DETECTION_SOURCE_OPTIONS = [
    { label: t('CAMERA', { ns: 'phrases' }), value: DETECTION_SOURCE.VIDEO },
    { label: t('MIC', { ns: 'phrases' }), value: DETECTION_SOURCE.AUDIO },
  ];

  const SCHEDULE_START_OPTIONS = [
    { value: SCHEDULE_START.NOW, label: t('START_NOW', { ns: 'phrases' }) },
    { value: SCHEDULE_START.LATER, label: t('SCHEDULE_START', { ns: 'phrases' }) },
  ];

  useEffect(() => {
    if (currentOption === SCHEDULE_START.NOW) {
      setTimeValid();
    } else if (SCHEDULE_START.LATER && !startTime) {
      setTimeInvalid();
    }
  }, [currentOption, setTimeInvalid, setTimeValid, startTime]);

  useEffect(() => {
    if (!activeDetectors?.length) {
      openNotification({
        type: 'error',
        message: t('ERROR', { ns: 'phrases' }),
        description: t('DETECT_SETTINGS_MODAL.NO_DETECTION_SOURCE_PICKED_ERROR'),
      });
    }
  }, [activeDetectors?.length, openNotification, t]);

  const isFormValid = !!activeDetectors.length && !!isTimeValid;

  const onStartMomentChange = (value: SCHEDULE_START) => {
    setCurrentOptions(value);
    if (value === SCHEDULE_START.NOW) {
      setStartTime(null);
    }
  };

  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs('23:00:00', 'HH:mm:SS'));

  useEffect(() => {
    const value = date
      ?.hour?.(time?.hour?.())
      ?.minute?.(time?.minute?.())
      ?.second?.(time?.second?.())
      ?.millisecond?.(time?.millisecond?.());

    if (value?.valueOf() < Date.now()) {
      setTimeInvalid();
      openNotification({
        type: 'error',
        message: t('ERROR', { ns: 'phrases' }),
        description: t('INVALID_START_DATE_ERROR', { ns: 'phrases' }),
      });
    } else {
      setTimeValid();
    }
    setStartTime(value);
  }, [date, openNotification, setStartTime, setTimeInvalid, setTimeValid, t, time]);

  const { width } = useWindowSize();
  const Dialog = useMemo(() => (width < SCREEN_SIZE.XS ? ResponsiveModal : Modal), [width]);

  return (
    <Dialog
      title={t('LAUNCH', { ns: 'phrases' })}
      open={true}
      onOk={handleOk}
      width={300}
      onCancel={closeModal}
      footer={[
        <Button size={width < SCREEN_SIZE.XS ? 'large' : 'middle'} key="back" onClick={closeModal}>
          {t('CANCEL', { ns: 'phrases' })}
        </Button>,
        <Tooltip
          key="submit"
          title={!isFormValid ? t('DETECT_SETTINGS_MODAL.PLEASE_FILL_THE_FORM') : ''}>
          <Button
            size={width < SCREEN_SIZE.XS ? 'large' : 'middle'}
            type="primary"
            disabled={!isFormValid}
            onClick={handleOk}>
            {t('OK', { ns: 'phrases' })}
          </Button>
        </Tooltip>,
      ]}>
      <div className="flex flex-col gap-5 my-5 justify-center">
        <div className="flex gap-1 items-center">
          <Select
            className='w-full'
            size="large"
            variant="filled"
            value={currentOption}
            onChange={onStartMomentChange}
            options={SCHEDULE_START_OPTIONS}
          />
        </div>
        {currentOption === 'later' && (
          <>
            <DatePicker
              size="large"
              status={!isTimeValid ? 'error' : ''}
              value={date}
              onChange={setDate}
            />
            <TimePicker
              size="large"
              value={time}
              status={!isTimeValid ? 'error' : ''}
              onChange={setTime}
            />
          </>
        )}

        <div className="flex items-center">
          <Checkbox.Group
            options={DETECTION_SOURCE_OPTIONS}
            value={activeDetectors}
            onChange={setActiveDetectors}
          />
          <Tooltip title={t('DETECT_SETTINGS_MODAL.PICK_DETECTION_SOURCE')}>
            <HelpOutlineIcon className="!h-4" />
          </Tooltip>
        </div>
      </div>
    </Dialog>
  );
};
