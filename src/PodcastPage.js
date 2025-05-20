import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import OrbContextProvider from './components/OrbContextProvider';
import Podcasts from './components/Podcasts';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!SUPABASE_URL || !SUPABASE_KEY) return;
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/podcasts?select=*`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setEpisodes(data);
        }
      } catch (err) {
        console.error('Failed to fetch podcasts', err);
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <OrbContextProvider>
      <StarryBackground />
      <NavBar />
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #7B42F6 0%, #00ffc6 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>
            RepSpheres Podcast
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Insights, interviews and strategies for elite sales reps.
          </Typography>
        </Container>
      </Box>
      <Podcasts episodes={episodes} />
    </OrbContextProvider>
  );
}
