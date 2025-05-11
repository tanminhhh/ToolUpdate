import type { SequenceValue } from "@/context/SequenceContext";

export function calculateStreaks(sequence: SequenceValue[]) {
  let currentTaiStreak = 0;
  let maxTaiStreak = 0;
  let currentXiuStreak = 0;
  let maxXiuStreak = 0;

  sequence.forEach(val => {
    if (val === 'T') {
      currentTaiStreak++;
      currentXiuStreak = 0;
      maxTaiStreak = Math.max(maxTaiStreak, currentTaiStreak);
    } else {
      currentXiuStreak++;
      currentTaiStreak = 0;
      maxXiuStreak = Math.max(maxXiuStreak, currentXiuStreak);
    }
  });

  return { tai: maxTaiStreak, xiu: maxXiuStreak };
}

export function calculateAlternationRate(sequence: SequenceValue[]) {
  if (sequence.length <= 1) return 0;
  
  let alternations = 0;
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i-1]) alternations++;
  }
  return (alternations / (sequence.length - 1)) * 100;
}

export function getMarkovProbability(
  sequence: SequenceValue[], 
  current: SequenceValue, 
  next: SequenceValue
) {
  let count = 0;
  let totalTransitions = 0;

  for (let i = 0; i < sequence.length - 1; i++) {
    if (sequence[i] === current) {
      totalTransitions++;
      if (sequence[i + 1] === next) count++;
    }
  }

  return totalTransitions === 0 ? 0.5 : count / totalTransitions;
}

export function getAlternationDescription(rate: number) {
  if (rate >= 75) {
    return "Rất cao - Xu hướng xen kẽ mạnh";
  } else if (rate >= 60) {
    return "Cao - Xu hướng xen kẽ";
  } else if (rate >= 40) {
    return "Trung bình - Cân bằng";
  } else if (rate >= 25) {
    return "Thấp - Xu hướng đơn điệu";
  } else {
    return "Rất thấp - Xu hướng đơn điệu mạnh";
  }
}

export function getTrendDescription(sequence: SequenceValue[]) {
  if (sequence.length < 10) return "Chưa đủ dữ liệu";
  
  const last10 = sequence.slice(-10);
  const taiCount = last10.filter(v => v === 'T').length;
  const taiPercent = (taiCount / last10.length) * 100;
  
  if (taiPercent >= 70) {
    return "Xu hướng TÀI mạnh";
  } else if (taiPercent >= 60) {
    return "Xu hướng TÀI";
  } else if (taiPercent <= 30) {
    return "Xu hướng XỈU mạnh";
  } else if (taiPercent <= 40) {
    return "Xu hướng XỈU";
  } else {
    return "Cân bằng";
  }
}

export function getTrendStrength(sequence: SequenceValue[]) {
  if (sequence.length < 10) return "Chưa đủ dữ liệu";
  
  const last10 = sequence.slice(-10);
  const taiCount = last10.filter(v => v === 'T').length;
  const xiuCount = last10.length - taiCount;
  const diff = Math.abs(taiCount - xiuCount);
  const percent = Math.round((diff / last10.length) * 100);
  
  if (percent >= 40) return "Rất mạnh";
  if (percent >= 20) return "Mạnh";
  if (percent >= 10) return "Trung bình";
  return "Yếu";
}

export function getStabilityScore(sequence: SequenceValue[]) {
  if (sequence.length < 5) return "Chưa đủ dữ liệu";
  
  const alternationRate = calculateAlternationRate(sequence);
  
  if (alternationRate >= 70) return "Thấp";
  if (alternationRate >= 50) return "Trung bình";
  return "Cao";
}
