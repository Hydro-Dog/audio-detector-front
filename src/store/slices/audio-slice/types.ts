import { AudioSettingsType } from '@shared/index';

export type AudioSettingsDTO = Pick<
  AudioSettingsType,
  'sensitivityCoefficient' | 'thresholdVolumeLevelNormalized'
>;
