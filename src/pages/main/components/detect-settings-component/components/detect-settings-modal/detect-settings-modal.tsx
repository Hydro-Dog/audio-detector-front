import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SCREEN_SIZE } from '@shared/enum/screen-size';
import { DETECTION_SOURCE, ResponsiveModal, useNotificationContext } from '@shared/index';
import { Button, Modal, Tooltip, Checkbox, Select, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useWindowSize } from 'usehooks-ts';
import classNames from 'classnames';

enum SCHEDULE_START {
  NOW = 'now',
  LATER = 'later',
}

type Props = {
  handleOk: (value: any) => void;
  closeModal: () => void;
};

export const DetectSettingsModal = ({ handleOk, closeModal }: Props) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const Dialog = useMemo(() => (width < SCREEN_SIZE.XS ? ResponsiveModal : Modal), [width]);
  const [detectors, setDetectors] = useState([DETECTION_SOURCE.VIDEO, DETECTION_SOURCE.AUDIO]);
  const [selectedStartMoment, setSelectedStartMoment] = useState(SCHEDULE_START.NOW);
  const { openNotification } = useNotificationContext();

  const DETECTION_SOURCE_OPTIONS = [
    { label: t('CAMERA', { ns: 'phrases' }), value: DETECTION_SOURCE.VIDEO },
    { label: t('MIC', { ns: 'phrases' }), value: DETECTION_SOURCE.AUDIO },
  ];

  const SCHEDULE_START_OPTIONS = [
    { value: SCHEDULE_START.NOW, label: t('START_NOW', { ns: 'phrases' }) },
    { value: SCHEDULE_START.LATER, label: t('SCHEDULE_START', { ns: 'phrases' }) },
  ];

  const [plannedStartDate, setPlannedStartDate] = useState(dayjs());
  const [plannedStartTime, setPlannedStartTime] = useState(dayjs('23:00:00', 'HH:mm:SS'));

  const isPlannedTimeValid = useMemo(() => {
    if (selectedStartMoment === SCHEDULE_START.LATER) {
      const value = plannedStartDate
        ?.hour?.(plannedStartTime?.hour?.())
        ?.minute?.(plannedStartTime?.minute?.())
        ?.second?.(plannedStartTime?.second?.())
        ?.millisecond?.(plannedStartTime?.millisecond?.())
        ?.valueOf();

      return value >= Date.now();
    } else {
      return true;
    }
  }, [plannedStartDate, plannedStartTime, selectedStartMoment]);

  const onOk = () => {
    const value = plannedStartDate
      ?.hour?.(plannedStartTime?.hour?.())
      ?.minute?.(plannedStartTime?.minute?.())
      ?.second?.(plannedStartTime?.second?.())
      ?.millisecond?.(plannedStartTime?.millisecond?.())
      ?.valueOf();

    handleOk({
      startTime: selectedStartMoment === SCHEDULE_START.LATER ? value : Date.now(),
      detectors,
    });
  };

  useEffect(() => {
    if (!isPlannedTimeValid) {
      openNotification({
        type: 'error',
        message: t('ERROR', { ns: 'phrases' }),
        description: t('INVALID_START_DATE_ERROR', { ns: 'phrases' }),
      });
    }
  }, [isPlannedTimeValid, openNotification, t]);

  const checkboxGroupClasses = classNames(
    { 'rounded ring-1 ring-red-500': !detectors.length },
    'p-2 flex items-center',
  );

  return (
    <Dialog
      title={t('LAUNCH', { ns: 'phrases' })}
      open={true}
      onOk={onOk}
      width={300}
      onCancel={closeModal}
      footer={[
        <Button size={width < SCREEN_SIZE.XS ? 'large' : 'middle'} key="back" onClick={closeModal}>
          {t('CANCEL', { ns: 'phrases' })}
        </Button>,
        <Tooltip
          key="submit"
          title={!isPlannedTimeValid ? t('DETECT_SETTINGS_MODAL.PLEASE_FILL_THE_FORM') : ''}>
          <Button
            size={width < SCREEN_SIZE.XS ? 'large' : 'middle'}
            type="primary"
            disabled={!isPlannedTimeValid}
            onClick={onOk}>
            {t('OK', { ns: 'phrases' })}
          </Button>
        </Tooltip>,
      ]}>
      <div className="flex flex-col gap-5 my-5 justify-center">
        <div className="flex gap-1 items-center">
          <Select
            className="w-full"
            size="large"
            variant="filled"
            value={selectedStartMoment}
            onChange={setSelectedStartMoment}
            options={SCHEDULE_START_OPTIONS}
          />
        </div>
        {selectedStartMoment === 'later' && (
          <>
            <DatePicker
              size="large"
              status={!isPlannedTimeValid ? 'error' : ''}
              value={plannedStartDate}
              onChange={setPlannedStartDate}
            />
            <TimePicker
              size="large"
              value={plannedStartTime}
              status={!isPlannedTimeValid ? 'error' : ''}
              onChange={setPlannedStartTime}
            />
          </>
        )}

        <div className={checkboxGroupClasses}>
          <Checkbox.Group
            options={DETECTION_SOURCE_OPTIONS}
            value={detectors}
            onChange={setDetectors}
          />
          <Tooltip title={t('DETECT_SETTINGS_MODAL.PICK_DETECTION_SOURCE')}>
            <HelpOutlineIcon className="!h-4" />
          </Tooltip>
        </div>
      </div>
    </Dialog>
  );
};
