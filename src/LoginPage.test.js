import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

test('renders the login page', () => {
  render(<LoginPage />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});
