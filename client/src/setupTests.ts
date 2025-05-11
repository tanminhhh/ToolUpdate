/**
 * Setup file cho test environment
 * Sẽ được tự động import trước khi test chạy
 */

// Import những polyfill hoặc global mocks cần thiết

// Suppress console warnings and errors during tests
// import { vi } from 'vitest';

// Uncomment dòng dưới nếu muốn chặn các log không cần thiết khi test
/*
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('Warning:')) {
      return;
    }
    originalConsoleError(...args);
  };
  console.warn = (...args: any[]) => {
    if (args[0]?.includes?.('Warning:')) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
*/