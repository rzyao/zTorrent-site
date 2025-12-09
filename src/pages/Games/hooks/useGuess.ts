import { useState } from 'react';
import { games } from '../constants';

export function useGuess() {
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<string | null>(null);
  const [targetNumber] = useState(Math.floor(Math.random() * 100) + 1);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num)) {
      setGuessResult('请输入有效数字');
      return;
    }
    if (num === targetNumber) {
      setGuessResult(`🎉 恭喜！猜对了！获得 ${games[2].reward} 魔力值`);
    } else if (num < targetNumber) {
      setGuessResult('太小了，再试试！');
    } else {
      setGuessResult('太大了，再试试！');
    }
  };

  return { guess, setGuess, guessResult, handleGuess };
}
