import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the AuthContext
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

// Mock IntersectionObserver which isn't available in the test environment
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    // Simulate an intersection
    this.callback([{ isIntersecting: true }]);
  }

  unobserve() {}
  disconnect() {}
}

// Set up the mock before the tests
beforeAll(() => {
  // Save original
  const originalIntersectionObserver = window.IntersectionObserver;
  
  // Mock both global and window.IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver
  });
  
  // Mock ResizeObserver too which might be used
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
});

// Skip cleanup to avoid issues
// The test environment will be reset between test files anyway

test('renders the app without crashing', () => {
  render(<App />);
  // Test that the app renders without crashing
  expect(document.body).toBeInTheDocument();
});
