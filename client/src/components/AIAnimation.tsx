import { useEffect, useState } from 'react';
import { useSequence } from '@/hooks/useSequence';

export default function AIAnimation() {
  const { analyzing } = useSequence();
  
  const [patternProgress, setPatternProgress] = useState(0);
  const [markovProgress, setMarkovProgress] = useState(0);
  const [mlProgress, setMlProgress] = useState(0);
  
  useEffect(() => {
    if (analyzing) {
      // Reset progress
      setPatternProgress(0);
      setMarkovProgress(0);
      setMlProgress(0);
      
      // Animate progress bars
      const interval = setInterval(() => {
        setPatternProgress(prev => {
          const next = prev + Math.random() * 5;
          return next >= 100 ? 100 : next;
        });
        
        setMarkovProgress(prev => {
          const next = prev + Math.random() * 4;
          return next >= 100 ? 100 : next;
        });
        
        setMlProgress(prev => {
          const next = prev + Math.random() * 3;
          return next >= 100 ? 100 : next;
        });
      }, 100);
      
      // Clean up interval
      return () => clearInterval(interval);
    }
  }, [analyzing]);
  
  if (!analyzing) return null;
  
  return (
    <div className="analysis-overlay fixed inset-0 bg-darker bg-opacity-80 backdrop-blur-[4px] z-40 flex items-center justify-center">
      <div className="bg-dark rounded-xl p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 border-t-4 border-secondary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="material-icons text-4xl text-secondary animate-pulse-slow">psychology</i>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">AI đang phân tích...</h2>
        <p className="text-muted">Hệ thống đang xử lý chuỗi và nhận dạng mẫu hình</p>
        
        <div className="mt-6 space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span>Nhận dạng mẫu</span>
            <span>{Math.round(patternProgress)}%</span>
          </div>
          <div className="w-full bg-darker rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full" 
              style={{ width: `${patternProgress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm mt-2">
            <span>Phân tích Markov</span>
            <span>{Math.round(markovProgress)}%</span>
          </div>
          <div className="w-full bg-darker rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full" 
              style={{ width: `${markovProgress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm mt-2">
            <span>Học máy</span>
            <span>{Math.round(mlProgress)}%</span>
          </div>
          <div className="w-full bg-darker rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full" 
              style={{ width: `${mlProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
