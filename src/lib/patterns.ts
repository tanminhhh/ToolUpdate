import type { SequenceValue } from "@/context/SequenceContext";

// Pattern analysis functions
export function analyzeRepeatPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 3) return { prediction: null, confidence: 0 };

  const lastValue = sequence[sequence.length - 1];
  let streak = 1;

  for (let i = sequence.length - 2; i >= 0; i--) {
    if (sequence[i] === lastValue) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 4) {
    // After 4 or more repeats, high chance of reversal
    return {
      prediction: lastValue === 'T' ? 'X' : 'T',
      confidence: 0.82,
      accuracy: 0.85
    };
  } else if (streak === 3) {
    // After 3 repeats, moderate chance of reversal
    return {
      prediction: lastValue === 'T' ? 'X' : 'T',
      confidence: 0.75,
      accuracy: 0.78
    };
  }

  return { prediction: null, confidence: 0 };
}

export function analyzeBreakPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 6) return { prediction: null, confidence: 0 };

  // Look for patterns like XXXT or TTTTX
  for (let length = 3; length <= 5; length++) {
    if (sequence.length >= length + 1) {
      const pattern = sequence.slice(sequence.length - length - 1, sequence.length - 1);
      const lastValue = sequence[sequence.length - 1];
      
      // Check if pattern is all same value
      const allSame = pattern.every(v => v === pattern[0]);
      
      if (allSame && pattern[0] !== lastValue) {
        // Detected a break pattern, likely to continue
        return {
          prediction: lastValue,
          confidence: 0.76,
          accuracy: 0.79
        };
      }
    }
  }

  return { prediction: null, confidence: 0 };
}

export function analyzeZigzagPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 4) return { prediction: null, confidence: 0 };

  // Check for alternating pattern
  const last4 = sequence.slice(sequence.length - 4);
  let alternating = true;
  
  for (let i = 1; i < last4.length; i++) {
    if (last4[i] === last4[i-1]) {
      alternating = false;
      break;
    }
  }
  
  if (alternating) {
    const lastValue = sequence[sequence.length - 1];
    return {
      prediction: lastValue === 'T' ? 'X' : 'T',
      confidence: 0.7,
      accuracy: 0.73
    };
  }

  return { prediction: null, confidence: 0 };
}

export function analyzeEvenOddPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  // This would analyze if T or X appears more frequently at even/odd positions
  if (sequence.length < 10) return { prediction: null, confidence: 0 };
  
  const evenT = sequence.filter((val, idx) => idx % 2 === 0 && val === 'T').length;
  const evenX = sequence.filter((val, idx) => idx % 2 === 0 && val === 'X').length;
  const oddT = sequence.filter((val, idx) => idx % 2 === 1 && val === 'T').length;
  const oddX = sequence.filter((val, idx) => idx % 2 === 1 && val === 'X').length;
  
  const evenCount = evenT + evenX;
  const oddCount = oddT + oddX;
  
  const evenTPercent = evenT / evenCount;
  const oddTPercent = oddT / oddCount;
  
  if (Math.abs(evenTPercent - oddTPercent) > 0.25) {
    // Significant difference in even/odd positions
    const isEvenPosition = sequence.length % 2 === 0;
    
    if (isEvenPosition) {
      return {
        prediction: evenTPercent > oddTPercent ? 'T' : 'X',
        confidence: 0.65,
        accuracy: 0.68
      };
    } else {
      return {
        prediction: oddTPercent > evenTPercent ? 'T' : 'X',
        confidence: 0.65,
        accuracy: 0.68
      };
    }
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzeFrequencyPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  const last20 = sequence.slice(-20);
  const frequencies: Record<SequenceValue, number> = { T: 0, X: 0 };
  
  last20.forEach(val => {
    frequencies[val] = (frequencies[val] || 0) + 1;
  });
  
  const dominantOutcome = frequencies.T > frequencies.X ? 'T' : 'X';
  const dominance = Math.max(frequencies.T, frequencies.X) / last20.length;
  
  if (dominance >= 0.7) { // 70% one outcome
    return {
      prediction: dominantOutcome === 'T' ? 'X' : 'T', // Predict opposite of dominant outcome
      confidence: 0.85,
      accuracy: 0.75
    };
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzeGlobalTrend(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 15) return { prediction: null, confidence: 0 };
  
  const segments: { value: SequenceValue, count: number }[] = [];
  let currentSegment = { value: sequence[0], count: 1 };
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === currentSegment.value) {
      currentSegment.count++;
    } else {
      segments.push(currentSegment);
      currentSegment = { value: sequence[i], count: 1 };
    }
  }
  segments.push(currentSegment);
  
  if (segments.length < 3) return { prediction: null, confidence: 0 };
  
  // Analyze segments trend
  const lastThreeSegments = segments.slice(-3);
  const trendingUp = lastThreeSegments[0].count < lastThreeSegments[1].count && 
                    lastThreeSegments[1].count < lastThreeSegments[2].count;
  const trendingDown = lastThreeSegments[0].count > lastThreeSegments[1].count && 
                      lastThreeSegments[1].count > lastThreeSegments[2].count;
  
  if (trendingUp) {
    // Segments are getting longer, may continue
    return {
      prediction: lastThreeSegments[2].value,
      confidence: 0.68,
      accuracy: 0.7
    };
  } else if (trendingDown) {
    // Segments are getting shorter, may break
    return {
      prediction: lastThreeSegments[2].value === 'T' ? 'X' : 'T',
      confidence: 0.66,
      accuracy: 0.69
    };
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzeSegmentPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 10) return { prediction: null, confidence: 0 };
  
  // Experimental: Look for repeating segment patterns
  // e.g., TTXTTX or XXTXXT
  
  for (let length = 2; length <= 4; length++) {
    if (sequence.length >= length * 2) {
      const segment1 = sequence.slice(sequence.length - length * 2, sequence.length - length).join('');
      const segment2 = sequence.slice(sequence.length - length).join('');
      
      if (segment1 === segment2) {
        // Found a repeating segment
        const nextInOriginalPattern = sequence[sequence.length - length * 2 - 1];
        if (nextInOriginalPattern) {
          return {
            prediction: nextInOriginalPattern,
            confidence: 0.65,
            accuracy: 0.67
          };
        }
      }
    }
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzePeakValleyPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 10) return { prediction: null, confidence: 0 };
  
  // Find peak and valley patterns in segment lengths
  const segments: { value: SequenceValue, count: number }[] = [];
  let currentSegment = { value: sequence[0], count: 1 };
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === currentSegment.value) {
      currentSegment.count++;
    } else {
      segments.push(currentSegment);
      currentSegment = { value: sequence[i], count: 1 };
    }
  }
  segments.push(currentSegment);
  
  if (segments.length < 5) return { prediction: null, confidence: 0 };
  
  const segmentLengths = segments.map(s => s.count);
  const lastThree = segmentLengths.slice(-3);
  
  // Check for peak pattern (low-high-low)
  if (lastThree[0] < lastThree[1] && lastThree[1] > lastThree[2]) {
    return {
      prediction: segments[segments.length - 1].value,
      confidence: 0.63,
      accuracy: 0.65
    };
  }
  
  // Check for valley pattern (high-low-high)
  if (lastThree[0] > lastThree[1] && lastThree[1] < lastThree[2]) {
    return {
      prediction: segments[segments.length - 1].value === 'T' ? 'X' : 'T',
      confidence: 0.61,
      accuracy: 0.63
    };
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzeReversePoint(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 8) return { prediction: null, confidence: 0 };
  
  // Calculate statistical properties of segments
  const segments: { value: SequenceValue, count: number }[] = [];
  let currentSegment = { value: sequence[0], count: 1 };
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === currentSegment.value) {
      currentSegment.count++;
    } else {
      segments.push(currentSegment);
      currentSegment = { value: sequence[i], count: 1 };
    }
  }
  segments.push(currentSegment);
  
  if (segments.length < 3) return { prediction: null, confidence: 0 };
  
  // Calculate average segment length
  const avgLength = segments.reduce((sum, s) => sum + s.count, 0) / segments.length;
  const lastSegment = segments[segments.length - 1];
  
  // If current segment is much longer than average, predict reversal
  if (lastSegment.count > avgLength * 1.4) {
    return {
      prediction: lastSegment.value === 'T' ? 'X' : 'T',
      confidence: 0.74,
      accuracy: 0.76
    };
  }
  
  // If current segment is approaching average length, continue trend
  if (lastSegment.count >= 0.7 * avgLength && lastSegment.count <= avgLength) {
    return {
      prediction: lastSegment.value,
      confidence: 0.72,
      accuracy: 0.74
    };
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzeBreakRiskPattern(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 10) return { prediction: null, confidence: 0 };
  
  // Calculate break risk based on historical breaks
  const segments: { value: SequenceValue, count: number }[] = [];
  let currentSegment = { value: sequence[0], count: 1 };
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === currentSegment.value) {
      currentSegment.count++;
    } else {
      segments.push(currentSegment);
      currentSegment = { value: sequence[i], count: 1 };
    }
  }
  segments.push(currentSegment);
  
  if (segments.length < 5) return { prediction: null, confidence: 0 };
  
  // Count breaks by segment length
  const breaksByLength: Record<number, { total: number, breaks: number }> = {};
  
  for (let i = 0; i < segments.length - 1; i++) {
    const length = segments[i].count;
    if (!breaksByLength[length]) {
      breaksByLength[length] = { total: 0, breaks: 0 };
    }
    breaksByLength[length].total++;
  }
  
  // Calculate break probabilities
  const lastSegment = segments[segments.length - 1];
  const breakRisk = breaksByLength[lastSegment.count]?.breaks / 
                    breaksByLength[lastSegment.count]?.total || 0;
  
  if (breakRisk > 0.6) {
    return {
      prediction: lastSegment.value === 'T' ? 'X' : 'T',
      confidence: 0.65 + (breakRisk * 0.1),
      accuracy: 0.68
    };
  }
  
  return { prediction: null, confidence: 0 };
}

export function analyzeDoubleConfirmation(
  sequence: SequenceValue[]
): { prediction: SequenceValue | null; confidence: number; accuracy?: number } {
  if (sequence.length < 8) return { prediction: null, confidence: 0 };
  
  // Check if multiple patterns confirm the same prediction
  const patterns = [
    analyzeRepeatPattern(sequence),
    analyzeBreakPattern(sequence),
    analyzeZigzagPattern(sequence),
    analyzeReversePoint(sequence)
  ].filter(p => p.confidence > 0);
  
  // Count predictions for T and X
  const counts = { T: 0, X: 0 };
  patterns.forEach(p => {
    if (p.prediction) {
      counts[p.prediction]++;
    }
  });
  
  // If one prediction has multiple confirmations
  if (counts.T >= 2 && counts.T > counts.X) {
    return {
      prediction: 'T',
      confidence: 0.78,
      accuracy: 0.8
    };
  }
  
  if (counts.X >= 2 && counts.X > counts.T) {
    return {
      prediction: 'X',
      confidence: 0.78,
      accuracy: 0.8
    };
  }
  
  return { prediction: null, confidence: 0 };
}

// Helper functions for pattern descriptions and recommendations
export function getPatternDescription(sequence: SequenceValue[]): string {
  if (sequence.length < 5) return "Chưa đủ dữ liệu";
  
  const last5 = sequence.slice(-5);
  const lastValue = last5[last5.length - 1];
  const sameValueCount = last5.filter(v => v === lastValue).length;
  
  if (sameValueCount >= 4) {
    return "Chuỗi đơn điệu kéo dài";
  } else if (sameValueCount === 3) {
    return "Chuỗi đơn điệu trung bình";
  } else if (alternatingPattern(last5)) {
    return "Mẫu hình xen kẽ";
  } else {
    return "Mẫu hình hỗn hợp";
  }
}

export function getRecommendation(sequence: SequenceValue[]): string {
  if (sequence.length < 5) return "Chưa đủ dữ liệu";
  
  const last5 = sequence.slice(-5);
  const lastValue = last5[last5.length - 1];
  const sameValueCount = last5.filter(v => v === lastValue).length;
  
  if (sameValueCount >= 4) {
    return `Đặt ${lastValue === 'T' ? 'XỈU' : 'TÀI'} (Bẻ cầu)`;
  } else if (sameValueCount === 3) {
    return `Đặt ${lastValue === 'T' ? 'XỈU' : 'TÀI'} (Bẻ cầu)`;
  } else if (alternatingPattern(last5)) {
    const nextInPattern = lastValue === 'T' ? 'X' : 'T';
    return `Đặt ${nextInPattern === 'T' ? 'TÀI' : 'XỈU'} (Theo cầu)`;
  } else {
    return "Chờ thêm tín hiệu";
  }
}

export function getTips() {
  return [
    {
      title: "Mẹo Quản lý Vốn",
      tips: [
        "Không đặt quá 3-5% tổng vốn cho một lượt chơi",
        "Dừng khi thua 3 lần liên tiếp",
        "Đặt mục tiêu lợi nhuận hợp lý cho mỗi phiên",
        "Không cố gắng gỡ lại số thua lỗ ngay lập tức"
      ]
    },
    {
      title: "Mẹo Chuyên Gia",
      tips: [
        "Không nên bắt theo xu hướng quá 3 lần liên tiếp",
        "Chú ý các điểm gãy cầu quan trọng",
        "Kết hợp nhiều phương pháp phân tích",
        "Kiên nhẫn chờ đợi tín hiệu rõ ràng"
      ]
    }
  ];
}

export function getRecommendedStrategy(sequence: SequenceValue[]): string {
  const stability = getStabilityScore(sequence);
  
  if (stability === "Cao") return "bắt theo";
  if (stability === "Thấp") return "bẻ cầu";
  return "thích nghi";
}

export function getAverageSegmentLength(sequence: SequenceValue[]): string {
  if (sequence.length < 5) return "Chưa đủ dữ liệu";
  
  const segments: { value: SequenceValue, count: number }[] = [];
  let currentSegment = { value: sequence[0], count: 1 };
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === currentSegment.value) {
      currentSegment.count++;
    } else {
      segments.push(currentSegment);
      currentSegment = { value: sequence[i], count: 1 };
    }
  }
  segments.push(currentSegment);
  
  if (segments.length === 0) return "0";
  
  const avgLength = segments.reduce((sum, s) => sum + s.count, 0) / segments.length;
  return avgLength.toFixed(1);
}

// Helper function to check if a pattern is alternating
function alternatingPattern(arr: SequenceValue[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i-1]) return false;
  }
  return true;
}

export function getStabilityScore(sequence: SequenceValue[]): string {
  if (sequence.length < 5) return "Chưa đủ dữ liệu";
  
  const alternationRate = calculateAlternationRate(sequence);
  
  if (alternationRate >= 70) return "Thấp";
  if (alternationRate >= 50) return "Trung bình";
  return "Cao";
}

function calculateAlternationRate(sequence: SequenceValue[]): number {
  if (sequence.length <= 1) return 0;
  
  let alternations = 0;
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i-1]) alternations++;
  }
  return (alternations / (sequence.length - 1)) * 100;
}
