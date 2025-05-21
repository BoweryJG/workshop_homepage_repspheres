import { render, screen } from '@testing-library/react';
import SignupPage from './SignupPage';

test('renders the signup page', () => {
  render(<SignupPage />);
  const heading = screen.getByRole('heading', { name: /sign up/i });
  expect(heading).toBeInTheDocument();
});
