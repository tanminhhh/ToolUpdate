import { useEffect } from 'react';
import { useSequenceContext, type SequenceValue } from '@/context/SequenceContext';

export function useSequence() {
  const context = useSequenceContext();
  
  // Save to localStorage whenever sequence changes
  useEffect(() => {
    if (context.sequence.length > 0) {
      context.saveToLocalStorage();
    }
  }, [context.sequence, context.saveToLocalStorage]);

  const getTaiXiuRatio = () => {
    if (context.sequence.length === 0) return { taiCount: 0, xiuCount: 0, taiPercent: 0, xiuPercent: 0 };
    
    const taiCount = context.sequence.filter(val => val === 'T').length;
    const xiuCount = context.sequence.length - taiCount;
    const taiPercent = Math.round((taiCount / context.sequence.length) * 100);
    const xiuPercent = 100 - taiPercent;
    
    return { taiCount, xiuCount, taiPercent, xiuPercent };
  };

  const getLastNValues = (n: number): SequenceValue[] => {
    return context.sequence.slice(-Math.min(n, context.sequence.length));
  };

  return {
    ...context,
    getTaiXiuRatio,
    getLastNValues
  };
}
