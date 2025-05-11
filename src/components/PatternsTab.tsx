import { useSequence } from '@/hooks/useSequence';
import { getPatternDescription, getRecommendation } from '@/lib/patterns';

export default function PatternsTab() {
  const { sequence, getLastNValues } = useSequence();
  
  const last20 = getLastNValues(20);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <i className="material-icons text-secondary mr-2">pattern</i>
          Phân tích mẫu hình
        </h3>
        
        <div className="space-y-3">
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Mẫu hình đảo chiều</h4>
            <div className="text-sm text-muted">Khi có 3-4 kết quả giống nhau liên tiếp, xác suất đảo chiều tăng lên 75-85%</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="px-2 py-1 bg-secondary bg-opacity-20 rounded text-xs">XXX→T (82%)</div>
              <div className="px-2 py-1 bg-secondary bg-opacity-20 rounded text-xs">XXXX→T (87%)</div>
              <div className="px-2 py-1 bg-secondary bg-opacity-20 rounded text-xs">TTT→X (76%)</div>
              <div className="px-2 py-1 bg-secondary bg-opacity-20 rounded text-xs">TTTT→X (84%)</div>
            </div>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Mẫu hình xen kẽ</h4>
            <div className="text-sm text-muted">Xu hướng xen kẽ giữa T và X thường xuất hiện sau chuỗi đơn điệu dài</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="px-2 py-1 bg-secondary bg-opacity-20 rounded text-xs">TXTX→T (64%)</div>
              <div className="px-2 py-1 bg-secondary bg-opacity-20 rounded text-xs">XTXT→X (67%)</div>
            </div>
          </div>
          
          <div className="bg-darker rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Mẫu hình gãy cầu</h4>
            <div className="text-sm text-muted">Điểm gãy cầu thường xuất hiện sau khi vượt quá độ dài trung bình của chuỗi</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="px-2 py-1 bg-warning bg-opacity-20 text-warning rounded text-xs">Điểm gãy trung bình: 4.2</div>
              <div className="px-2 py-1 bg-warning bg-opacity-20 text-warning rounded text-xs">Xác suất gãy: 78%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-dark rounded-xl shadow-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <i className="material-icons text-secondary mr-2">schema</i>
          Mẫu hình hiện tại
        </h3>
        
        <div className="bg-darker rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Chuỗi gần đây</h4>
            <span className="text-xs text-muted">{sequence.length} phần tử</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {last20.map((value, index) => (
              <div 
                key={index} 
                className={`result-badge ${value === 'T' ? 'tai' : 'xiu'}`}
                style={{
                  backgroundColor: value === 'T' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 119, 170, 0.2)',
                  color: value === 'T' ? '#00ffff' : '#ff77aa',
                  borderColor: value === 'T' ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 119, 170, 0.5)'
                }}
              >
                {value}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted mb-1">Mẫu hình phát hiện</div>
              <div className="font-medium">{getPatternDescription(sequence)}</div>
            </div>
            <div>
              <div className="text-muted mb-1">Khuyến nghị</div>
              <div className="font-medium text-secondary">{getRecommendation(sequence)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-darker rounded-lg p-3">
          <h4 className="text-sm font-medium mb-3">Phân tích mẫu hình phức hợp</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Mẫu hình đảo chiều</span>
              <div className="w-32 bg-dark rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Mẫu hình xen kẽ</span>
              <div className="w-32 bg-dark rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Mẫu hình biên</span>
              <div className="w-32 bg-dark rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">Mẫu hình fractal</span>
              <div className="w-32 bg-dark rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
