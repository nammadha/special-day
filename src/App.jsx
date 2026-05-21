import React, { useState, useEffect } from 'react';
import CountdownScreen from './components/CountdownScreen';
import MainContent from './components/MainContent';

const App = () => {
  // CHANGED TO TRUE FOR TESTING - THIS BYPASSES THE TIMER INSTANTLY
  const [isUnlocked, setIsUnlocked] = useState(false);

  // June 5, 2026 at Midnight
  const targetDate = new Date('June 5, 2026 00:00:00').getTime();

  useEffect(() => {
    const checkTime = setInterval(() => {
      const now = new Date().getTime();
      if (now >= targetDate) {
        setIsUnlocked(true);
        clearInterval(checkTime);
      }
    }, 1000);

    if (new Date().getTime() >= targetDate) {
      setIsUnlocked(true);
    }

    return () => clearInterval(checkTime);
  }, []);

  return (
    <div>
      {isUnlocked ? (
        <MainContent />
      ) : (
        <CountdownScreen targetDate={new Date('June 5, 2026 00:00:00')} />
      )}
    </div>
  );
};

export default App;