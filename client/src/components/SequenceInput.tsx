import { useEffect, useRef } from 'react';
import { useSequence } from '@/hooks/useSequence';
import { Button } from '@/components/ui/button';

export default function SequenceInput() {
  const { 
    sequence, 
    addToSequence, 
    deleteLastResult, 
    clearAllResults, 
    analyzeSequence,
    analyzing,
    getTaiXiuRatio
  } = useSequence();
  
  const sequenceDisplayRef = useRef<HTMLDivElement>(null);
  const { taiPercent, xiuPercent } = getTaiXiuRatio();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        addToSequence('T');
      } else if (e.key === 'x' || e.key === 'X') {
        addToSequence('X');
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        deleteLastResult();
      } else if (e.key === 'Enter') {
        analyzeSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToSequence, deleteLastResult, analyzeSequence]);

  // Auto scroll to end of sequence
  useEffect(() => {
    if (sequenceDisplayRef.current) {
      sequenceDisplayRef.current.scrollLeft = sequenceDisplayRef.current.scrollWidth;
    }
  }, [sequence]);

  return (
    <section className="bg-dark rounded-xl shadow-lg p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="flex-1 w-full">
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <i className="material-icons text-secondary mr-2">input</i>
            Nhập chuỗi kết quả
          </h2>
          
          <div className="flex gap-2">
            <Button
              onClick={() => addToSequence('T')}
              className="flex-1 bg-dark hover:bg-opacity-80 border border-[#00ffff] text-[#00ffff] py-3 rounded-lg font-semibold transition-all hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:ring-opacity-50"
            >
              TÀI (T)
            </Button>
            
            <Button
              onClick={() => addToSequence('X')}
              className="flex-1 bg-dark hover:bg-opacity-80 border border-[#ff77aa] text-[#ff77aa] py-3 rounded-lg font-semibold transition-all hover:shadow-[0_0_10px_rgba(255,119,170,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ff77aa] focus:ring-opacity-50"
            >
              XỈU (X)
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={deleteLastResult}
            className="flex items-center justify-center gap-1 px-4 py-3 bg-dark border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
            disabled={sequence.length === 0}
          >
            <i className="material-icons">backspace</i>
            <span className="hidden sm:inline">Xóa</span>
          </Button>
          
          <Button
            onClick={clearAllResults}
            className="flex items-center justify-center gap-1 px-4 py-3 bg-dark border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
            disabled={sequence.length === 0}
          >
            <i className="material-icons">delete_sweep</i>
            <span className="hidden sm:inline">Xóa hết</span>
          </Button>
          
          <Button
            onClick={analyzeSequence}
            className="flex items-center justify-center gap-1 px-4 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            disabled={analyzing || sequence.length < 3}
          >
            <i className="material-icons">auto_awesome</i>
            <span>{analyzing ? 'ĐANG PHÂN TÍCH' : 'PHÂN TÍCH'}</span>
          </Button>
        </div>
      </div>
      
      {/* Sequence Display */}
      <div className="relative">
        <div 
          ref={sequenceDisplayRef}
          className="sequence-container bg-darker border border-gray-800 rounded-lg p-3 h-16 overflow-x-auto overflow-y-hidden whitespace-nowrap flex items-center"
        >
          {sequence.length === 0 ? (
            <span className="text-muted text-sm italic">Nhấn TÀI hoặc XỈU để bắt đầu nhập dữ liệu...</span>
          ) : (
            sequence.map((value, index) => (
              <div 
                key={index} 
                className={`result-badge ${value === 'T' ? 'tai' : 'xiu'} mx-[2px] inline-flex items-center justify-center w-7 h-7 rounded border font-mono font-semibold transition-all`}
                style={{
                  backgroundColor: value === 'T' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 119, 170, 0.2)',
                  color: value === 'T' ? '#00ffff' : '#ff77aa',
                  borderColor: value === 'T' ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 119, 170, 0.5)'
                }}
              >
                {value}
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-between text-xs text-muted mt-2">
          <span>Số phần tử: {sequence.length}</span>
          <span>
            Tỉ lệ: - 
            <span className="text-[#00ffff]"> T: {taiPercent}%</span> 
            <span className="text-[#ff77aa]"> X: {xiuPercent}%</span>
          </span>
        </div>
      </div>
    </section>
  );
}
