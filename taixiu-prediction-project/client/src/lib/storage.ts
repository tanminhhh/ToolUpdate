import type { SequenceValue, HistoryItem } from "@/context/SequenceContext";

interface StoredData {
  sequence: SequenceValue[];
  historyData: HistoryItem[];
}

/**
 * Saves the current application state to localStorage
 * @param data The data to save (sequence and history data)
 */
export function saveToLocalStorage(data: StoredData): void {
  try {
    // Convert dates to ISO strings for serialization
    const processedHistoryData = data.historyData.map(item => ({
      ...item,
      timestamp: item.timestamp instanceof Date 
        ? item.timestamp.toISOString() 
        : item.timestamp
    }));

    const serializedData = JSON.stringify({
      sequence: data.sequence,
      historyData: processedHistoryData
    });
    
    localStorage.setItem('taixiu_predictor_data', serializedData);
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

/**
 * Loads the application state from localStorage
 * @returns The stored data or null if no data is found
 */
export function loadFromLocalStorage(): StoredData | null {
  try {
    const serializedData = localStorage.getItem('taixiu_predictor_data');
    
    if (!serializedData) {
      return null;
    }
    
    const data = JSON.parse(serializedData);
    
    // Convert ISO date strings back to Date objects
    if (data.historyData && Array.isArray(data.historyData)) {
      data.historyData = data.historyData.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
    
    return {
      sequence: Array.isArray(data.sequence) ? data.sequence as SequenceValue[] : [],
      historyData: Array.isArray(data.historyData) ? data.historyData as HistoryItem[] : []
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return null;
  }
}

/**
 * Clears all stored data from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem('taixiu_predictor_data');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Exports the current data as a JSON file for download
 * @param data The data to export
 */
export function exportData(data: StoredData): void {
  try {
    const processedHistoryData = data.historyData.map(item => ({
      ...item,
      timestamp: item.timestamp instanceof Date 
        ? item.timestamp.toISOString() 
        : item.timestamp
    }));

    const blob = new Blob(
      [JSON.stringify({ sequence: data.sequence, historyData: processedHistoryData }, null, 2)], 
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `taixiu_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

/**
 * Imports data from a JSON file
 * @param jsonString The JSON string to import
 * @returns The imported data or null if the import fails
 */
export function importData(jsonString: string): StoredData | null {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.sequence || !data.historyData) {
      throw new Error('Invalid data format');
    }
    
    // Convert ISO date strings back to Date objects
    const processedHistoryData = data.historyData.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
    
    return {
      sequence: data.sequence as SequenceValue[],
      historyData: processedHistoryData as HistoryItem[]
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return null;
  }
}

/**
 * Computes statistics about prediction accuracy from history data
 * @param historyData The history data to analyze
 * @returns Statistics about prediction accuracy
 */
export function computeAccuracyStats(historyData: HistoryItem[]): {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  taiAccuracy: number;
  xiuAccuracy: number;
} {
  // Filter predictions that have a verification result
  const verifiedPredictions = historyData.filter(item => 
    item.prediction && 
    item.prediction.prediction !== null && 
    typeof item.wasSuccessful === 'boolean'
  );
  
  if (verifiedPredictions.length === 0) {
    return {
      totalPredictions: 0,
      correctPredictions: 0,
      accuracy: 0,
      taiAccuracy: 0,
      xiuAccuracy: 0
    };
  }
  
  const correctPredictions = verifiedPredictions.filter(item => item.wasSuccessful).length;
  
  const taiPredictions = verifiedPredictions.filter(
    item => item.prediction && item.prediction.prediction === 'T'
  );
  
  const xiuPredictions = verifiedPredictions.filter(
    item => item.prediction && item.prediction.prediction === 'X'
  );
  
  const correctTai = taiPredictions.filter(item => item.wasSuccessful).length;
  const correctXiu = xiuPredictions.filter(item => item.wasSuccessful).length;
  
  return {
    totalPredictions: verifiedPredictions.length,
    correctPredictions,
    accuracy: correctPredictions / verifiedPredictions.length,
    taiAccuracy: taiPredictions.length > 0 ? correctTai / taiPredictions.length : 0,
    xiuAccuracy: xiuPredictions.length > 0 ? correctXiu / xiuPredictions.length : 0
  };
}
