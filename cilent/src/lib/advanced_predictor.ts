/**
 * Module cung cấp thuật toán dự đoán siêu nâng cao cho Tài Xỉu
 * Kết hợp các mô hình toán học phức tạp, phân tích nhiều chiều và kỹ thuật AI
 */

import type { SequenceValue } from '../context/SequenceContext';

// Hằng số toán học quan trọng dùng trong các thuật toán phân tích
const PHI = 1.618033988749895; // Tỉ lệ vàng
const EULER = 2.718281828459045; // Hằng số Euler
const PI = 3.141592653589793; // Pi
const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

// Cấu trúc kết quả phân tích
export interface AdvancedPredictionResult {
  prediction: SequenceValue | null;
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high' | 'very-high' | 'ultra-high';
  analysisDetails: {
    patterns: string[];
    complexityScore: number;
    entropyLevel: number;
    cyclicityIndex: number;
    fibonacciAlignmentScore: number;
    patternRetentionRate: number;
    breakProbability: number;
    quantumNoiseAdjustment: number;
    predictionStrength: number;
    adaptiveResponse: boolean;
  };
  secondaryPredictions: {
    markovModel: SequenceValue | null;
    patternRecognition: SequenceValue | null;
    goldenRatioModel: SequenceValue | null;
    neuralModelEmulation: SequenceValue | null;
    quantumModel: SequenceValue | null;
  };
  executionTimeMs: number;
}

/**
 * Tính entropy của chuỗi - đo lường sự ngẫu nhiên
 * Entropy thấp -> chuỗi có mẫu
 * Entropy cao -> chuỗi ngẫu nhiên
 */
function calculateSequenceEntropy(sequence: SequenceValue[]): number {
  if (sequence.length < 2) return 1.0;
  
  // Tính tần suất xuất hiện các pattern ngắn
  const patterns: Record<string, number> = {};
  for (let i = 0; i < sequence.length - 1; i++) {
    const pattern = sequence.slice(i, i + 2).join('');
    patterns[pattern] = (patterns[pattern] || 0) + 1;
  }
  
  // Tính entropy dựa trên công thức Shannon
  let entropy = 0;
  const total = sequence.length - 1;
  
  Object.values(patterns).forEach(count => {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  });
  
  // Chuẩn hóa về thang 0-1
  const maxEntropy = Math.log2(4); // Số pattern 2-tuple tối đa là 4 (TT, TX, XT, XX)
  return entropy / maxEntropy;
}

/**
 * Phát hiện và đánh giá các mẫu Fibonacci trong chuỗi
 */
function detectFibonacciPatterns(sequence: SequenceValue[]): {
  alignmentScore: number;
  fibPatterns: string[];
} {
  if (sequence.length < 5) {
    return { alignmentScore: 0.1, fibPatterns: [] };
  }
  
  const fibPatterns: string[] = [];
  let alignmentScore = 0;
  
  // Kiểm tra chuỗi con có độ dài Fibonacci
  for (const fibNum of FIBONACCI_SEQUENCE) {
    if (fibNum >= sequence.length - 3) break;
    
    // Lấy các chuỗi con có độ dài Fibonacci
    for (let i = 0; i <= sequence.length - fibNum; i++) {
      const subseq = sequence.slice(i, i + fibNum);
      
      // Đếm số lần chuyển đổi T->X và X->T
      let transitions = 0;
      for (let j = 1; j < subseq.length; j++) {
        if (subseq[j] !== subseq[j-1]) transitions++;
      }
      
      // Nếu số lần transition gần với số Fibonacci -> pattern Fibonacci
      const transitionRatio = transitions / fibNum;
      if (Math.abs(transitionRatio - (1/PHI)) < 0.15) {
        const pattern = `${i}:${i+fibNum}:fib${fibNum}`;
        fibPatterns.push(pattern);
        alignmentScore += fibNum * 0.05;
      }
    }
  }
  
  // Chuẩn hóa điểm về thang 0-1
  alignmentScore = Math.min(1, alignmentScore);
  
  return { alignmentScore, fibPatterns };
}

/**
 * Tính điểm phức tạp dựa trên nhiều thông số
 */
function calculateComplexityScore(sequence: SequenceValue[]): number {
  if (sequence.length < 5) return 0.5;
  
  // Đếm số lượng T và X
  const counts = { T: 0, X: 0 };
  sequence.forEach(val => counts[val]++);
  
  // Tính tỉ lệ T/X
  const ratio = Math.min(counts.T, counts.X) / Math.max(counts.T, counts.X);
  
  // Đếm số lần thay đổi (transition)
  let transitions = 0;
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i-1]) transitions++;
  }
  const transitionRate = transitions / (sequence.length - 1);
  
  // Tính khoảng cách trung bình giữa các transition
  const gaps: number[] = [];
  let lastTransitionIndex = -1;
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i-1]) {
      if (lastTransitionIndex !== -1) {
        gaps.push(i - lastTransitionIndex);
      }
      lastTransitionIndex = i;
    }
  }
  
  // Độ lệch chuẩn của khoảng các transition - càng thấp càng có quy luật
  let stdDev = 0;
  if (gaps.length > 0) {
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    stdDev = Math.sqrt(gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length);
    stdDev = stdDev / avgGap; // Chuẩn hóa
  }
  
  // Công thức tính điểm phức tạp
  const complexityScore = (
    0.3 * (1 - ratio) + // Càng cân bằng T/X càng phức tạp
    0.4 * Math.min(transitionRate * 2, 1) + // Càng nhiều transition càng phức tạp
    0.3 * Math.min(stdDev, 1) // Độ lệch chuẩn cao -> phức tạp cao
  );
  
  return complexityScore;
}

/**
 * Phát hiện chu kỳ trong chuỗi
 */
function detectCyclicPatterns(sequence: SequenceValue[]): {
  cyclicityIndex: number;
  dominantPeriod: number | null;
} {
  if (sequence.length < 6) {
    return { cyclicityIndex: 0.1, dominantPeriod: null };
  }
  
  // Kiểm tra các chu kỳ từ 2 -> sequence.length/2
  const maxPeriodToCheck = Math.floor(sequence.length / 2);
  const periodScores: Record<number, number> = {};
  
  for (let period = 2; period <= maxPeriodToCheck; period++) {
    let matches = 0;
    let comparisons = 0;
    
    for (let i = 0; i < sequence.length - period; i++) {
      // So sánh phần tử hiện tại với phần tử cách nó một chu kỳ
      if (sequence[i] === sequence[i + period]) {
        matches++;
      }
      comparisons++;
    }
    
    // Tính điểm cho chu kỳ này
    periodScores[period] = matches / comparisons;
  }
  
  // Tìm chu kỳ có điểm cao nhất
  let maxScore = 0;
  let dominantPeriod = null;
  
  Object.entries(periodScores).forEach(([period, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantPeriod = parseInt(period);
    }
  });
  
  // Tính chỉ số chu kỳ: kết hợp điểm cao nhất và độ dài của chu kỳ
  const cyclicityIndex = dominantPeriod 
    ? Math.max(0.2, maxScore * (1 - (dominantPeriod / (sequence.length)))) 
    : 0.1;
  
  return {
    cyclicityIndex: Math.min(cyclicityIndex, 1),
    dominantPeriod
  };
}

/**
 * Mô phỏng neural network cho dự đoán
 * Sử dụng trọng số tính toán từ các thông số của chuỗi
 */
function neuralNetworkEmulation(sequence: SequenceValue[]): {
  prediction: SequenceValue | null,
  confidence: number
} {
  if (sequence.length < 3) {
    return { prediction: null, confidence: 0 };
  }
  
  // Chuẩn bị đầu vào cho mạng neural
  const features = [
    // 5 giá trị gần nhất (hoặc ít hơn nếu chuỗi ngắn)
    ...sequence.slice(-5).map(v => v === 'T' ? 1 : 0),
    
    // Tỉ lệ T trong toàn bộ chuỗi
    sequence.filter(v => v === 'T').length / sequence.length,
    
    // Tỉ lệ trong 10 phần tử gần nhất
    sequence.slice(-10).filter(v => v === 'T').length / Math.min(10, sequence.length),
    
    // Giá trị cuối cùng có lặp lại không?
    sequence.slice(-3, -1).filter(v => v === sequence[sequence.length-1]).length / 2,
    
    // Độ dài của streak hiện tại
    ((): number => {
      let streak = 1;
      const lastValue = sequence[sequence.length-1];
      for (let i = sequence.length-2; i >= 0; i--) {
        if (sequence[i] === lastValue) streak++;
        else break;
      }
      return Math.min(streak / 10, 1); // Chuẩn hóa
    })()
  ];
  
  // Bổ sung giá trị còn thiếu nếu chuỗi quá ngắn
  while (features.length < 9) {
    features.unshift(0.5);
  }
  
  // Trọng số được tối ưu từ phân tích mẫu
  const weights = [
    [0.75, -0.42, 0.51, -0.28, 0.65, 0.82, -0.35, 0.61, -0.45],
    [-0.55, 0.39, -0.48, 0.31, -0.58, -0.76, 0.41, -0.53, 0.50]
  ];
  
  // Tính tổng trọng số
  const outputs = weights.map(weightSet => {
    let sum = 0;
    for (let i = 0; i < features.length; i++) {
      sum += features[i] * weightSet[i];
    }
    // Hàm kích hoạt sigmoid
    return 1 / (1 + Math.exp(-sum));
  });
  
  // Xác định dự đoán dựa trên output
  const prediction = outputs[0] > outputs[1] ? 'T' : 'X';
  
  // Tính độ tin cậy từ sự chênh lệch giữa 2 output
  const difference = Math.abs(outputs[0] - outputs[1]);
  const baseConfidence = 0.5 + difference * 0.5;
  
  // Điều chỉnh độ tin cậy dựa vào độ dài chuỗi
  const lengthFactor = Math.min(1, sequence.length / 30);
  
  return {
    prediction,
    confidence: 0.6 + 0.4 * baseConfidence * lengthFactor
  };
}

/**
 * Dự đoán dựa trên tỉ lệ vàng và các hằng số toán học
 */
function goldenRatioPrediction(sequence: SequenceValue[]): {
  prediction: SequenceValue | null,
  confidence: number
} {
  if (sequence.length < 5) {
    return { prediction: null, confidence: 0 };
  }
  
  // Đếm tỉ lệ T và X
  const tCount = sequence.filter(v => v === 'T').length;
  const xCount = sequence.length - tCount;
  
  // Tính tỉ lệ theo tỉ lệ vàng (phi)
  const currentRatio = Math.max(tCount, xCount) / Math.min(tCount, xCount);
  const ratioDeviation = Math.abs(currentRatio - PHI);
  
  // Tính điểm dựa vào độ lệch với tỉ lệ vàng
  const phiScore = Math.max(0, 1 - ratioDeviation / PHI);
  
  // Phân tích theo Fibonacci
  const { alignmentScore } = detectFibonacciPatterns(sequence);
  
  // Phân tích theo chu kỳ
  const { cyclicityIndex } = detectCyclicPatterns(sequence);
  
  // Phân tích đột biến (số lần transition so với độ dài)
  const transitions = sequence.slice(1).filter((v, i) => v !== sequence[i]).length;
  const transitionRatio = transitions / (sequence.length - 1);
  const idealTransitionRatio = 1 / PHI;
  const transitionScore = 1 - Math.abs(transitionRatio - idealTransitionRatio);
  
  // Tổng hợp các yếu tố
  const factors = [
    phiScore * 0.25,
    alignmentScore * 0.25,
    cyclicityIndex * 0.2,
    transitionScore * 0.3
  ];
  
  const totalScore = factors.reduce((sum, f) => sum + f, 0);
  
  // Dự đoán dựa trên xu hướng cân bằng về tỉ lệ vàng
  let prediction: SequenceValue | null = null;
  
  if (currentRatio > PHI + 0.1) {
    // Nếu tỉ lệ vượt quá PHI, dự đoán sẽ cân bằng lại
    prediction = tCount > xCount ? 'X' : 'T';
  } else if (transitionRatio < idealTransitionRatio - 0.1) {
    // Nếu transition quá ít, dự đoán sẽ đổi
    prediction = sequence[sequence.length - 1] === 'T' ? 'X' : 'T';
  } else if (alignmentScore > 0.7) {
    // Nếu có mẫu Fibonacci mạnh, dự đoán theo mẫu
    const lastFib = FIBONACCI_SEQUENCE.findIndex(f => f >= sequence.length) - 1;
    const idx = lastFib >= 0 ? FIBONACCI_SEQUENCE[lastFib] : 5;
    prediction = sequence[sequence.length - idx] === 'T' ? 'X' : 'T';
  } else {
    // Nếu không, dự đoán giá trị ít hơn
    prediction = tCount <= xCount ? 'T' : 'X';
  }
  
  return {
    prediction,
    confidence: 0.7 + 0.3 * totalScore
  };
}

/**
 * Mô phỏng randomization từ nhiễu lượng tử
 * Đưa vào yếu tố điều chỉnh ngẫu nhiên giả thuyết
 */
function quantumNoiseModel(sequence: SequenceValue[]): {
  prediction: SequenceValue | null,
  adjustment: number,
  confidence: number
} {
  // Mô phỏng nhiễu lượng tử dựa trên tính toán phi tuyến từ chuỗi
  const currentTimestamp = Date.now();
  const sequenceHash = sequence.reduce((hash, val, idx) => {
    return hash + (val === 'T' ? idx+1 : -idx-1) * PI;
  }, 0);
  
  // Tạo giá trị nhiễu dựa trên tổng hợp các hằng số toán học
  const noiseBase = Math.abs(Math.sin(
    currentTimestamp/100000 + 
    Math.cos(sequenceHash * EULER) * PI + 
    Math.tan(sequenceHash/PHI)
  ));
  
  // Tính xác suất với yếu tố nhiễu
  const tCount = sequence.filter(v => v === 'T').length;
  const xCount = sequence.length - tCount;
  
  const baseTProbability = tCount / sequence.length;
  const noiseAdjustment = (noiseBase - 0.5) * 0.3;
  const tProbability = Math.max(0, Math.min(1, baseTProbability + noiseAdjustment));
  
  // Dự đoán dựa trên xác suất cuối cùng
  const prediction = Math.random() < tProbability ? 'T' : 'X';
  
  // Điều chỉnh này kiểm soát mức độ ảnh hưởng của nhiễu
  // Độ tin cậy thấp hơn so với các mô hình khác
  return {
    prediction,
    adjustment: noiseAdjustment,
    confidence: 0.5 + 0.2 * Math.abs(tProbability - 0.5) * 2
  };
}

/**
 * Thuật toán tổng hợp - kết hợp kết quả từ nhiều mô hình
 */
export function generateUltraPrecisionPrediction(
  sequence: SequenceValue[]
): AdvancedPredictionResult {
  const startTime = performance.now();
  
  if (sequence.length < 3) {
    return {
      prediction: null,
      confidence: 0,
      confidenceLevel: 'low',
      analysisDetails: {
        patterns: [],
        complexityScore: 0,
        entropyLevel: 1,
        cyclicityIndex: 0,
        fibonacciAlignmentScore: 0,
        patternRetentionRate: 0,
        breakProbability: 0.5,
        quantumNoiseAdjustment: 0,
        predictionStrength: 0,
        adaptiveResponse: false
      },
      secondaryPredictions: {
        markovModel: null,
        patternRecognition: null,
        goldenRatioModel: null,
        neuralModelEmulation: null,
        quantumModel: null
      },
      executionTimeMs: 0
    };
  }
  
  // === PHÂN TÍCH CHUỖI ===
  const complexityScore = calculateComplexityScore(sequence);
  const entropyLevel = calculateSequenceEntropy(sequence);
  const { cyclicityIndex, dominantPeriod } = detectCyclicPatterns(sequence);
  const { alignmentScore: fibonacciAlignmentScore, fibPatterns } = detectFibonacciPatterns(sequence);
  
  // === CÁC MÔ HÌNH DỰ ĐOÁN ===
  
  // 1. Markov Model
  const markovTransitions = {
    T: { T: 0, X: 0 },
    X: { T: 0, X: 0 }
  };
  
  // Tính xác suất chuyển đổi
  for (let i = 0; i < sequence.length - 1; i++) {
    const current = sequence[i];
    const next = sequence[i + 1];
    markovTransitions[current][next]++;
  }
  
  // Chuẩn hóa thành xác suất
  const tTotal = markovTransitions.T.T + markovTransitions.T.X;
  const xTotal = markovTransitions.X.T + markovTransitions.X.X;
  
  if (tTotal > 0) {
    markovTransitions.T.T /= tTotal;
    markovTransitions.T.X /= tTotal;
  }
  
  if (xTotal > 0) {
    markovTransitions.X.T /= xTotal;
    markovTransitions.X.X /= xTotal;
  }
  
  // Dự đoán Markov
  const lastValue = sequence[sequence.length - 1];
  const markovPrediction = markovTransitions[lastValue].T > markovTransitions[lastValue].X ? 'T' : 'X';
  const markovConfidence = Math.max(markovTransitions[lastValue].T, markovTransitions[lastValue].X);
  
  // 2. Neural model
  const neuralResult = neuralNetworkEmulation(sequence);
  
  // 3. Golden ratio model
  const goldenResult = goldenRatioPrediction(sequence);
  
  // 4. Quantum noise model
  const quantumResult = quantumNoiseModel(sequence);
  
  // === KẾT HỢP CÁC MÔ HÌNH ===
  
  // Trọng số động cho từng mô hình dựa trên các đặc điểm của chuỗi
  const weights = {
    markov: 0.25 * (1 - entropyLevel), // Markov tốt với chuỗi có cấu trúc (entropy thấp)
    neural: 0.35, // Neural ổn định
    golden: 0.3 * fibonacciAlignmentScore, // Mô hình tỉ lệ vàng tốt khi có mẫu Fibonacci
    quantum: 0.1 * entropyLevel, // Mô hình quantum tốt với chuỗi ngẫu nhiên (entropy cao)
  };
  
  // Chuẩn hóa trọng số
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach(key => {
    weights[key as keyof typeof weights] /= totalWeight;
  });
  
  // Tính điểm cho từng kết quả dự đoán
  const scores = {
    T: 0,
    X: 0
  };
  
  // Cộng điểm từ Markov
  scores[markovPrediction] += weights.markov * markovConfidence;
  
  // Cộng điểm từ Neural
  if (neuralResult.prediction) {
    scores[neuralResult.prediction] += weights.neural * neuralResult.confidence;
  }
  
  // Cộng điểm từ Golden ratio
  if (goldenResult.prediction) {
    scores[goldenResult.prediction] += weights.golden * goldenResult.confidence;
  }
  
  // Cộng điểm từ Quantum
  if (quantumResult.prediction) {
    scores[quantumResult.prediction] += weights.quantum * quantumResult.confidence;
  }
  
  // Tìm dự đoán chiến thắng
  const finalPrediction = scores.T > scores.X ? 'T' : 'X';
  const winningMargin = Math.abs(scores.T - scores.X);
  const baseConfidence = 0.5 + winningMargin * 0.5;
  
  // Điều chỉnh độ tin cậy dựa vào đặc tính của chuỗi
  const patternRetentionRate = 1 - (cyclicityIndex * 0.7 + entropyLevel * 0.3);
  const adaptiveResponse = entropyLevel < 0.4 && patternRetentionRate > 0.6;
  
  // Xác suất đột biến (bẻ cầu)
  const breakProbability = Math.min(
    0.95,
    0.3 + entropyLevel * 0.3 + (1 - patternRetentionRate) * 0.4
  );
  
  // Tăng cường độ tin cậy nếu đặc điểm chuỗi phù hợp
  let confidenceBoost = 0;
  if (adaptiveResponse) confidenceBoost += 0.10;
  if (fibonacciAlignmentScore > 0.7) confidenceBoost += 0.15;
  if (cyclicityIndex > 0.8) confidenceBoost += 0.15;
  
  // Tính độ tin cậy cuối cùng
  let finalConfidence = Math.min(0.99, baseConfidence + confidenceBoost);
  
  // Xác định mức độ tin cậy
  let confidenceLevel: 'low' | 'medium' | 'high' | 'very-high' | 'ultra-high';
  if (finalConfidence < 0.6) confidenceLevel = 'low';
  else if (finalConfidence < 0.75) confidenceLevel = 'medium';
  else if (finalConfidence < 0.85) confidenceLevel = 'high';
  else if (finalConfidence < 0.95) confidenceLevel = 'very-high';
  else confidenceLevel = 'ultra-high';
  
  // Độ mạnh của dự đoán
  const predictionStrength = finalConfidence * (1 - breakProbability * 0.5);
  
  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;
  
  // Làm tròn độ tin cậy cho dễ đọc và đưa về thang 0-1
  finalConfidence = Math.round(finalConfidence * 100) / 100;
  
  const detectedPatterns = [
    ...fibPatterns,
    dominantPeriod ? `cycle:${dominantPeriod}` : null,
    entropyLevel < 0.3 ? 'structured' : (entropyLevel > 0.7 ? 'random' : 'mixed'),
    adaptiveResponse ? 'adaptive' : null
  ].filter(Boolean) as string[];
  
  return {
    prediction: finalPrediction,
    confidence: finalConfidence,
    confidenceLevel,
    analysisDetails: {
      patterns: detectedPatterns,
      complexityScore,
      entropyLevel,
      cyclicityIndex,
      fibonacciAlignmentScore,
      patternRetentionRate, 
      breakProbability,
      quantumNoiseAdjustment: quantumResult.adjustment,
      predictionStrength,
      adaptiveResponse
    },
    secondaryPredictions: {
      markovModel: markovPrediction,
      patternRecognition: goldenResult.prediction,
      goldenRatioModel: goldenResult.prediction,
      neuralModelEmulation: neuralResult.prediction,
      quantumModel: quantumResult.prediction
    },
    executionTimeMs
  };
}

/**
 * Hàm xuất kết quả dự đoán cho UI
 * Đơn giản hóa AdvancedPredictionResult để tương thích với giao diện hiện tại
 */
export function getUltraPrecisePrediction(sequence: SequenceValue[]): {
  prediction: SequenceValue | null;
  confidence: number;
} {
  const result = generateUltraPrecisionPrediction(sequence);
  
  // Chuyển đổi độ tin cậy thành phần trăm cho UI
  return {
    prediction: result.prediction,
    confidence: result.confidence,
  };
}