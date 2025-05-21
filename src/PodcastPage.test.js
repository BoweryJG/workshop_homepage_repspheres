import { render, screen } from '@testing-library/react';
import PodcastPage from './PodcastPage';

test('renders podcast title and hides nav podcast link', () => {
  render(<PodcastPage />);
  const titleElement = screen.getByText(/RepSpheres Podcast/i);
  expect(titleElement).toBeInTheDocument();
  const podcastLink = screen.queryByRole('link', { name: /podcast/i });
  expect(podcastLink).toBeNull();
});
