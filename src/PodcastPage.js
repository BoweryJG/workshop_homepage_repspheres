import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import OrbContextProvider from './components/OrbContextProvider';
import Podcasts from './components/Podcasts';
import PodcastHero from './components/PodcastHero';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import supabase from './supabase';

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const { data, error } = await supabase.from('podcasts').select('*');
        if (error) throw error;
        setEpisodes(data || []);
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
