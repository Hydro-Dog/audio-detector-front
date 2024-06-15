import { VideoDetectorComponent, AudioDetectorComponent } from './components';

export const MainPage = () => {
  return (
    <div className="flex w-full h-screen">
      <div className="m-auto flex flex-row-reverse gap-3">
        <AudioDetectorComponent />
        <VideoDetectorComponent />
      </div>
    </div>
  );
};
