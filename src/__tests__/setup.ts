// Import jest-dom for DOM testing utilities
import '@testing-library/jest-dom';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn(),
      storage: {
        from: jest.fn(),
      },
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(),
        resetPasswordForEmail: jest.fn(),
      },
    },
  };
});

// Global test setup
beforeAll(() => {
  // Setup any global test environment
});

afterAll(() => {
  // Clean up any global test environment
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
}); 
