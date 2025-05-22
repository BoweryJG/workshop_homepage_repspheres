import { render, screen } from '@testing-library/react';
import SignupPage from './SignupPage';

// Mock the AuthContext
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    signInWithFacebook: jest.fn(),
    signOut: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

test('renders the signup page', () => {
  render(<SignupPage />);
  const heading = screen.getByRole('heading', { name: /sign up/i });
  expect(heading).toBeInTheDocument();
});
