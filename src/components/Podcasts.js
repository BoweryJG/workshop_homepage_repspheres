import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import PodcastsIcon from '@mui/icons-material/Podcasts';

export default function Podcasts({ episodes = [] }) {
  return (
    <Box sx={{ py: 6, background: 'rgba(40, 20, 70, 0.55)', color: '#fff' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', mb: 4 }}>
        <PodcastsIcon sx={{ fontSize: 60, color: 'var(--secondary, #00ffc6)' }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Latest Episodes
        </Typography>
      </Container>
      <Container maxWidth="md">
        {episodes.length === 0 && (
          <Typography align="center" color="text.secondary">
            No episodes available.
          </Typography>
        )}
        {episodes.map((ep) => (
          <Box key={ep.id} sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {ep.title}
            </Typography>
            {ep.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {ep.description}
              </Typography>
            )}
            {ep.url && (
              <Button variant="outlined" href={ep.url} size="small">
                Listen
              </Button>
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
