import { SliderSingleProps } from 'antd';

export const formatterSensitivity: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (
  value?: number,
) => `${value! * 10}`;
