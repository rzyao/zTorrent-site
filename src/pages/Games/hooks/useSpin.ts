import { useState } from 'react';

export function useSpin() {
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  const handleSpin = () => {
    if (!spinning) {
      setSpinning(true);
      setTimeout(() => {
        const result = Math.floor(Math.random() * 100) + 1;
        setSpinResult(result);
        setSpinning(false);
      }, 2000);
    }
  };

  return { spinning, spinResult, handleSpin };
}
