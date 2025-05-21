import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

test('renders login form with provider buttons', () => {
  render(<LoginPage />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument();
});
