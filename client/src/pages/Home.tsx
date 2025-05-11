import { useEffect } from "react";
import SequenceInput from "@/components/SequenceInput";
import ResultAnalysis from "@/components/ResultAnalysis";
import AnalysisCharts from "@/components/AnalysisCharts";
import AIAnimation from "@/components/AIAnimation";
import ChartModal from "@/components/ChartModal";
import { useSequence } from "@/hooks/useSequence";

export default function Home() {
  const { loadFromLocalStorage } = useSequence();

  useEffect(() => {
    // Load data from localStorage when component mounts
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-dark border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <i className="material-icons text-secondary mr-2">analytics</i>
          <h1 className="text-xl font-semibold">Tài Xỉu AI Predictor <span className="text-accent">PRO</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button id="historyBtn" className="flex items-center gap-1 text-muted hover:text-light transition-colors">
            <i className="material-icons text-sm">history</i>
            <span className="text-sm">Lịch sử</span>
          </button>
          
          <button id="settingsBtn" className="flex items-center gap-1 text-muted hover:text-light transition-colors">
            <i className="material-icons text-sm">settings</i>
            <span className="text-sm">Cài đặt</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Sequence Input Section */}
          <SequenceInput />
          
          {/* Analysis Results Section */}
          <ResultAnalysis />
          
          {/* AI Analysis Charts */}
          <AnalysisCharts />
        </div>
      </main>

      {/* Modals and Overlays */}
      <AIAnimation />
      <ChartModal />
    </div>
  );
}
