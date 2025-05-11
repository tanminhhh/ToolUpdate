import React, { useState, useEffect } from 'react';
import { useSequence } from '@/hooks/useSequence';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { performComprehensiveCauAnalysis } from '@/lib/cau_analyzer';
import { generateUltraPrecisionPrediction } from '@/lib/advanced_predictor';

export default function CauAnalysisTab() {
  const { sequence, prediction } = useSequence();
  const [cauAnalysis, setCauAnalysis] = useState<any>(null);
  const [advancedAnalysis, setAdvancedAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('advanced');
  
  useEffect(() => {
    if (sequence.length < 5) return;
    
    // Thực hiện phân tích cầu cơ bản mỗi khi sequence thay đổi
    const basicAnalysis = performComprehensiveCauAnalysis(sequence);
    setCauAnalysis(basicAnalysis);
    
    // Thực hiện phân tích siêu nâng cao với thuật toán mới
    const ultraAnalysis = generateUltraPrecisionPrediction(sequence);
    setAdvancedAnalysis(ultraAnalysis);
    
    console.log("Phân tích siêu nâng cao:", ultraAnalysis);
  }, [sequence]);
  
  if (!cauAnalysis || !advancedAnalysis) {
    return (
      <div className="p-6 flex flex-col justify-center items-center h-full">
        <div className="text-center text-muted">
          <p className="text-lg mb-2">Cần ít nhất 5 kết quả để phân tích cầu</p>
          <p>Thêm kết quả T hoặc X để bắt đầu phân tích</p>
        </div>
      </div>
    );
  }
  
  // Tạo dữ liệu cho biểu đồ phân tích cầu
  const breakpointData = [
    { name: 'Bẻ cầu', value: cauAnalysis.breakProbability * 100 },
    { name: 'Theo cầu', value: (1 - cauAnalysis.breakProbability) * 100 }
  ];
  
  // Dữ liệu chi tiết cho phân tích cơ bản
  const detailData = [
    { name: 'Chất lượng cầu', value: cauAnalysis.detailedAnalysis.streakQuality * 100 },
    { name: 'Tỉ lệ dao động', value: cauAnalysis.detailedAnalysis.oscillationRate * 100 },
    { name: 'Độ mạnh mẫu', value: cauAnalysis.detailedAnalysis.patternStrength * 100 },
    { name: 'Độ mạnh bẻ cầu', value: cauAnalysis.detailedAnalysis.breakStrength * 100 }
  ];
  
  // Dữ liệu chi tiết cho phân tích siêu nâng cao
  const advancedDetailData = [
    { name: 'Độ phức tạp', value: advancedAnalysis.analysisDetails.complexityScore * 100 },
    { name: 'Entropy', value: advancedAnalysis.analysisDetails.entropyLevel * 100 },
    { name: 'Chỉ số chu kỳ', value: advancedAnalysis.analysisDetails.cyclicityIndex * 100 },
    { name: 'Tỉ lệ Fibonacci', value: advancedAnalysis.analysisDetails.fibonacciAlignmentScore * 100 },
    { name: 'Tỉ lệ giữ mẫu', value: advancedAnalysis.analysisDetails.patternRetentionRate * 100 }
  ];
  
  // Dữ liệu cho biểu đồ radar
  const radarData = [
    {
      subject: 'Độ phức tạp',
      A: advancedAnalysis.analysisDetails.complexityScore * 100,
    },
    {
      subject: 'Mức Entropy',
      A: advancedAnalysis.analysisDetails.entropyLevel * 100,
    },
    {
      subject: 'Chỉ số chu kỳ',
      A: advancedAnalysis.analysisDetails.cyclicityIndex * 100,
    },
    {
      subject: 'Điểm Fibonacci',
      A: advancedAnalysis.analysisDetails.fibonacciAlignmentScore * 100,
    },
    {
      subject: 'Tỉ lệ giữ mẫu',
      A: advancedAnalysis.analysisDetails.patternRetentionRate * 100,
    },
    {
      subject: 'Độ tin cậy',
      A: advancedAnalysis.confidence * 100,
    }
  ];
  
  // Màu dựa trên loại cầu
  const getCauColor = () => {
    if (cauAnalysis.patternType.includes('xen kẽ')) return 'text-purple-500';
    if (cauAnalysis.patternType.includes('dài T')) return 'text-secondary';
    if (cauAnalysis.patternType.includes('dài X')) return 'text-accent';
    if (cauAnalysis.patternType.includes('gãy')) return 'text-orange-500';
    if (cauAnalysis.patternType.includes('Fibonacci')) return 'text-amber-400';
    return 'text-primary';
  };
  
  // Xác định màu gradient cho độ tin cậy
  const getConfidenceGradient = (confidence: number) => {
    if (confidence >= 0.95) return 'from-emerald-500 to-emerald-700';
    if (confidence >= 0.85) return 'from-green-500 to-green-700';
    if (confidence >= 0.75) return 'from-lime-500 to-lime-700';
    if (confidence >= 0.65) return 'from-amber-500 to-amber-700';
    return 'from-orange-500 to-orange-700';
  };
  
  // Màu và emojis cho các mức độ tin cậy
  const getConfidenceLevel = (confidenceLevel: string) => {
    const levels: Record<string, {color: string, emoji: string}> = {
      'ultra-high': {color: 'text-emerald-500', emoji: '🔮'},
      'very-high': {color: 'text-green-500', emoji: '🎯'},
      'high': {color: 'text-lime-500', emoji: '✅'},
      'medium': {color: 'text-amber-500', emoji: '📊'},
      'low': {color: 'text-orange-500', emoji: '❓'}
    };
    return levels[confidenceLevel] || levels.medium;
  };
  
  // Phân loại các mẫu phát hiện được
  const patternCategories = {
    structured: advancedAnalysis.analysisDetails.patterns.filter(
      (p: string) => p === 'structured' || p.includes('cycle:') || p.includes('adaptive')
    ),
    fibonacci: advancedAnalysis.analysisDetails.patterns.filter(
      (p: string) => p.includes('fib')
    ),
    other: advancedAnalysis.analysisDetails.patterns.filter(
      (p: string) => p !== 'structured' && !p.includes('cycle:') && !p.includes('fib') && !p.includes('adaptive')
    )
  };
  
  // Đánh giá dự đoán
  const predictionAssessment = () => {
    const details = advancedAnalysis.analysisDetails;
    if (details.predictionStrength > 0.8) {
      return {
        emoji: '✨',
        color: 'text-success',
        text: 'Dự đoán siêu chuẩn xác với độ tin cậy cực cao'
      };
    } else if (details.predictionStrength > 0.7) {
      return {
        emoji: '🎯',
        color: 'text-green-500',
        text: 'Dự đoán độ tin cậy rất cao'
      };
    } else if (details.predictionStrength > 0.6) {
      return {
        emoji: '✅',
        color: 'text-green-600',
        text: 'Dự đoán đáng tin cậy'
      };
    } else if (details.predictionStrength > 0.5) {
      return {
        emoji: '📊',
        color: 'text-amber-500',
        text: 'Dự đoán khá chính xác'
      };
    } else {
      return {
        emoji: '❓',
        color: 'text-orange-500',
        text: 'Dự đoán có độ tin cậy trung bình'
      };
    }
  };
  
  // Hiển thị tab chọn giữa 2 phiên bản phân tích
  const renderTabButtons = () => (
    <div className="flex items-center mb-4 border-b border-muted/20">
      <button
        className={`py-2 px-4 flex items-center ${activeTab === 'basic' ? 'border-b-2 border-primary font-semibold' : 'text-muted'}`}
        onClick={() => setActiveTab('basic')}
      >
        <span className="mr-1">🔍</span> Phân tích cơ bản
      </button>
      <button
        className={`py-2 px-4 flex items-center ${activeTab === 'advanced' ? 'border-b-2 border-primary font-semibold' : 'text-muted'}`}
        onClick={() => setActiveTab('advanced')}
      >
        <span className="mr-1">🔮</span> Phân tích siêu nâng cao
      </button>
    </div>
  );
  
  return (
    <div className="p-4 animate-fadeIn">
      {renderTabButtons()}
      
      {activeTab === 'basic' ? (
        // Phiên bản phân tích cơ bản (giao diện cũ)
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-primary mr-2">
                <i className="material-icons text-xl">analytics</i>
              </span>
              Phân tích cầu nâng cao
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Loại cầu:</span>
                <span className={`font-semibold ${getCauColor()}`}>
                  {cauAnalysis.patternType}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Độ dài cầu hiện tại:</span>
                <span className="font-semibold">{cauAnalysis.streakLength}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Dự đoán:</span>
                <span className="font-semibold text-success">
                  {cauAnalysis.prediction === 'T' ? 'Tài' : 'Xỉu'} 
                  <span className="ml-2">({(cauAnalysis.confidence * 100).toFixed(1)}%)</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Điểm bẻ cầu tối ưu:</span>
                <span className={`font-semibold ${cauAnalysis.detailedAnalysis.optimalBreakPoint ? 'text-success' : 'text-muted'}`}>
                  {cauAnalysis.detailedAnalysis.optimalBreakPoint ? 'Có' : 'Không'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Xác suất bẻ/theo cầu:</h4>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  layout="vertical"
                  data={breakpointData}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => {
                  if (typeof value === 'number') return [`${value.toFixed(1)}%`, 'Xác suất'];
                  return [value, 'Xác suất'];
                }} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-muted/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-primary mr-2">
                <i className="material-icons text-xl">insights</i>
              </span>
              Phân tích chi tiết
            </h3>
            
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={detailData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => {
                  if (typeof value === 'number') return [`${value.toFixed(1)}%`, 'Giá trị'];
                  return [value, 'Giá trị'];
                }} />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Đánh giá & Đề xuất:</h4>
              <div className="bg-darker text-sm rounded-lg p-3">
                {cauAnalysis.breakProbability > 0.7 ? (
                  <p>
                    <span className="text-warning font-medium">Khuyến nghị bẻ cầu:</span> Cầu hiện tại 
                    {cauAnalysis.detailedAnalysis.optimalBreakPoint ? ' đã đạt đến điểm bẻ cầu tối ưu' : ' đang có xu hướng đảo chiều'}. 
                    Xác suất đổi chiều là {(cauAnalysis.breakProbability * 100).toFixed(1)}%.
                  </p>
                ) : cauAnalysis.breakProbability > 0.5 ? (
                  <p>
                    <span className="text-amber-400 font-medium">Thận trọng:</span> Cầu hiện tại đang ở trạng thái lưỡng lự.
                    Có thể tiếp tục theo cầu nhưng cần cẩn trọng theo dõi.
                  </p>
                ) : (
                  <p>
                    <span className="text-success font-medium">Khuyến nghị theo cầu:</span> Cầu {cauAnalysis.patternType.toLowerCase()} 
                    hiện tại vẫn đang có xu hướng ổn định với độ tin cậy 
                    {(cauAnalysis.detailedAnalysis.streakQuality * 100).toFixed(1)}%.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Phiên bản phân tích siêu nâng cao
        <div className="animate-fadeIn">
          {/* Phần trên - Banner dự đoán */}
          <div className="mb-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1 flex items-center">
                  <span className="mr-2">🔮</span>
                  Dự đoán siêu nâng cao AI v2.0
                </h2>
                <p className="text-sm text-muted mb-2">
                  Kết hợp 5 mô hình toán học + trí tuệ nhân tạo + các hằng số Fibonacci, Pi, Phi, Euler
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Độ tin cậy:</span>
                  <span className={`${getConfidenceLevel(advancedAnalysis.confidenceLevel).color} font-medium flex items-center`}>
                    {getConfidenceLevel(advancedAnalysis.confidenceLevel).emoji} {advancedAnalysis.confidenceLevel.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Thời gian tính toán:</span>
                  <span className="font-medium">{advancedAnalysis.executionTimeMs.toFixed(2)}ms</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-gradient-to-r from-black/50 to-black/30 rounded-lg p-5 text-center">
              <div className="mb-2">Kết quả dự đoán kỳ tiếp theo:</div>
              <div className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2 flex justify-center items-center"
                   style={{
                     backgroundImage: `linear-gradient(to right, 
                       ${advancedAnalysis.prediction === 'T' ? '#10b981, #059669' : '#f59e0b, #d97706'})`
                   }}>
                {advancedAnalysis.prediction === 'T' ? 'TÀI' : 'XỈU'}
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-4 mt-2">
                <div 
                  className={`h-4 rounded-full bg-gradient-to-r ${getConfidenceGradient(advancedAnalysis.confidence)}`}
                  style={{ width: `${advancedAnalysis.confidence * 100}%` }}
                ></div>
              </div>
              <div className="mt-1 text-sm flex justify-between">
                <span>0%</span>
                <span className={`${advancedAnalysis.confidence >= 0.8 ? 'text-success' : advancedAnalysis.confidence >= 0.6 ? 'text-amber-500' : 'text-orange-500'}`}>
                  {(advancedAnalysis.confidence * 100).toFixed(1)}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Biểu đồ Radar */}
            <div className="bg-muted/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-primary mr-2">
                  <i className="material-icons text-xl">radar</i>
                </span>
                Phân tích đa chiều
              </h3>
              
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#555" />
                    <PolarAngleAxis dataKey="subject" stroke="#888" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Phân tích" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip formatter={(value) => {
                      // Handle type conversion safely
                      const numValue = Number(value);
                      const formatted = !isNaN(numValue) ? `${numValue.toFixed(1)}%` : `${value}%`;
                      return [formatted, 'Giá trị'];
                    }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2">Mẫu nhận diện được:</h4>
                <div className="flex flex-wrap gap-2">
                  {patternCategories.structured.map((pattern: string, i: number) => (
                    <span key={`struct-${i}`} className="px-2 py-1 bg-blue-900/40 text-blue-200 rounded text-xs">
                      {pattern}
                    </span>
                  ))}
                  {patternCategories.fibonacci.map((pattern: string, i: number) => (
                    <span key={`fib-${i}`} className="px-2 py-1 bg-amber-900/40 text-amber-200 rounded text-xs">
                      {pattern}
                    </span>
                  ))}
                  {patternCategories.other.map((pattern: string, i: number) => (
                    <span key={`other-${i}`} className="px-2 py-1 bg-purple-900/40 text-purple-200 rounded text-xs">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Phần đánh giá */}
            <div className="bg-muted/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-primary mr-2">
                  <i className="material-icons text-xl">psychology</i>
                </span>
                Phân tích đa mô hình
              </h3>
              
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-xs text-muted mb-1">Mô hình Markov:</div>
                    <div className="font-semibold">
                      {advancedAnalysis.secondaryPredictions.markovModel === 'T' ? 'Tài' : 'Xỉu'}
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-xs text-muted mb-1">Mô hình Neural:</div>
                    <div className="font-semibold">
                      {advancedAnalysis.secondaryPredictions.neuralModelEmulation === 'T' ? 'Tài' : 'Xỉu'}
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-xs text-muted mb-1">Tỉ lệ vàng:</div>
                    <div className="font-semibold">
                      {advancedAnalysis.secondaryPredictions.goldenRatioModel === 'T' ? 'Tài' : 'Xỉu'}
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-xs text-muted mb-1">Mô hình lượng tử:</div>
                    <div className="font-semibold">
                      {advancedAnalysis.secondaryPredictions.quantumModel === 'T' ? 'Tài' : 'Xỉu'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 mb-4">
                <h4 className="text-sm font-medium mb-2">Đánh giá bẻ cầu:</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-700/50 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 to-red-500"
                      style={{ width: `${advancedAnalysis.analysisDetails.breakProbability * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{(advancedAnalysis.analysisDetails.breakProbability * 100).toFixed(1)}%</span>
                </div>
                <div className="text-xs text-muted mt-1">Xác suất cầu sẽ bị phá vỡ</div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Nhận xét & Đề xuất:</h4>
                <div className="bg-darker text-sm rounded-lg p-3">
                  <p className={`${predictionAssessment().color} font-medium mb-1`}>
                    {predictionAssessment().emoji} {predictionAssessment().text}
                  </p>
                  <p className="text-xs text-muted">
                    {advancedAnalysis.analysisDetails.adaptiveResponse 
                      ? "Mẫu có cấu trúc rõ ràng và phân tích có độ tin cậy cao." 
                      : "Mẫu có độ phức tạp cao, phân tích dựa trên đa mô hình trí tuệ nhân tạo."}
                    {advancedAnalysis.analysisDetails.fibonacciAlignmentScore > 0.7
                      ? " Mẫu có dấu hiệu rõ ràng của chuỗi Fibonacci." 
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Biểu đồ bar cho các chỉ số chi tiết */}
          <div className="mt-6 bg-muted/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-primary mr-2">
                <i className="material-icons text-xl">assessment</i>
              </span>
              Các chỉ số toán học
            </h3>
            
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={advancedDetailData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => {
                  if (typeof value === 'number') return [`${value.toFixed(1)}%`, 'Giá trị'];
                  return [value, 'Giá trị'];
                }} />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}