import { VideoSettingsType } from '@shared/context';

export type VideoSettingsDTO = Pick<VideoSettingsType, 'range' | 'motionCoefficient'>;
