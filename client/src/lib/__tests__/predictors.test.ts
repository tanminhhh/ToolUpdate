import { describe, it, expect } from 'vitest';
import { getCurrentMarkovPrediction } from '../predictors';

// Define SequenceValue type directly to avoid import issues
type SequenceValue = "T" | "X";

describe('getCurrentMarkovPrediction', () => {
  // Test với chuỗi quá ngắn
  it('should return null prediction with low sequence length', () => {
    const sequence: SequenceValue[] = ['T', 'X', 'T'];
    const result = getCurrentMarkovPrediction(sequence);
    
    expect(result.prediction).toBeNull();
    expect(result.confidence).toBeCloseTo(0.641);
  });

  // Test với chuỗi có mẫu lặp lại rõ ràng
  it('should predict continuation of strong pattern', () => {
    // Tạo một chuỗi T-X lặp lại
    const repeatingSequence: SequenceValue[] = ['T', 'X', 'T', 'X', 'T', 'X', 'T', 'X', 'T', 'X', 'T'];
    const result = getCurrentMarkovPrediction(repeatingSequence);
    
    // Với mẫu lặp lại rõ ràng T-X-T-X-..., dự đoán tiếp theo phải là X
    expect(result.prediction).toBe('X');
    expect(result.confidence).toBeGreaterThan(0.7); // Độ tin cậy phải cao vì mẫu rõ ràng
  });

  // Test với chuỗi dài toàn T
  it('should recognize long streaks and predict a break', () => {
    const longStreakSequence: SequenceValue[] = Array(15).fill('T');
    const result = getCurrentMarkovPrediction(longStreakSequence);
    
    // Với chuỗi dài toàn T, thuật toán nên dự đoán sẽ đổi sang X
    expect(result.prediction).toBe('X');
    expect(result.confidence).toBeGreaterThan(0.65);
  });

  // Test với chuỗi thay đổi liên tục (không có mẫu rõ ràng)
  it('should handle random-like sequences with lower confidence', () => {
    const randomSequence: SequenceValue[] = ['T', 'X', 'X', 'T', 'X', 'T', 'T', 'X', 'X', 'X', 'T', 'T'];
    const result = getCurrentMarkovPrediction(randomSequence);
    
    // Dự đoán có thể T hoặc X, nhưng độ tin cậy không nên quá cao
    expect(result.confidence).toBeLessThan(0.95);
  });

  // Test với chuỗi có một sự thay đổi đột ngột
  it('should detect trend changes', () => {
    // Chuỗi bắt đầu với nhiều T, sau đó chuyển sang X
    const changingTrendSequence: SequenceValue[] = ['T', 'T', 'T', 'T', 'T', 'T', 'X', 'X', 'X'];
    const result = getCurrentMarkovPrediction(changingTrendSequence);
    
    // Nên dự đoán tiếp tục là X vì đó là xu hướng mới
    expect(result.prediction).toBe('X');
  });
});