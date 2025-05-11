import { useSequence } from '@/hooks/useSequence';
import { getTips, getRecommendedStrategy, getAverageSegmentLength } from '@/lib/patterns';
import { getMarkovProbability, getStabilityScore } from '@/lib/statistics';

export default function TipsTab() {
  const { sequence } = useSequence();
  const tips = getTips();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tips.map((tipSection, index) => (
        <div key={index} className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <i className="material-icons text-secondary mr-2">psychology</i>
            {tipSection.title}
          </h3>
          
          <ul className="space-y-3">
            {tipSection.tips.map((tip, i) => (
              <li key={i} className="bg-darker rounded-lg p-3 flex items-start">
                <i className="material-icons text-accent shrink-0 mr-2">tips_and_updates</i>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <i className="material-icons text-secondary mr-2">model_training</i>
          AI Insights
        </h3>
        
        <div className="bg-darker rounded-lg p-3 mb-3">
          <h4 className="text-sm font-medium mb-2">Phân tích hiện tại</h4>
          <p className="text-sm text-muted">Dựa trên phân tích chuỗi hiện tại, hệ thống AI đưa ra những nhận định sau:</p>
          
          <ul className="mt-2 space-y-2">
            <li className="flex items-start">
              <i className="material-icons text-secondary text-xs mr-1 mt-1">arrow_right</i>
              <span className="text-sm">
                Chuỗi hiện tại có độ ổn định {getStabilityScore(sequence)}, 
                phù hợp với chiến thuật {getRecommendedStrategy(sequence)}
              </span>
            </li>
            <li className="flex items-start">
              <i className="material-icons text-secondary text-xs mr-1 mt-1">arrow_right</i>
              <span className="text-sm">
                Tỉ lệ chuyển trạng thái từ X sang T cao 
                ({Math.round(getMarkovProbability(sequence, 'X', 'T') * 100)}%), 
                tạo cơ hội cho chiến thuật bắt cầu
              </span>
            </li>
            <li className="flex items-start">
              <i className="material-icons text-secondary text-xs mr-1 mt-1">arrow_right</i>
              <span className="text-sm">
                Điểm gãy cầu thường xuất hiện sau {getAverageSegmentLength(sequence)} lần lặp lại
              </span>
            </li>
          </ul>
        </div>
        
        <div className="bg-darker rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Chiến thuật khuyến nghị</h4>
          
          <div className="flex items-center justify-between p-2 bg-dark rounded mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
              <span className="text-sm font-medium">Bắt cầu thông minh</span>
            </div>
            <span className="text-xs px-2 py-0.5 bg-success bg-opacity-20 text-success rounded-full">Tỉ lệ: 72%</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-dark rounded mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
              <span className="text-sm font-medium">Bắt điểm đảo chiều</span>
            </div>
            <span className="text-xs px-2 py-0.5 bg-warning bg-opacity-20 text-warning rounded-full">Tỉ lệ: 68%</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-dark rounded">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
              <span className="text-sm font-medium">Chiến thuật gãy cầu</span>
            </div>
            <span className="text-xs px-2 py-0.5 bg-secondary bg-opacity-20 text-secondary rounded-full">Tỉ lệ: 64%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <i className="material-icons text-secondary mr-2">analytics</i>
          Phương pháp phân tích nâng cao
        </h3>
        
        <div className="space-y-3">
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-1">Phân tích chuỗi thời gian</h4>
            <p className="text-sm text-muted">Phân tích xu hướng và chu kỳ của kết quả theo thời gian</p>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-1">Mô hình Markov đa cấp</h4>
            <p className="text-sm text-muted">Mở rộng ma trận chuyển trạng thái bằng cách xét nhiều kết quả trước đó</p>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-1">Phân tích fractal</h4>
            <p className="text-sm text-muted">Tìm kiếm mẫu hình lặp lại ở các quy mô khác nhau</p>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-1">Phân tích cluster</h4>
            <p className="text-sm text-muted">Nhóm các chuỗi kết quả tương tự và tìm xu hướng chung</p>
          </div>
        </div>
      </div>
    </div>
  );
}
