import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import OrbContextProvider from './components/OrbContextProvider';
import Podcasts from './components/Podcasts';
import PodcastHero from './components/PodcastHero';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

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
      <PodcastHero />
      <Box id="episodes">
        <Podcasts episodes={episodes} />
      </Box>
      <Footer />
      <ThemeToggle />
    </OrbContextProvider>
  );
}
