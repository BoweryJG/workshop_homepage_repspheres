import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import PodcastsIcon from '@mui/icons-material/Podcasts';

export default function PodcastHero() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        textAlign: 'center',
        background: 'linear-gradient(135deg, #7B42F6 0%, #00ffc6 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <PodcastsIcon sx={{ fontSize: { xs: 80, md: 120 }, mb: 2 }} />
        <Typography variant="h2" component="h1" fontWeight={800} gutterBottom>
          RepSpheres Podcast
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
          Insights, interviews and strategies for elite sales teams
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          href="#episodes"
          sx={{
            fontWeight: 700,
            borderRadius: '50px',
            px: 5,
            py: 1.5,
            background: '#18182b',
            '&:hover': {
              background: '#0b0b20',
            },
          }}
        >
          Explore Episodes
        </Button>
      </Container>
    </Box>
  );
}
