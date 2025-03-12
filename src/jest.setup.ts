// Import jest-dom for DOM testing utilities
import '@testing-library/jest-dom';

// Add custom jest matchers for testing-library
import { expect } from '@jest/globals';

// Extend expect with testing-library matchers
expect.extend({
  // Add any custom matchers here if needed
});

// Global test setup
beforeAll(() => {
  // Setup any global test environment
  // For example, set up a mock for window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

afterAll(() => {
  // Clean up any global test environment
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
}); 
