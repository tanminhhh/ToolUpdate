import { useState } from 'react';
import { useSequence } from '@/hooks/useSequence';
import { Button } from '@/components/ui/button';
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

export default function AnalysisCharts() {
  const { sequence, chartType, setChartType, toggleChartModal } = useSequence();
  
  // Chart types
  const chartTypes = [
    { id: 'sequence', label: 'Chuỗi' },
    { id: 'markov', label: 'Markov' },
    { id: 'pattern', label: 'Mẫu hình' },
    { id: 'distribution', label: 'Phân phối' },
    { id: 'heatmap', label: 'Heatmap' }
  ];

  // Decide if we should render charts or empty state
  const hasData = sequence.length > 0;

  return (
    <section className="bg-dark rounded-xl shadow-lg p-4 mb-4">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <i className="material-icons text-secondary mr-2">bar_chart</i>
        Biểu đồ phân tích
      </h2>
      
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chartTypes.map(type => (
          <Button
            key={type.id}
            onClick={() => setChartType(type.id as any)}
            className={`px-3 py-1.5 rounded-lg text-sm focus:outline-none ${
              chartType === type.id 
                ? 'bg-secondary bg-opacity-20 text-secondary border border-secondary border-opacity-30' 
                : 'bg-dark border border-gray-700 hover:bg-gray-800'
            }`}
          >
            {type.label}
          </Button>
        ))}
      </div>
      
      {/* Chart Container */}
      <div 
        className="relative bg-darker border border-gray-800 rounded-lg p-4 h-80 flex items-center justify-center" 
        onClick={hasData ? toggleChartModal : undefined}
        style={{ cursor: hasData ? 'pointer' : 'default' }}
      >
        {hasData ? (
          <RenderChart chartType={chartType} sequence={sequence} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
            <i className="material-icons text-4xl mb-2">bar_chart</i>
            <p>Chưa có dữ liệu để hiển thị biểu đồ</p>
            <p className="text-sm mt-1">Nhập chuỗi kết quả và nhấn PHÂN TÍCH</p>
          </div>
        )}
      </div>
    </section>
  );
}

function RenderChart({ chartType, sequence }: { chartType: string, sequence: ("T" | "X")[] }) {
  // Generate data based on chart type
  switch (chartType) {
    case 'sequence':
      return <SequenceChart sequence={sequence} />;
    case 'markov':
      return <MarkovChart sequence={sequence} />;
    case 'pattern':
      return <PatternChart sequence={sequence} />;
    case 'distribution':
      return <DistributionChart sequence={sequence} />;
    case 'heatmap':
      return <HeatmapChart sequence={sequence} />;
    default:
      return <SequenceChart sequence={sequence} />;
  }
}

function SequenceChart({ sequence }: { sequence: ("T" | "X")[] }) {
  // Convert sequence to numerical data for charting
  const data = sequence.map((val, index) => ({
    index: index + 1,
    value: val === 'T' ? 1 : 0,
    label: val
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
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
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MarkovChart({ sequence }: { sequence: ("T" | "X")[] }) {
  // Generate Markov transition probabilities
  const getTT = countTransitions(sequence, 'T', 'T');
  const getTX = countTransitions(sequence, 'T', 'X');
  const getXT = countTransitions(sequence, 'X', 'T');
  const getXX = countTransitions(sequence, 'X', 'X');
  
  const data = [
    { name: 'T → T', value: getTT },
    { name: 'T → X', value: getTX },
    { name: 'X → T', value: getXT },
    { name: 'X → X', value: getXX },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
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
        <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
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

function PatternChart({ sequence }: { sequence: ("T" | "X")[] }) {
  // Analyze pattern lengths
  const streakLengths = getStreakLengths(sequence);
  
  const data = Array.from({ length: 10 }, (_, i) => i + 1)
    .map(length => ({
      length,
      T: streakLengths.T[length] || 0,
      X: streakLengths.X[length] || 0
    }))
    .filter(d => d.T > 0 || d.X > 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="length" 
          stroke="#94a3b8"
          label={{ value: 'Độ dài chuỗi', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
        />
        <YAxis stroke="#94a3b8" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
          formatter={(value, name) => [value, name === 'T' ? 'Chuỗi TÀI' : 'Chuỗi XỈU']}
        />
        <Legend />
        <Bar dataKey="T" name="Tài" fill="#00ffff" radius={[4, 4, 0, 0]} />
        <Bar dataKey="X" name="Xỉu" fill="#ff77aa" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function getStreakLengths(sequence: ("T" | "X")[]) {
  const result = { T: {} as Record<number, number>, X: {} as Record<number, number> };
  
  let currentType = null;
  let currentLength = 0;
  
  for (let i = 0; i < sequence.length; i++) {
    if (currentType === null || sequence[i] === currentType) {
      currentType = sequence[i];
      currentLength++;
    } else {
      // Save the completed streak
      result[currentType][currentLength] = (result[currentType][currentLength] || 0) + 1;
      
      // Start new streak
      currentType = sequence[i];
      currentLength = 1;
    }
    
    // Handle the end of sequence
    if (i === sequence.length - 1) {
      result[currentType][currentLength] = (result[currentType][currentLength] || 0) + 1;
    }
  }
  
  return result;
}

function DistributionChart({ sequence }: { sequence: ("T" | "X")[] }) {
  // Calculate distribution of T and X over the sequence
  const windowSize = Math.min(10, Math.ceil(sequence.length / 10));
  
  const data = [];
  for (let i = 0; i < sequence.length; i += windowSize) {
    const window = sequence.slice(i, i + windowSize);
    const taiCount = window.filter(v => v === 'T').length;
    const xiuCount = window.length - taiCount;
    
    data.push({
      segment: Math.floor(i / windowSize) + 1,
      T: (taiCount / window.length) * 100,
      X: (xiuCount / window.length) * 100
    });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="segment" 
          stroke="#94a3b8"
          label={{ value: 'Phân đoạn', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
        />
        <YAxis 
          stroke="#94a3b8"
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
          formatter={(value) => [`${Math.round(value as number)}%`, '']}
        />
        <Legend />
        <Line type="monotone" dataKey="T" name="Tài" stroke="#00ffff" activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="X" name="Xỉu" stroke="#ff77aa" activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function HeatmapChart({ sequence }: { sequence: ("T" | "X")[] }) {
  // For a heatmap, we'd typically need actual 2D data
  // Here we'll simulate it with pattern occurrences
  
  // Create data for a mock heatmap visualization
  // In a real app, this would be based on actual pattern analysis
  
  // Analyze 2-tuple patterns (TT, TX, XT, XX)
  const patterns = {
    'TT': { count: 0, x: 0, y: 0 },
    'TX': { count: 0, x: 0, y: 1 },
    'XT': { count: 0, x: 1, y: 0 },
    'XX': { count: 0, x: 1, y: 1 }
  };
  
  for (let i = 0; i < sequence.length - 1; i++) {
    const pattern = `${sequence[i]}${sequence[i+1]}`;
    if (pattern in patterns) {
      patterns[pattern].count++;
    }
  }
  
  const total = Object.values(patterns).reduce((sum, p) => sum + p.count, 0) || 1;
  const data = Object.entries(patterns).map(([key, value]) => ({
    name: key,
    x: value.x,
    y: value.y,
    value: Math.round((value.count / total) * 100)
  }));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-center mb-4 text-muted">Heatmap Phân Bố Mẫu 2-tuple</h3>
      <div className="grid grid-cols-2 gap-2 w-48">
        {data.map(item => (
          <div 
            key={item.name}
            className="relative flex items-center justify-center p-2 rounded"
            style={{
              backgroundColor: `rgba(14, 165, 233, ${item.value / 100})`,
              border: '1px solid rgba(71, 85, 105, 0.5)'
            }}
          >
            <div className="text-center">
              <div className="text-sm font-mono">{item.name}</div>
              <div className="text-xs text-gray-300">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted mt-4">Tỉ lệ xuất hiện của các mẫu 2 phần tử liên tiếp</p>
    </div>
  );
}
