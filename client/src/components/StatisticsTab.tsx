import { useSequence } from '@/hooks/useSequence';
import { 
  calculateStreaks, 
  calculateAlternationRate, 
  getMarkovProbability, 
  getAlternationDescription,
  getTrendDescription,
  getTrendStrength,
  getStabilityScore
} from '@/lib/statistics';

export default function StatisticsTab() {
  const { sequence, getTaiXiuRatio } = useSequence();
  
  const { taiPercent, xiuPercent } = getTaiXiuRatio();
  const streaks = calculateStreaks(sequence);
  const alternationRate = calculateAlternationRate(sequence);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <i className="material-icons text-secondary mr-2">pie_chart</i>
          Thống kê cơ bản
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-darker rounded-lg p-3">
            <div className="text-sm text-muted mb-1">Tổng số kết quả</div>
            <div className="text-2xl font-semibold">{sequence.length}</div>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <div className="text-sm text-muted mb-1">Tỉ lệ T:X</div>
            <div className="text-2xl font-semibold">{taiPercent}:{xiuPercent}</div>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <div className="text-sm text-muted mb-1">Chuỗi dài nhất (T)</div>
            <div className="text-2xl font-semibold text-[#00ffff]">{streaks.tai}</div>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <div className="text-sm text-muted mb-1">Chuỗi dài nhất (X)</div>
            <div className="text-2xl font-semibold text-[#ff77aa]">{streaks.xiu}</div>
          </div>
        </div>
        
        <div className="mt-4 bg-darker rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Phân phối kết quả</h4>
          <div className="relative pt-1">
            <div className="flex h-6 overflow-hidden rounded text-xs">
              <div 
                className="bg-[#00ffff] bg-opacity-30 text-center text-white flex items-center justify-center" 
                style={{ width: `${taiPercent}%` }}
              >
                TÀI {taiPercent}%
              </div>
              <div 
                className="bg-[#ff77aa] bg-opacity-30 text-center text-white flex items-center justify-center" 
                style={{ width: `${xiuPercent}%` }}
              >
                XỈU {xiuPercent}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-darker rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Tỉ lệ xen kẽ</h4>
          <div className="flex items-center">
            <div className="text-2xl font-semibold">{Math.round(alternationRate)}%</div>
            <div className="ml-3 text-xs text-muted">{getAlternationDescription(alternationRate)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <i className="material-icons text-secondary mr-2">functions</i>
          Thống kê nâng cao
        </h3>
        
        <div className="bg-darker rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium mb-3">Ma trận chuyển trạng thái Markov</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-dark p-2 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">T → T</div>
              <div className="text-lg font-mono">{Math.round(getMarkovProbability(sequence, 'T', 'T') * 100)}%</div>
            </div>
            
            <div className="bg-dark p-2 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">T → X</div>
              <div className="text-lg font-mono">{Math.round(getMarkovProbability(sequence, 'T', 'X') * 100)}%</div>
            </div>
            
            <div className="bg-dark p-2 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">X → T</div>
              <div className="text-lg font-mono">{Math.round(getMarkovProbability(sequence, 'X', 'T') * 100)}%</div>
            </div>
            
            <div className="bg-dark p-2 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">X → X</div>
              <div className="text-lg font-mono">{Math.round(getMarkovProbability(sequence, 'X', 'X') * 100)}%</div>
            </div>
          </div>
        </div>
        
        <div className="bg-darker rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium mb-2">Phân tích xu hướng</h4>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-muted">Xu hướng hiện tại</div>
              <div className="text-sm font-medium">{getTrendDescription(sequence)}</div>
            </div>
            <div className="px-3 py-1 bg-secondary bg-opacity-20 text-secondary rounded-full text-xs">
              {getTrendStrength(sequence)}
            </div>
          </div>
          
          <div className="h-16 bg-dark rounded-lg">
            {/* Trend visualization placeholder */}
          </div>
        </div>
        
        <div className="bg-darker rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Thống kê gãy cầu</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted mb-1">Tần suất gãy cầu</div>
              <div className="font-medium">4.3 lượt</div>
            </div>
            
            <div>
              <div className="text-xs text-muted mb-1">Độ ổn định cầu</div>
              <div className="font-medium">{getStabilityScore(sequence)}</div>
            </div>
            
            <div>
              <div className="text-xs text-muted mb-1">Điểm gãy phổ biến</div>
              <div className="font-medium">Sau 3-4 lần đồng nhất</div>
            </div>
            
            <div>
              <div className="text-xs text-muted mb-1">Tỉ lệ gãy thành công</div>
              <div className="font-medium">67.8%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
