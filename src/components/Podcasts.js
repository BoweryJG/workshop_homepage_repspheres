import React, { useState } from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';

export default function Podcasts({ episodes = [] }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const handlePlayPause = (episode) => {
    if (!audioElement || currentlyPlaying?.id !== episode.id) {
      // Create a new audio element if none exists or if switching to a different episode
      if (audioElement) {
        audioElement.pause();
      }
      
      const audio = new Audio(episode.url);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audio.play().then(() => {
        setIsPlaying(true);
        setCurrentlyPlaying(episode);
        setAudioElement(audio);
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      // Toggle play/pause for the current audio
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

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
          <Paper 
            key={ep.id} 
            elevation={3} 
            sx={{ 
              mb: 3, 
              p: 3, 
              textAlign: 'left', 
              background: 'rgba(60, 30, 90, 0.7)',
              border: ep.isLocal ? '1px solid var(--secondary, #00ffc6)' : 'none',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {ep.title}
              {ep.isLocal && (
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 2, 
                    fontSize: '0.7rem', 
                    backgroundColor: 'var(--secondary, #00ffc6)', 
                    color: '#333',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    verticalAlign: 'middle'
                  }}
                >
                  LOCAL
                </Box>
              )}
            </Typography>
            {ep.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {ep.description}
              </Typography>
            )}
            
            {ep.isLocal ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={currentlyPlaying?.id === ep.id && isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  onClick={() => handlePlayPause(ep)}
                  sx={{ 
                    backgroundColor: 'var(--secondary, #00ffc6)', 
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#00d6a4'
                    }
                  }}
                >
                  {currentlyPlaying?.id === ep.id && isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  href={ep.url}
                  download
                  sx={{ 
                    borderColor: 'var(--secondary, #00ffc6)', 
                    color: 'var(--secondary, #00ffc6)',
                    '&:hover': {
                      borderColor: '#00d6a4',
                      backgroundColor: 'rgba(0, 255, 198, 0.1)'
                    }
                  }}
                >
                  Download
                </Button>
              </Box>
            ) : (
              ep.url && (
                <Button 
                  variant="outlined" 
                  href={ep.url} 
                  size="small"
                  sx={{ 
                    borderColor: 'var(--secondary, #00ffc6)', 
                    color: 'var(--secondary, #00ffc6)',
                    '&:hover': {
                      borderColor: '#00d6a4',
                      backgroundColor: 'rgba(0, 255, 198, 0.1)'
                    }
                  }}
                >
                  Listen
                </Button>
              )
            )}
          </Paper>
        ))}
      </Container>
    </Box>
  );
}
