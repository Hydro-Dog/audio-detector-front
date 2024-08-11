import { VideoSettingsType } from '@shared/context';

//@ts-ignore
export type VideoSettingsDTO = Pick<VideoSettingsType, 'range' | 'motionCoefficient'>;
