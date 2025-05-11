import type { SequenceValue } from "@/context/SequenceContext";

/**
 * Module phân tích cầu, bắt cầu và bẻ cầu siêu nâng cao cho Tài Xỉu
 * với độ chính xác tối ưu dựa trên nhiều yếu tố và kỹ thuật toán học
 */

// Các hằng số toán học dùng để phân tích
const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55];
const PHI = 1.618033988749895; // Tỉ lệ vàng
const GOLDEN_RATIO = 0.618033988749895; // 1/PHI
const PI = Math.PI;
const EULER = Math.E;

export interface EnhancedCauAnalysisResult {
  // Kết quả phân tích
  prediction: SequenceValue | null;
  confidence: number;
  // Thông tin chi tiết
  streakLength: number;
  breakProbability: number;
  patternType: string;
  patternTrend: "stable" | "unstable" | "transitioning" | "early";
  // Thông tin phụ trợ
  detailedAnalysis: {
    oscillationRate: number; // Tỉ lệ dao động T-X
    streakQuality: number; // Chất lượng của cầu hiện tại (0-1)
    breakStrength: number; // Độ mạnh của bẻ cầu (0-1)
    patternStrength: number; // Độ mạnh của mẫu (0-1)
    optimalBreakPoint: boolean; // Điểm bẻ cầu tối ưu
    fibonacciAlignment: number; // Độ phù hợp với dãy Fibonacci (0-1)
    xingXangIndex: number; // Mức độ mẫu xen kẽ (0-1)
    adaptability: number; // Độ thích ứng của mẫu với điều kiện (0-1)
    dominantValue: SequenceValue | null; // Giá trị chiếm ưu thế (T/X)
    patternMaturity: number; // Độ trưởng thành của mẫu (0-1)
  };
  patterns: {
    detectedPatterns: string[];
    patternScores: Record<string, number>;
  }
}

/**
 * Phân tích chuỗi và chia thành các đoạn (segments) của cùng giá trị
 */
function segmentSequence(sequence: SequenceValue[]): Array<{value: SequenceValue, count: number, startIndex: number}> {
  if (sequence.length === 0) return [];
  
  const segments: Array<{value: SequenceValue, count: number, startIndex: number}> = [];
  let currentValue = sequence[0];
  let currentCount = 1;
  let startIndex = 0;
  
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === currentValue) {
      currentCount++;
    } else {
      segments.push({value: currentValue, count: currentCount, startIndex});
      currentValue = sequence[i];
      currentCount = 1;
      startIndex = i;
    }
  }
  
  // Thêm segment cuối cùng
  segments.push({value: currentValue, count: currentCount, startIndex});
  
  return segments;
}

/**
 * Phát hiện mẫu cầu mở rộng - nhận diện nhiều loại mẫu khác nhau
 */
export function detectAdvancedCauPattern(
  sequence: SequenceValue[],
  segments: Array<{value: SequenceValue, count: number, startIndex: number}>
): {
  patternType: string,
  patternStrength: number,
  secondaryPatterns: string[],
  patternScores: Record<string, number>
} {
  if (sequence.length < 5) {
    return {
      patternType: "Chưa đủ dữ liệu", 
      patternStrength: 0,
      secondaryPatterns: [],
      patternScores: {}
    };
  }
  
  // Tính toán các chỉ số cơ bản
  const tCount = sequence.filter(v => v === 'T').length;
  const xCount = sequence.length - tCount;
  const tRatio = tCount / sequence.length;
  
  const lastValue = sequence[sequence.length - 1];
  const lastSegment = segments[segments.length - 1];
  
  // Khởi tạo điểm số cho mỗi loại mẫu
  const patternScores: Record<string, number> = {
    "cau_dai": 0,
    "cau_xen_ke": 0,
    "cau_fibonacci": 0,
    "cau_gay_quy_luat": 0,
    "cau_gay_khong_quy_luat": 0,
    "cau_phi": 0,
    "cau_tron": 0,
    "cau_bien_doi": 0
  };
  
  // 1. Kiểm tra cầu dài
  if (lastSegment.count >= 4) {
    patternScores.cau_dai = Math.min(1, 0.4 + lastSegment.count * 0.15);
  }
  
  // 2. Kiểm tra cầu xen kẽ (mẫu T-X-T-X hoặc X-T-X-T)
  let alternatingScore = 0;
  if (segments.length >= 4) {
    const recentSegments = segments.slice(-6);
    
    // Kiểm tra xem tất cả các phân đoạn có độ dài 1 không
    const allLengthOne = recentSegments.every(s => s.count === 1);
    if (allLengthOne) {
      // Kiểm tra tính xen kẽ
      let isAlternatingPattern = true;
      for (let i = 2; i < recentSegments.length; i += 2) {
        if (recentSegments[i].value !== recentSegments[i-2].value) {
          isAlternatingPattern = false;
          break;
        }
      }
      
      if (isAlternatingPattern) {
        alternatingScore = Math.min(1, 0.5 + recentSegments.length * 0.08);
      }
    }
    
    // Kiểm tra mẫu xen kẽ đều (độ dài các đoạn tương đương) ngay cả khi không hoàn toàn xen kẽ
    if (recentSegments.length >= 4) {
      const avgLength = recentSegments.reduce((sum, s) => sum + s.count, 0) / recentSegments.length;
      const maxDeviation = Math.max(...recentSegments.map(s => Math.abs(s.count - avgLength) / avgLength));
      
      if (maxDeviation < 0.5) {
        alternatingScore = Math.min(1, 0.4 + (1 - maxDeviation) * 0.5);
      }
    }
  }
  patternScores.cau_xen_ke = alternatingScore;
  
  // 3. Kiểm tra cầu Fibonacci
  let fibonacciScore = 0;
  if (segments.length >= 3) {
    // Kiểm tra độ phù hợp với dãy Fibonacci
    let matchCount = 0;
    let totalComparisons = 0;
    
    for (let i = 2; i < segments.length; i++) {
      const actual = segments[i].count;
      const expected = segments[i-1].count + segments[i-2].count;
      totalComparisons++;
      
      // Nếu độ lệch nhỏ, coi là khớp
      if (Math.abs(actual - expected) <= 1) {
        matchCount++;
      } else if (Math.abs(actual - expected) <= 2) {
        matchCount += 0.5;
      }
    }
    
    fibonacciScore = totalComparisons > 0 ? matchCount / totalComparisons : 0;
    
    // Tăng cường điểm nếu các đoạn gần đây tuân theo quy luật Fibonacci
    if (segments.length >= 5) {
      const recentSegments = segments.slice(-5);
      let recentMatches = 0;
      
      for (let i = 2; i < recentSegments.length; i++) {
        const actual = recentSegments[i].count;
        const expected = recentSegments[i-1].count + recentSegments[i-2].count;
        
        if (Math.abs(actual - expected) <= 1) {
          recentMatches++;
        }
      }
      
      if (recentMatches === recentSegments.length - 2) {
        fibonacciScore = Math.min(1, fibonacciScore + 0.3);
      }
    }
  }
  patternScores.cau_fibonacci = fibonacciScore;
  
  // 4. Kiểm tra cầu gãy có quy luật
  let patternedBreakScore = 0;
  if (segments.length >= 4) {
    // Kiểm tra độ dài các đoạn có quy luật không
    const oddIndexSegments = segments.filter((_, idx) => idx % 2 === 1);
    const evenIndexSegments = segments.filter((_, idx) => idx % 2 === 0);
    
    const oddAvgLength = oddIndexSegments.reduce((sum, s) => sum + s.count, 0) / oddIndexSegments.length;
    const evenAvgLength = evenIndexSegments.reduce((sum, s) => sum + s.count, 0) / evenIndexSegments.length;
    
    const oddDeviation = oddIndexSegments.reduce((sum, s) => sum + Math.abs(s.count - oddAvgLength), 0) / oddIndexSegments.length;
    const evenDeviation = evenIndexSegments.reduce((sum, s) => sum + Math.abs(s.count - evenAvgLength), 0) / evenIndexSegments.length;
    
    // Quy luật rõ ràng: độ lệch thấp và độ dài trung bình khác nhau
    if (oddDeviation < 1 && evenDeviation < 1 && Math.abs(oddAvgLength - evenAvgLength) > 1) {
      patternedBreakScore = Math.min(1, 0.6 + (1 - (oddDeviation + evenDeviation) / 2) * 0.4);
    }
    
    // Phát hiện xu hướng tăng/giảm dần
    const recentSegments = segments.slice(-4);
    if (recentSegments.length >= 3) {
      let increasing = true;
      let decreasing = true;
      
      for (let i = 1; i < recentSegments.length; i++) {
        if (recentSegments[i].count <= recentSegments[i-1].count) {
          increasing = false;
        }
        if (recentSegments[i].count >= recentSegments[i-1].count) {
          decreasing = false;
        }
      }
      
      if (increasing || decreasing) {
        patternedBreakScore = Math.max(patternedBreakScore, 0.7);
      }
    }
  }
  patternScores.cau_gay_quy_luat = patternedBreakScore;
  
  // 5. Cầu gãy không quy luật
  let unpatterneDeporeakScore = 0;
  if (segments.length >= 3 && patternedBreakScore < 0.4 && fibonacciScore < 0.4 && alternatingScore < 0.4) {
    // Cầu gãy nhưng không có quy luật rõ ràng
    unpatterneDeporeakScore = 0.5 + Math.min(0.5, (segments.length - 3) * 0.1);
  }
  patternScores.cau_gay_khong_quy_luat = unpatterneDeporeakScore;
  
  // 6. Kiểm tra mẫu dựa trên tỉ lệ vàng (phi)
  let phiPatternScore = 0;
  if (segments.length >= 4) {
    // Kiểm tra tỉ lệ giữa các đoạn với tỉ lệ vàng
    let phiMatches = 0;
    let comparisons = 0;
    
    for (let i = 1; i < segments.length; i++) {
      const ratio = segments[i].count / Math.max(1, segments[i-1].count);
      if (Math.abs(ratio - PHI) < 0.3 || Math.abs(ratio - GOLDEN_RATIO) < 0.3) {
        phiMatches++;
      }
      comparisons++;
    }
    
    phiPatternScore = comparisons > 0 ? phiMatches / comparisons : 0;
    
    // Tăng cường điểm nếu các đoạn gần đây tuân theo tỉ lệ vàng
    if (segments.length >= 3) {
      const recentRatio = segments[segments.length-1].count / Math.max(1, segments[segments.length-2].count);
      if (Math.abs(recentRatio - PHI) < 0.2 || Math.abs(recentRatio - GOLDEN_RATIO) < 0.2) {
        phiPatternScore = Math.min(1, phiPatternScore + 0.2);
      }
    }
  }
  patternScores.cau_phi = phiPatternScore;
  
  // 7. Kiểm tra cầu trộn (cầu có độ dài đoạn tăng dần hoặc giảm dần)
  let mixedPatternScore = 0;
  if (segments.length >= 4) {
    const recentSegments = segments.slice(-5);
    
    // Kiểm tra xu hướng biến đổi của độ dài
    const consecutive = recentSegments.reduce((acc, segment, i) => {
      if (i === 0) return acc;
      const prev = recentSegments[i-1];
      
      // Đếm số lần chuyển đổi tăng/giảm
      if ((prev.count < segment.count && acc.trend !== 'increasing') ||
          (prev.count > segment.count && acc.trend !== 'decreasing')) {
        acc.changes++;
        acc.trend = prev.count < segment.count ? 'increasing' : 'decreasing';
      }
      
      return acc;
    }, { changes: 0, trend: '' });
    
    // Nếu có nhiều sự thay đổi (tăng->giảm->tăng) => cầu trộn
    if (consecutive.changes >= 2) {
      mixedPatternScore = Math.min(1, 0.4 + consecutive.changes * 0.15);
    }
  }
  patternScores.cau_tron = mixedPatternScore;
  
  // 8. Cầu biến đổi (độ dài thay đổi liên tục)
  let transformingPatternScore = 0;
  if (segments.length >= 5) {
    const recentLengths = segments.slice(-6).map(s => s.count);
    
    // Tính số lượng thay đổi giữa các đoạn kề nhau
    let changes = 0;
    for (let i = 1; i < recentLengths.length; i++) {
      if (Math.abs(recentLengths[i] - recentLengths[i-1]) >= 2) {
        changes++;
      }
    }
    
    if (changes >= 3) {
      transformingPatternScore = Math.min(1, 0.4 + changes * 0.12);
    }
  }
  patternScores.cau_bien_doi = transformingPatternScore;
  
  // Xác định mẫu chính dựa trên điểm cao nhất
  const patternMap: Record<string, string> = {
    'cau_dai': `Cầu dài ${lastValue}`,
    'cau_xen_ke': 'Cầu xen kẽ',
    'cau_fibonacci': 'Cầu Fibonacci',
    'cau_gay_quy_luat': 'Cầu gãy có quy luật',
    'cau_gay_khong_quy_luat': 'Cầu gãy không quy luật',
    'cau_phi': 'Cầu tỉ lệ vàng',
    'cau_tron': 'Cầu trộn',
    'cau_bien_doi': 'Cầu biến đổi'
  };
  
  // Tìm mẫu có điểm cao nhất
  let highestScore = 0;
  let dominantPattern = 'cau_gay_khong_quy_luat';  // Mặc định
  
  Object.entries(patternScores).forEach(([pattern, score]) => {
    if (score > highestScore) {
      highestScore = score;
      dominantPattern = pattern;
    }
  });
  
  // Xác định các mẫu phụ (có điểm cao hơn 0.4)
  const secondaryPatterns = Object.entries(patternScores)
    .filter(([pattern, score]) => score > 0.4 && pattern !== dominantPattern)
    .map(([pattern]) => patternMap[pattern]);
  
  return {
    patternType: patternMap[dominantPattern],
    patternStrength: highestScore,
    secondaryPatterns,
    patternScores
  };
}

/**
 * Phân tích điểm bẻ cầu chi tiết với nhiều chỉ số hơn
 */
export function analyzeEnhancedBreakpoint(
  sequence: SequenceValue[],
  segments: Array<{value: SequenceValue, count: number, startIndex: number}>
): {
  shouldBreak: boolean;
  optimalPoint: boolean;
  breakScore: number;
  breakWeight: number;
  fibonacciAlignment: number;
  dominantValue: SequenceValue | null;
  xingXangIndex: number;
  confidence: number;
} {
  if (sequence.length < 5) {
    return {
      shouldBreak: false,
      optimalPoint: false,
      breakScore: 0,
      breakWeight: 0,
      fibonacciAlignment: 0,
      dominantValue: null,
      xingXangIndex: 0,
      confidence: 0
    };
  }
  
  // Độ dài của cầu hiện tại
  const lastValue = sequence[sequence.length - 1];
  let currentStreak = 1;
  for (let i = sequence.length - 2; i >= 0; i--) {
    if (sequence[i] === lastValue) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // CHUẨN ĐOÁN CAO CẤP: Phân tích xu hướng trượt
  // Tính độ lệch trung bình giữa các đoạn kề nhau
  const adjacentRatio: number[] = [];
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].value !== segments[i-1].value) {
      adjacentRatio.push(segments[i].count / Math.max(1, segments[i-1].count));
    }
  }
  
  // Tính trung bình và phương sai của tỉ lệ
  const avgRatio = adjacentRatio.length > 0 
    ? adjacentRatio.reduce((sum, r) => sum + r, 0) / adjacentRatio.length 
    : 1;
  
  const ratioVariance = adjacentRatio.length > 0
    ? adjacentRatio.reduce((sum, r) => sum + Math.pow(r - avgRatio, 2), 0) / adjacentRatio.length
    : 0;
  
  // Các đoạn có xu hướng ngắn dần hay dài ra?
  const recentRatios = adjacentRatio.slice(-Math.min(5, adjacentRatio.length));
  const recentAvgRatio = recentRatios.length > 0
    ? recentRatios.reduce((sum, r) => sum + r, 0) / recentRatios.length
    : 1;
  
  // Xác định xu hướng mất ổn định
  const isBecomingUnstable = ratioVariance > 0.5 || Math.abs(recentAvgRatio - 1) > 0.3;
  
  // PHÂN TÍCH KẾT CẤU CÂU: Mẫu XING-XANG
  // Xác định vị trí trong chu kỳ XING-XANG (nếu có)
  let hasXingXangPattern = false;
  let xingXangPosition = 0;
  
  if (segments.length >= 6) {
    // Lấy 6 cầu gần nhất để phân tích
    const recentSegments = segments.slice(-6);
    
    // Kiểm tra mẫu T-X-T-X-T-X hoặc X-T-X-T-X-T với độ dài tương đối giống nhau
    let isAlternating = true;
    for (let i = 1; i < recentSegments.length; i++) {
      if (recentSegments[i].value === recentSegments[i-1].value) {
        isAlternating = false;
        break;
      }
    }
    
    if (isAlternating) {
      // Kiểm tra độ chênh lệch về độ dài giữa các đoạn
      const segLengths = recentSegments.map(s => s.count);
      const avgLength = segLengths.reduce((sum, len) => sum + len, 0) / segLengths.length;
      const maxDeviation = Math.max(...segLengths.map(len => Math.abs(len - avgLength) / avgLength));
      
      // Nếu độ chênh lệch < 50% thì coi là mẫu XING-XANG
      if (maxDeviation < 0.5) {
        hasXingXangPattern = true;
        xingXangPosition = recentSegments.length;
      }
    }
  }
  
  // PHÂN TÍCH XU HƯỚNG MẠNH (MOMENTUM)
  // Xác định xem có xu hướng mạnh của T hoặc X không
  const tSegments = segments.filter(s => s.value === 'T');
  const xSegments = segments.filter(s => s.value === 'X');
  
  const avgTLength = tSegments.length > 0 
    ? tSegments.reduce((sum, s) => sum + s.count, 0) / tSegments.length 
    : 0;
    
  const avgXLength = xSegments.length > 0 
    ? xSegments.reduce((sum, s) => sum + s.count, 0) / xSegments.length 
    : 0;
  
  const dominantValue: SequenceValue | null = 
    avgTLength > avgXLength * 1.5 ? 'T' :
    avgXLength > avgTLength * 1.5 ? 'X' : null;
  
  const isTrendReversal = dominantValue !== null && lastValue !== dominantValue && currentStreak >= 3;
  
  // Phân tích các cầu đứt quãng
  const recentSegLengths = segments.slice(-5).map(s => s.count);
  const isBreakingLongerSegments = recentSegLengths.length >= 3 && 
    recentSegLengths[recentSegLengths.length-1] > 
    recentSegLengths[recentSegLengths.length-2] + 
    recentSegLengths[recentSegLengths.length-3];
  
  // Chỉ số Fibonacci và hằng số toán học cải tiến
  // Kiểm tra các điểm bẻ cầu tối ưu dựa trên các hằng số toán học
  const exactFibMatch = FIBONACCI.includes(currentStreak);
  const nearFibMatch = FIBONACCI.some(f => Math.abs(currentStreak - f) <= 1);
  const isFibonacciBreakpoint = exactFibMatch || nearFibMatch;
  
  // Tính điểm phù hợp Fibonacci
  let fibonacciAlignment = 0;
  if (exactFibMatch) {
    fibonacciAlignment = 1.0;
  } else if (nearFibMatch) {
    // Tìm số Fibonacci gần nhất và tính độ phù hợp
    const closestFib = FIBONACCI.reduce((closest, fib) => 
      Math.abs(fib - currentStreak) < Math.abs(closest - currentStreak) ? fib : closest, FIBONACCI[0]);
    fibonacciAlignment = 1 - Math.abs(closestFib - currentStreak) / closestFib;
  }
  
  // Kiểm tra tỉ lệ vàng theo nhiều cách
  const isGoldenRatioBreakpoint = 
    Math.abs(currentStreak - Math.round(segments.length * GOLDEN_RATIO)) <= 1 ||
    Math.abs(currentStreak - Math.round(segments.length * PHI)) <= 1 ||
    Math.abs(currentStreak / Math.max(1, avgTLength + avgXLength) - PHI) <= 0.2;
  
  const isPiBreakpoint = Math.abs(currentStreak - Math.round(PI * 2)) <= 1;
  const isEulerBreakpoint = Math.abs(currentStreak - Math.round(EULER * 2)) <= 1;
  
  // Phân tích thống kê các cầu trước đó
  const streakLengths = segments.map(s => s.count);
  const avgStreakLength = streakLengths.reduce((sum, len) => sum + len, 0) / Math.max(1, streakLengths.length);
  
  // Cải tiến: phân tích xu hướng theo giá trị
  const sameValueStreaks = segments
    .filter(s => s.value === lastValue)
    .map(s => s.count);
  
  // Nếu chưa có cầu cùng giá trị -> lấy trung bình
  const maxStreakSameValue = sameValueStreaks.length > 0 
    ? Math.max(...sameValueStreaks) 
    : Math.round(avgStreakLength);
  
  // Kiểm tra tỉ lệ hiện tại so với cầu dài nhất cùng loại
  const currentToMaxRatio = currentStreak / Math.max(1, maxStreakSameValue);
  
  // Các điều kiện bẻ cầu với trọng số khác nhau
  const breakConditions = [
    // Dựa trên thống kê
    { condition: currentStreak >= avgStreakLength * 1.5, weight: 0.8 }, // Cầu hiện tại dài hơn nhiều so với trung bình
    { condition: currentToMaxRatio >= 0.8, weight: 0.7 }, // Cầu hiện tại tiệm cận cầu dài nhất cùng giá trị
    { condition: currentStreak >= 5, weight: 0.6 }, // Cầu đủ dài để xem xét bẻ
    
    // Dựa trên hằng số toán học
    { condition: exactFibMatch, weight: 0.9 }, // Khớp chính xác với số Fibonacci 
    { condition: nearFibMatch, weight: 0.7 }, // Gần với số Fibonacci
    { condition: isGoldenRatioBreakpoint, weight: 0.75 }, // Cầu ở tỷ lệ vàng
    { condition: isPiBreakpoint || isEulerBreakpoint, weight: 0.6 }, // Cầu ở hằng số toán học khác
    
    // Dựa trên phân tích động lực học và cấu trúc
    { condition: isBecomingUnstable, weight: 0.8 }, // Xu hướng mất ổn định
    { condition: hasXingXangPattern && xingXangPosition >= 4, weight: 0.85 }, // Đang ở cuối mẫu XING-XANG
    { condition: isTrendReversal, weight: 0.75 }, // Cầu đang trái ngược với xu hướng chính
    { condition: isBreakingLongerSegments, weight: 0.7 }, // Cầu đang tích lũy động lực đứt quãng
    
    // Xem xét độ dài tuyệt đối
    { condition: currentStreak >= 8, weight: 0.95 }, // Cầu rất dài -> khả năng đổi rất cao
  ];
  
  // Tính điểm bẻ cầu theo trọng số
  const totalWeight = breakConditions.reduce((sum, cond) => sum + cond.weight, 0);
  const weightedScore = breakConditions.reduce((sum, cond) => 
    sum + (cond.condition ? cond.weight : 0), 0);
  
  const breakScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  
  // Cải tiến thông minh hơn cho quyết định bẻ cầu
  // Tăng ngưỡng cho cầu ngắn, giảm ngưỡng cho cầu dài
  let dynamicThreshold = 0.5;
  if (currentStreak <= 3) dynamicThreshold = 0.6; // Cầu ngắn -> cần điểm cao hơn mới bẻ
  else if (currentStreak >= 7) dynamicThreshold = 0.4; // Cầu dài -> dễ bẻ hơn
  
  const shouldBreak = breakScore > dynamicThreshold;
  const optimalPoint = breakScore > 0.7;
  
  // Điều chỉnh độ tin cậy dựa trên độ dài cầu và điểm số
  let confidence = 0.7 + (breakScore * 0.3); // 0.7 to 1.0 range
  
  // Điều chỉnh độ tin cậy theo độ dài cầu
  if (currentStreak >= 8) confidence = Math.min(0.98, confidence + 0.1);
  else if (currentStreak <= 2) confidence = Math.max(0.7, confidence - 0.1);
  
  // Chỉ số XING-XANG (mẫu xen kẽ)
  const xingXangIndex = hasXingXangPattern ? xingXangPosition / 6 : 0;
  
  return {
    shouldBreak,
    optimalPoint,
    breakScore: parseFloat(breakScore.toFixed(2)),
    breakWeight: weightedScore,
    fibonacciAlignment,
    dominantValue,
    xingXangIndex,
    confidence
  };
}

/**
 * Phân tích toàn diện cầu với độ chính xác siêu cao
 */
export function performEnhancedCauAnalysis(sequence: SequenceValue[]): EnhancedCauAnalysisResult {
  if (sequence.length < 5) {
    return {
      prediction: null,
      confidence: 0,
      streakLength: 0,
      breakProbability: 0,
      patternType: "Không đủ dữ liệu",
      patternTrend: "early",
      detailedAnalysis: {
        oscillationRate: 0,
        streakQuality: 0,
        breakStrength: 0,
        patternStrength: 0,
        optimalBreakPoint: false,
        fibonacciAlignment: 0,
        xingXangIndex: 0,
        adaptability: 0,
        dominantValue: null,
        patternMaturity: 0
      },
      patterns: {
        detectedPatterns: [],
        patternScores: {}
      }
    };
  }
  
  // Chia chuỗi thành các đoạn
  const segments = segmentSequence(sequence);
  
  // Phân tích mẫu cầu nâng cao
  const patternAnalysis = detectAdvancedCauPattern(sequence, segments);
  
  // Phân tích điểm bẻ cầu
  const breakpointAnalysis = analyzeEnhancedBreakpoint(sequence, segments);
  
  // Tính tỉ lệ dao động
  let oscillationCount = 0;
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i-1]) {
      oscillationCount++;
    }
  }
  const oscillationRate = oscillationCount / (sequence.length - 1);
  
  // Phân tích cầu hiện tại
  const lastValue = sequence[sequence.length - 1];
  let currentStreak = 1;
  for (let i = sequence.length - 2; i >= 0; i--) {
    if (sequence[i] === lastValue) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Tính chất lượng của cầu (càng gần 1 càng đáng tin cậy)
  const streakQuality = Math.min(1, (1 + Math.log(currentStreak) / Math.log(10)) / 2);
  
  // Xác định dự đoán và độ tin cậy
  let prediction: SequenceValue | null;
  let confidence: number;
  
  if (breakpointAnalysis.shouldBreak) {
    // Nên bẻ cầu
    prediction = lastValue === 'T' ? 'X' : 'T';
    confidence = breakpointAnalysis.confidence;
  } else {
    // Nên theo cầu
    prediction = lastValue;
    confidence = 0.5 + (streakQuality * 0.5);
  }
  
  // Điều chỉnh dựa trên mẫu đặc biệt
  if (patternAnalysis.patternType === "Cầu xen kẽ") {
    prediction = lastValue === 'T' ? 'X' : 'T';
    confidence = Math.max(confidence, 0.85);
  } else if (patternAnalysis.patternType === `Cầu dài ${lastValue}`) {
    if (currentStreak >= 8) {
      // Cầu quá dài, có thể sẽ bẻ
      prediction = lastValue === 'T' ? 'X' : 'T';
      confidence = 0.7 + (Math.min(currentStreak, 15) - 8) * 0.02;
    } else {
      // Cầu vẫn đang mạnh
      prediction = lastValue;
      confidence = 0.7 + (currentStreak * 0.03);
    }
  } else if (patternAnalysis.patternType === "Cầu Fibonacci") {
    // Sử dụng phân tích Fibonacci để dự đoán
    const fibScore = breakpointAnalysis.fibonacciAlignment;
    if (fibScore > 0.8 && currentStreak >= 5) {
      // Nếu đang ở điểm Fibonacci cao - nên bẻ cầu
      prediction = lastValue === 'T' ? 'X' : 'T';
      confidence = 0.7 + (fibScore * 0.3);
    }
  } else if (patternAnalysis.patternType === "Cầu tỉ lệ vàng") {
    // Dự đoán dựa trên tỉ lệ vàng
    if (breakpointAnalysis.breakScore > 0.6) {
      prediction = lastValue === 'T' ? 'X' : 'T';
      confidence = Math.max(confidence, 0.85);
    }
  }
  
  // Tính độ thích ứng của mẫu (adaptability)
  const adaptability = Math.min(1, 0.3 + patternAnalysis.patternStrength * 0.3 + (1 - oscillationRate) * 0.4);
  
  // Tính mức độ trưởng thành của mẫu (càng cao càng ổn định)
  const patternMaturity = Math.min(1, segments.length / 10);
  
  // Xác định xu hướng của mẫu
  let patternTrend: "stable" | "unstable" | "transitioning" | "early" = "stable";
  
  if (segments.length < 5) {
    patternTrend = "early";
  } else if (oscillationRate > 0.7) {
    patternTrend = "unstable";
  } else if (breakpointAnalysis.breakScore > 0.7) {
    patternTrend = "transitioning";
  }
  
  // Điều chỉnh dự đoán cho mẫu đặc biệt
  if (breakpointAnalysis.xingXangIndex > 0.8) {
    prediction = lastValue === 'T' ? 'X' : 'T';
    confidence = Math.max(confidence, 0.9);
  }
  
  // Nâng cao độ tin cậy cho các trường hợp rõ ràng
  if (confidence >= 0.9) {
    confidence = Math.min(0.99, confidence + 0.05);
  }
  
  // Tổng hợp các mẫu phát hiện được
  const detectedPatterns = [
    patternAnalysis.patternType,
    ...patternAnalysis.secondaryPatterns
  ];
  
  return {
    prediction,
    confidence,
    streakLength: currentStreak,
    breakProbability: breakpointAnalysis.breakScore,
    patternType: patternAnalysis.patternType,
    patternTrend,
    detailedAnalysis: {
      oscillationRate,
      streakQuality,
      breakStrength: breakpointAnalysis.breakScore,
      patternStrength: patternAnalysis.patternStrength,
      optimalBreakPoint: breakpointAnalysis.optimalPoint,
      fibonacciAlignment: breakpointAnalysis.fibonacciAlignment,
      xingXangIndex: breakpointAnalysis.xingXangIndex,
      adaptability,
      dominantValue: breakpointAnalysis.dominantValue,
      patternMaturity
    },
    patterns: {
      detectedPatterns,
      patternScores: patternAnalysis.patternScores
    }
  };
}