import { render, screen } from '@testing-library/react';
import PodcastPage from './PodcastPage';

// Mock the AuthContext
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    isAdmin: false
  }),
  AuthProvider: ({ children }) => children
}));

// Mock window.location for the test
const originalLocation = window.location;

beforeAll(() => {
  // Save the original window.location
  delete window.location;
  // Set up our mock
  window.location = new URL('https://repspheres.com/podcast.html');
});

afterAll(() => {
  window.location = originalLocation;
});

test('renders podcast title', () => {
  render(<PodcastPage />);
  const titleElement = screen.getByText(/RepSpheres Podcast/i);
  expect(titleElement).toBeInTheDocument();
  // We're just testing that the podcast page renders correctly
  // The podcast link visibility is dependent on the NavBar component's behavior
});
