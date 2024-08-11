import { useState } from 'react';

export const useMonitoringState = () => {
  const monitoringScheduledInitialStatus = !localStorage.getItem('startOptions')
    ? 'idle'
    : // @ts-ignore
      JSON.parse(localStorage.getItem('startOptions'))?.startTime - Date.now() > 0
      ? 'scheduled'
      : 'running';

  const [monitoringStatus, setMonitoringStatus] = useState<'idle' | 'running' | 'scheduled'>(
    monitoringScheduledInitialStatus,
  );

  return { monitoringStatus, setMonitoringStatus };
};
