import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import OrbContextProvider from './components/OrbContextProvider';
import Podcasts from './components/Podcasts';
import PodcastHero from './components/PodcastHero';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import { AuthProvider } from './contexts/AuthContext';
import supabase from './supabase';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// Function to format podcast title from filename
const formatPodcastTitle = (filename) => {
  // Remove file extension
  let title = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces
  title = title.replace(/[_-]/g, " ");
  // Capitalize first letter of each word
  title = title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return title;
};

// Function to generate a description based on the title
const generateDescription = (title) => {
  return `An in-depth discussion about ${title}.`;
};

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      // Local podcast files - this would ideally be fetched from the server
      // For now, we'll hardcode the Venus AI podcast and any future podcasts would be added here
      const localEpisodes = [
        {
          id: 'local-1',
          title: 'Venus AI ~ Evolution Products & Market Position',
          description: 'An in-depth discussion about Venus AI\'s evolution, product strategy, and market positioning.',
          url: process.env.PUBLIC_URL + '/podcasts/Venus Ai ~ Evolution Products & Market Position.mp3',
          isLocal: true
        }
        // To add more podcasts, simply copy the MP3 file to the public/podcasts directory
        // and add a new entry here with a unique id, title, description, and url
        // Example:
        // {
        //   id: 'local-2',
        //   title: 'New Podcast Title',
        //   description: 'Description of the new podcast',
        //   url: process.env.PUBLIC_URL + '/podcasts/filename.mp3',
        //   isLocal: true
        // }
      ];
      
      // Set local episodes immediately
      setEpisodes(localEpisodes);
      
      // Try to fetch from Supabase
      try {
        const { data, error } = await supabase.from('podcasts').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          // Combine local episodes with remote episodes
          setEpisodes([...localEpisodes, ...data]);
        }
      } catch (err) {
        console.error('Failed to fetch podcasts from Supabase client', err);
        
        // Try the alternative method with fetch API
        if (SUPABASE_URL && SUPABASE_KEY) {
          try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/podcasts?select=*`, {
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
              },
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.length > 0) {
                // Combine local episodes with remote episodes
                setEpisodes([...localEpisodes, ...data]);
              }
            }
          } catch (fetchErr) {
            console.error('Failed to fetch podcasts with fetch API', fetchErr);
            // Keep the local episodes if both methods fail
          }
        } else {
          console.log('Using local podcast episodes (Supabase URL or Key is missing)');
        }
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <OrbContextProvider>
      <AuthProvider>
        <StarryBackground />
        <NavBar />
        <PodcastHero />
        <Box id="episodes">
          <Podcasts episodes={episodes} />
        </Box>
        <Footer />
        <ThemeToggle />
      </AuthProvider>
    </OrbContextProvider>
  );
}
