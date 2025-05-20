import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import AnimatedOrbHeroBG from './AnimatedOrbHeroBG';

export default function HeroSection() {
  const heroRef = useRef();
  const [showOrb, setShowOrb] = useState(true);

  useEffect(() => {
    const obs = new window.IntersectionObserver(
      ([entry]) => setShowOrb(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          minHeight: { xs: '90vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          zIndex: 1,
          background: 'transparent',
          pt: { xs: 14, md: 22 },
          pb: { xs: 8, md: 14 },
          overflow: 'hidden',
        }}
      >
      <AnimatedOrbHeroBG
        width={480}
        height={480}
        zIndex={1} // Above background (0) but below navbar (1301)
        visible={showOrb}
        // When hero is not visible, trigger dispersal (handled in AnimatedOrbHeroBG)
        disperse={!showOrb}
        style={{
          opacity: 0.85,
          position: 'absolute',
          pointerEvents: 'none',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
        sx={{
          right: 0,
          top: 0,
          left: 0,
          bottom: 0,
        }}
      />
      <Container maxWidth="md" sx={{ mt: { xs: 20, md: 24 } }}>
  <Typography
    variant="h1"
    sx={{
      fontFamily: "'Space Grotesk', 'Montserrat Alternates', Arial, sans-serif",
      fontWeight: 800,
      fontSize: { xs: '2.9rem', md: '4.2rem' },
      mb: 2.5,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
      background: 'linear-gradient(92deg, #00ffc6 0%, #3a86ff 40%, #7B42F6 80%, #fff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 6px 32px rgba(58,134,255,0.14), 0 1px 0 #00ffc6',
      position: 'relative',
      zIndex: 2,
      animation: 'gradientMove 5s ease-in-out infinite alternate',
      '@keyframes gradientMove': {
        '0%': { backgroundPosition: '0% 50%' },
        '100%': { backgroundPosition: '100% 50%' }
      }
    }}
  >
    The Future of <Box component="span" sx={{
      background: 'linear-gradient(90deg, #fff 10%, #00ffc6 50%, #7B42F6 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 900,
      letterSpacing: '-0.01em',
      textShadow: '0 2px 12px #00ffc688, 0 1px 0 #fff',
      px: 0.5,
      animation: 'shine 2.5s linear infinite alternate',
      '@keyframes shine': {
        '0%': { filter: 'brightness(1.1)' },
        '100%': { filter: 'brightness(1.4)' }
      }
    }}>Sales Intelligence</Box>
  </Typography>
  <Typography
    variant="h6"
    sx={{
      fontFamily: "'DM Sans', Arial, sans-serif",
      color: 'rgba(255,255,255,0.92)',
      mb: 5,
      maxWidth: 600,
      mx: 'auto',
      fontWeight: 400,
      fontSize: { xs: '1.18rem', md: '1.33rem' },
      letterSpacing: '0.03em',
      background: 'linear-gradient(90deg, #b6b6c8 0%, #00ffc6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      position: 'relative',
      zIndex: 2,
    }}
  >
    Real-time insights. Instant automation. Unmatched speed.
  </Typography>
  <Button
    variant="contained"
    size="large"
    href="#schedule"
    sx={{
      px: 6,
      py: 2.1,
      fontWeight: 800,
      fontFamily: "'Space Grotesk', 'Montserrat Alternates', Arial, sans-serif",
      fontSize: { xs: '1.14rem', md: '1.22rem' },
      borderRadius: '30px',
      background: 'linear-gradient(90deg, #00ffc6 0%, #7B42F6 100%)',
      boxShadow: '0 4px 24px rgba(123,66,246,0.18), 0 1.5px 18px #00ffc633',
      color: '#fff',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      transition: 'all 0.22s',
      mt: 2,
      position: 'relative',
      zIndex: 2,
      '&:hover': {
        background: 'linear-gradient(270deg, #7B42F6 0%, #00ffc6 100%)',
        boxShadow: '0 8px 36px rgba(123,66,246,0.22), 0 2px 24px #00ffc655',
        color: '#fff',
        transform: 'translateY(-2px) scale(1.045)'
      }
    }}
  >
    Get Started →
  </Button>
</Container>
      </Box>

      {/* Data Insights Section - Seamless Transition */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, rgba(24,24,43,0.6) 0%, rgba(24,24,43,0.95) 100%)',
          pt: { xs: 10, md: 18 },
          pb: { xs: 10, md: 18 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing orb decoration for continuous visual effect */}
        <Box
          sx={{
            position: 'absolute',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,66,246,0.15) 0%, rgba(0,255,198,0.05) 50%, rgba(24,24,43,0) 70%)',
            filter: 'blur(60px)',
            top: '-10%',
            right: '-5%',
            zIndex: 0,
            animation: 'pulse 8s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.4, transform: 'scale(1)' },
              '50%': { opacity: 0.6, transform: 'scale(1.2)' },
              '100%': { opacity: 0.4, transform: 'scale(1)' }
            }
          }}
        />
        
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h3"
              sx={{
                fontFamily: "'Space Grotesk', 'Montserrat Alternates', Arial, sans-serif",
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                background: 'linear-gradient(90deg, #00ffc6 0%, #3a86ff 70%, #7B42F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 20px rgba(0,255,198,0.2)',
              }}
            >
              Instant Insights That Sell
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="center">
            {/* Visual divider element */}
            <Box
              sx={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(0,255,198,0.1) 0%, rgba(123,66,246,0.4) 50%, rgba(0,255,198,0.1) 100%)',
                mb: 8,
                mx: 'auto',
                maxWidth: '85%',
                boxShadow: '0 0 10px rgba(123,66,246,0.3)',
              }}
            />
            
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Space Grotesk', Arial, sans-serif",
                    fontWeight: 600,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    mb: 3,
                    color: '#fff',
                  }}
                >
                  Real-time Data Access
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'DM Sans', Arial, sans-serif",
                    color: 'rgba(255,255,255,0.9)',
                    mb: 3,
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    lineHeight: 1.6,
                  }}
                >
                  As a sales rep, you deserve the world's most powerful competitive edge. RepSpheres connects you to the most comprehensive dataset in the dental and aesthetic industries, giving you instant access to crucial market insights.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '250px', md: '320px' },
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,255,198,0.1)',
                  transform: { md: 'perspective(1000px) rotateY(-6deg) rotateX(2deg)' },
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: { md: 'perspective(1000px) rotateY(-3deg) rotateX(1deg) scale(1.02)' },
                  },
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(58,134,255,0.2) 0%, rgba(123,66,246,0.4) 100%)',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: 3,
                  }}
                >
                  {/* Simulated data points as background decoration */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: Math.random() * 5 + 2,
                        height: Math.random() * 5 + 2,
                        borderRadius: '50%',
                        background: i % 3 === 0 ? '#00ffc6' : i % 3 === 1 ? '#3a86ff' : '#7B42F6',
                        opacity: Math.random() * 0.4 + 0.2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${Math.random() * 8 + 8}s ease-in-out infinite`,
                        '@keyframes float': {
                          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                          '50%': { transform: `translateY(${Math.random() * 15 - 8}px) translateX(${Math.random() * 15 - 8}px)` },
                        }
                      }}
                    />
                  ))}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                    background: 'rgba(24,24,43,0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: 2.5,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        fontFamily: "'DM Sans', Arial, sans-serif",
                        fontWeight: 500,
                        textAlign: 'center',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        mb: 1.5,
                      }}
                    >
                      Available Data
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                      {['Practice Insights', 'Physician Data', 'Patient Demographics', 'Sales Metrics', 'Competitor Info'].map((feature, i) => (
                        <Box key={i} sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          backgroundColor: 'rgba(24,24,43,0.6)',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.7,
                          border: '1px solid',
                          borderColor: i % 2 === 0 ? 'rgba(0,255,198,0.3)' : 'rgba(58,134,255,0.3)',
                        }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255,255,255,0.9)',
                              fontFamily: "'DM Sans', Arial, sans-serif",
                              fontSize: '0.8rem',
                              fontWeight: 500,
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
