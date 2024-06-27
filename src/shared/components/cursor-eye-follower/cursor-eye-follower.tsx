import { useState, useEffect } from 'react';

type Position = {
  x: number;
  y: number;
};

export const CursorEyeFollower = () => {
  const [pupilPosition, setPupilPosition] = useState<Position>({ x: 0, y: 0 });
  const eyeCenter: Position = { x: 100, y: 100 }; // Static position of the eye center on the screen
  const radius = 5; // Radius within which the pupil can move

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - eyeCenter.x;
      const dy = event.clientY - eyeCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      if (distance < radius) {
        setPupilPosition({ x: dx, y: dy });
      } else {
        setPupilPosition({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="flex items-center">
      <div className="relative w-4 h-4 flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          {/* Eye background */}
          <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
          {/* Pupil that moves */}
          <circle cx={12 + pupilPosition.x} cy={12 + pupilPosition.y} r="4" fill="black" />
        </svg>
      </div>
      <div className="relative w-4 h-4 flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          {/* Eye background */}
          <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
          {/* Pupil that moves */}
          <circle cx={12 + pupilPosition.x} cy={12 + pupilPosition.y} r="4" fill="black" />
        </svg>
      </div>
    </div>
  );
};
