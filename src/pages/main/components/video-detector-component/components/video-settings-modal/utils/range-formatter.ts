import { SliderSingleProps } from 'antd';

export const rangeFormatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (
  value?: number,
) => `${100 - value! * 500 + 5}%`;
