import { useEffect } from 'react';
import { useSequence } from '@/hooks/useSequence';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ChartModal() {
  const { showChartModal, toggleChartModal, chartType, sequence } = useSequence();
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showChartModal) {
        toggleChartModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showChartModal, toggleChartModal]);
  
  // Close if click outside modal content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleChartModal();
    }
  };
  
  if (!showChartModal) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-dark rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-xl font-semibold">Biểu đồ chi tiết</h3>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={toggleChartModal}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          <div className="h-[500px] w-full">
            {sequence.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'sequence' && (
                  <LineChart
                    data={sequence.map((val, index) => ({
                      index: index + 1,
                      value: val === 'T' ? 1 : 0,
                      label: val
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="index" 
                      stroke="#94a3b8" 
                      label={{ value: 'Thứ tự', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      ticks={[0, 1]} 
                      tickFormatter={(value) => value === 0 ? 'X' : 'T'}
                      domain={[-0.1, 1.1]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                      formatter={(value, name, props) => [props.payload.label, 'Kết quả']}
                    />
                    <Legend />
                    <Line 
                      type="stepAfter" 
                      dataKey="value" 
                      stroke="#0ea5e9" 
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={4} 
                            fill={payload.label === 'T' ? '#00ffff' : '#ff77aa'} 
                            stroke={payload.label === 'T' ? '#00ffff33' : '#ff77aa33'} 
                          />
                        );
                      }}
                      name="Chuỗi kết quả"
                    />
                  </LineChart>
                )}
                
                {chartType === 'markov' && (
                  <BarChart
                    data={[
                      { name: 'T → T', value: countTransitions(sequence, 'T', 'T') },
                      { name: 'T → X', value: countTransitions(sequence, 'T', 'X') },
                      { name: 'X → T', value: countTransitions(sequence, 'X', 'T') },
                      { name: 'X → X', value: countTransitions(sequence, 'X', 'X') },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis 
                      stroke="#94a3b8"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                      formatter={(value) => [`${value}%`, 'Xác suất']}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Xác suất chuyển" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
                
                {/* Add other chart types as needed */}
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function countTransitions(sequence: ("T" | "X")[], from: "T" | "X", to: "T" | "X"): number {
  let count = 0;
  let total = 0;
  
  for (let i = 0; i < sequence.length - 1; i++) {
    if (sequence[i] === from) {
      total++;
      if (sequence[i + 1] === to) {
        count++;
      }
    }
  }
  
  return total === 0 ? 50 : Math.round((count / total) * 100);
}
