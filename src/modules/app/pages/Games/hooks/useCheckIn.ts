import { useState } from 'react';

export function useCheckIn() {
  const [checkInDone, setCheckInDone] = useState(false);
  const handleCheckIn = () => {
    if (!checkInDone) {
      setCheckInDone(true);
    }
  };
  return { checkInDone, handleCheckIn };
}
