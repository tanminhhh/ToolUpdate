import { useState, useEffect } from 'react';
import { useSequence } from '@/hooks/useSequence';
import PredictionTab from './PredictionTab';
import PatternsTab from './PatternsTab';
import StatisticsTab from './StatisticsTab';
import TipsTab from './TipsTab';
import CauAnalysisTab from './CauAnalysisTab';
import type { TabType } from '@/context/SequenceContext';

export default function ResultAnalysis() {
  const { sequence, activeTab, setActiveTab, analyzing, prediction } = useSequence();
  const [emptyState, setEmptyState] = useState(true);

  useEffect(() => {
    if (sequence.length > 0 && !analyzing && prediction) {
      setEmptyState(false);
    } else if (sequence.length === 0 || !prediction) {
      setEmptyState(true);
    }
  }, [sequence.length, analyzing, prediction]);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'prediction', label: 'Dự đoán', icon: 'lightbulb' },
    { id: 'cauanalysis', label: 'Phân tích cầu', icon: 'auto_graph' },
    { id: 'patterns', label: 'Mẫu hình', icon: 'insights' },
    { id: 'statistics', label: 'Thống kê', icon: 'assessment' },
    { id: 'tips', label: 'Mẹo chơi', icon: 'psychology' }
  ];

  return (
    <section>
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-800 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-4 py-2 border-b-2 ${
              activeTab === tab.id 
                ? 'text-secondary border-secondary' 
                : 'text-muted hover:text-light border-transparent'
            }`}
          >
            <i className="material-icons text-sm">{tab.icon}</i>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Results Area */}
      <div 
        className={`min-h-[300px] transition-opacity duration-500 ${analyzing ? 'opacity-0' : 'opacity-100'}`}
      >
        {emptyState ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted">
            <i className="material-icons text-5xl mb-4">query_stats</i>
            <p className="text-lg">Nhập chuỗi kết quả và nhấn PHÂN TÍCH</p>
            <p className="text-sm mt-2">AI sẽ phân tích và đưa ra dự đoán</p>
          </div>
        ) : (
          <>
            {activeTab === 'prediction' && <PredictionTab />}
            {activeTab === 'cauanalysis' && <CauAnalysisTab />}
            {activeTab === 'patterns' && <PatternsTab />}
            {activeTab === 'statistics' && <StatisticsTab />}
            {activeTab === 'tips' && <TipsTab />}
          </>
        )}
      </div>
    </section>
  );
}
