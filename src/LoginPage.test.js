import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

// Mock the AuthContext
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    signInWithFacebook: jest.fn(),
    signOut: jest.fn(),
    isAdmin: false
  }),
  AuthProvider: ({ children }) => children
}));

test('renders login form with provider buttons', () => {
  render(<LoginPage />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  // Use getAllByRole to handle multiple buttons with similar text
  const googleButtons = screen.getAllByRole('button', { name: /google/i });
  expect(googleButtons.length).toBeGreaterThan(0);
  
  const facebookButtons = screen.getAllByRole('button', { name: /facebook/i });
  expect(facebookButtons.length).toBeGreaterThan(0);
});
