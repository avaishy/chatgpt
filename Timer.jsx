/* istanbul ignore file */
import React, { useEffect, useState } from 'react';

const Timer = (fontColor) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      setSeconds(0);
    };
  }, []);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{color: `${fontColor}`}}>
      <h3>Timer: {formatTime(seconds)}</h3>
    </div>
  );
};

export default Timer;
