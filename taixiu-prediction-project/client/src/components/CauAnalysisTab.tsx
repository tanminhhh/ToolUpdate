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
  Legend
} from 'recharts';
import { performComprehensiveCauAnalysis } from '@/lib/cau_analyzer';

export default function CauAnalysisTab() {
  const { sequence, prediction } = useSequence();
  const [cauAnalysis, setCauAnalysis] = useState<any>(null);
  
  useEffect(() => {
    if (sequence.length < 5) return;
    
    // Thực hiện phân tích cầu mỗi khi sequence thay đổi
    const analysis = performComprehensiveCauAnalysis(sequence);
    setCauAnalysis(analysis);
  }, [sequence]);
  
  if (!cauAnalysis) {
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
  
  // Dữ liệu chi tiết cho phân tích
  const detailData = [
    { name: 'Chất lượng cầu', value: cauAnalysis.detailedAnalysis.streakQuality * 100 },
    { name: 'Tỉ lệ dao động', value: cauAnalysis.detailedAnalysis.oscillationRate * 100 },
    { name: 'Độ mạnh mẫu', value: cauAnalysis.detailedAnalysis.patternStrength * 100 },
    { name: 'Độ mạnh bẻ cầu', value: cauAnalysis.detailedAnalysis.breakStrength * 100 }
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
  
  return (
    <div className="p-4 animate-fadeIn">
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
    </div>
  );
}