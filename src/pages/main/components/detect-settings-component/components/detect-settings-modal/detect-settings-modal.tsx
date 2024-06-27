import { useState, useEffect, useRef } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNotificationContext, useThemeToken } from '@shared/index';
import {
  Button,
  Modal,
  Tooltip,
  Checkbox,
  Select,
  InputNumber,
  TimePicker,
  DatePicker,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useBoolean } from 'usehooks-ts';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const DetectSettingsModal = ({
  handleOk,
  activeDetectors,
  setActiveDetectors,
  setStartTime,
  closeModal,
}: any) => {
  const [currentOption, setCurrentOptions] = useState('now');
  const token = useThemeToken();
  const { value: isTimeValid, setTrue: setTimeValid, setFalse: setTimeInvalid } = useBoolean();
  const { openNotification } = useNotificationContext();

  useEffect(() => {
    if (currentOption === 'now') {
      setTimeValid();
    } else {
      setStartTime(dayjs().add(5, 'minute'));
    }
  }, [currentOption]);

  const options = [
    { label: 'Камера', value: 'video' },
    { label: 'Микрофон', value: 'audio' },
  ];

  useEffect(() => {
    if (!activeDetectors?.length) {
      openNotification({
        type: 'error',
        message: 'Error',
        description: 'Не выбран ни один источник для наблюдения.',
      });
    }
  }, [activeDetectors?.length]);

  return (
    <Modal
      title="Запуск"
      open={true}
      onOk={handleOk}
      width={300}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal}>
          Cancel
        </Button>,
        <Tooltip
          key="submit"
          title={!activeDetectors.length || !isTimeValid ? 'Пожалуйста, заполните форму.' : ''}>
          <Button
            type="primary"
            disabled={!activeDetectors.length || !isTimeValid}
            onClick={handleOk}>
            Ok
          </Button>
        </Tooltip>,
      ]}>
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex gap-1 items-center">
          <Select
            variant="filled"
            style={{ width: 220 }}
            value={currentOption}
            onChange={(value) => {
              setCurrentOptions(value);
              if (value === 'now') {
                setStartTime(0);
              }
            }}
            options={[
              { value: 'now', label: 'Запустить сейчас' },
              { value: 'later', label: 'Запланировать' },
            ]}
          />
        </div>
        {currentOption === 'later' && (
          <>
            <DatePicker
              style={{ width: 220 }}
              showTime
              status={!isTimeValid ? 'error' : ''}
              // defaultValue={dayjs().add(1, 'minute')}
              onChange={(value, dateString) => {
                console.log('value.valueOf() < Date.now(): ', value.valueOf() < Date.now());
                if (value.valueOf() < Date.now()) {
                  setTimeInvalid();
                  openNotification({
                    type: 'error',
                    message: 'Error',
                    description: 'Выбранная дата не может быть меньше текущей.',
                  });
                } else {
                  setTimeValid();
                }
                setStartTime(value);
              }}
            />
          </>
        )}

        <div className="flex items-center">
          <Checkbox.Group options={options} value={activeDetectors} onChange={setActiveDetectors} />
          <Tooltip title="Выберите инструменты, которые хотите запустить.">
            <HelpOutlineIcon className="!h-4" />
          </Tooltip>
          {/* {!activeDetectors.length && (
            <Tooltip title="Не выбран ни один источник для наблюдения.">
              <ExclamationCircleOutlined style={{ color: token.colorError }} />
            </Tooltip>
          )} */}
        </div>
      </div>
    </Modal>
  );
};
