export type Settings = {
  id: string;
  userId: string;
  thresholdVolumeLevelNormalized: number;
  micSensitivityCoefficient: number;
};

export type SettingsDTO = Omit<Settings, 'id' | 'userId'>
