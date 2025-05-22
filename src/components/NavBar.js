import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import InsightsIcon from '@mui/icons-material/Insights';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import LanguageIcon from '@mui/icons-material/Language';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MemoryIcon from '@mui/icons-material/Memory';
import LogoutIcon from '@mui/icons-material/Logout';
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import { useOrbContext } from './OrbContextProvider';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import InfoModal from './InfoModal';
import AuthModal from './AuthModal';

const ACCENT_COLOR = '#00ffc6';

// Main navigation links
const getNavLinks = (currentUrl) => {
  const links = [
    { 
      key: 'insights',
      label: 'Market Insights', 
      href: 'https://marketdata.repspheres.com/',
      icon: <InsightsIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />,
      highlight: true
    },
    { 
      key: 'workspace',
      label: 'Workspace', 
      href: 'https://workspace.repspheres.com/',
      icon: <DashboardIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />
    },
    { 
      key: 'sphereos',
      label: 'Sphere OS', 
      href: 'https://crm.repspheres.com/',
      icon: <MemoryIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />
    },
    {
      key: 'podcast',
      label: 'Podcast',
      href: '/podcast.html',
      icon: <PodcastsIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />
    },
  ];

  // Show Linguistics link only if not on the linguistics page
  if (!currentUrl.includes('/linguistics')) {
    links.splice(2, 0, {
      key: 'linguistics',
      label: 'Linguistics',
      href: 'https://linguistics.repspheres.com/',
      icon: <LanguageIcon fontSize="small" sx={{ color: ACCENT_COLOR }} />
    });
  }

  // Hide podcast link when already on the podcast page
  if (currentUrl.includes('/podcast.html')) {
    return links.filter((l) => l.key !== 'podcast');
  }

  return links;
};

// More menu items for additional information
const moreMenuItems = [
  { key: 'about', label: 'About RepSpheres' },
  { key: 'contact', label: 'Contact' },
  { key: 'careers', label: 'Careers' },
  { key: 'legal', label: 'Legal' }
];

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [authMenuAnchorEl, setAuthMenuAnchorEl] = React.useState(null);
  const [openInfo, setOpenInfo] = React.useState(null); // which info modal is open
  const [openAuth, setOpenAuth] = React.useState(null); // 'login' or 'signup'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get authentication context
  const { user, loading, signInWithGoogle, signInWithFacebook, signOut } = useAuth();
  
  // Get current URL to determine which page we're on
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Get navigation links based on current page
  const navLinks = getNavLinks(currentUrl);
  
  // Get the gradient colors from context
  const { gradientColors } = useOrbContext();

  // Orb SVG for brand logo with gradient colors
  const orb = (
    <svg width="100%" height="100%" viewBox="0 0 32 32" style={{ filter: 'drop-shadow(0 0 6px #7B42F6AA)' }}>
      <defs>
        <radialGradient id="orbGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={gradientColors.start} />
          <stop offset="100%" stopColor={gradientColors.end} />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#orbGrad)" opacity="0.85" />
      <circle cx="16" cy="16" r="8" fill="#fff" opacity="0.08" />
    </svg>
  );
  
  // Handle drawer toggle
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Handle more menu
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Open information modal from more menu or drawer
  const handleInfoOpen = (key) => {
    handleMenuClose();
    setOpenInfo(key);
  };

  const handleInfoClose = () => {
    setOpenInfo(null);
  };

  const handleAuthOpen = (mode) => {
    setOpenAuth(mode);
  };

  const handleAuthClose = () => {
    setOpenAuth(null);
  };
  
  // Handle auth menu
  const handleAuthMenuOpen = (event) => {
    setAuthMenuAnchorEl(event.currentTarget);
  };

  const handleAuthMenuClose = () => {
    setAuthMenuAnchorEl(null);
  };
  
  const handleSignOut = () => {
    signOut();
    handleAuthMenuClose();
  };
  
  // Styles for different button types
  const buttonBaseStyles = {
    fontWeight: 500,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
    minWidth: 'auto',
    textTransform: 'none',
    borderRadius: 0,
    transition: 'all 0.2s',
  };
  
  const navButtonStyles = {
    ...buttonBaseStyles,
    fontSize: { xs: '0.9rem', sm: '0.95rem' },
    px: { xs: 0.5, sm: 1 },
    py: 0.5,
    mx: { xs: 0.5, sm: 1 },
    color: '#fff',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
  };
  
  const googleButtonStyles = {
    ...buttonBaseStyles,
    fontSize: { xs: '0.85rem', sm: '0.9rem' },
    fontWeight: 500,
    px: { xs: 1.2, sm: 1.5 },
    py: 0.5,
    borderRadius: '16px',
    color: '#212121',
    background: '#ffffff',
    '&:hover': {
      background: '#f1f1f1',
      boxShadow: '0 0 10px rgba(255,255,255,0.5)',
    },
    display: 'flex',
    gap: 1,
  };

  const loginButtonStyles = {
    ...buttonBaseStyles,
    fontSize: { xs: '0.85rem', sm: '0.9rem' },
    fontWeight: 500,
    px: { xs: 1.2, sm: 1.5 },
    py: 0.5,
    border: '1px solid #fff',
    borderRadius: '16px',
    color: '#fff',
    background: 'rgba(255,255,255,0.08)',
    '&:hover': {
      background: 'rgba(255,255,255,0.15)',
      borderColor: '#3a86ff',
    },
  };

  const signupButtonStyles = {
    ...buttonBaseStyles,
    fontSize: { xs: '0.85rem', sm: '0.9rem' },
    fontWeight: 600,
    px: { xs: 1.2, sm: 1.5 },
    py: 0.5,
    ml: { xs: 0.5, sm: 1 },
    borderRadius: '16px',
    color: '#fff',
    background: 'linear-gradient(90deg, #00ffc6 0%, #7B42F6 100%)',
    '&:hover': {
      background: 'linear-gradient(90deg, #5B3CFF 0%, #00ffc6 100%)',
      transform: 'scale(1.03)',
    },
  };
  
  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ 
        width: '260px', 
        p: 2, 
        background: 'rgba(20,14,38,0.96)',
        borderLeft: '2px solid',
        borderImage: 'linear-gradient(180deg, #7B42F6 0%, #00ffc6 100%) 1',
        height: '100%',
        color: '#fff',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* RepSpheres Logo in Drawer */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        mt: 2,
        cursor: 'pointer'
      }} onClick={() => typeof window !== 'undefined' && (window.location.href = 'https://repspheres.com')}>
        <Box sx={{ 
          width: 32, 
          height: 32, 
          mr: 1.5 
        }}>
          {orb}
        </Box>
        <Box sx={{ 
          fontSize: '1.2rem', 
          fontWeight: 800,
          display: 'flex'
        }}>
          <span>Rep</span>
          <Box component="span" sx={{
            background: 'linear-gradient(90deg, #00ffc6 0%, #7B42F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Spheres</Box>
        </Box>
      </Box>

      {/* Navigation Links */}
      <List sx={{ mb: 2 }}>
        {navLinks.map((link) => (
          <ListItem key={link.key} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component="a"
              href={link.href}
              sx={{
                py: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {link.icon}
              </Box>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
      
      {/* More Menu Items */}
      <List>
        {moreMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleInfoOpen(item.key)}
              sx={{
                py: 0.75,
                px: 2,
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            >
              {item.label}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Auth Button */}
      <Box sx={{ mt: 4, px: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={28} sx={{ color: '#fff', opacity: 0.7 }} />
          </Box>
        ) : user ? (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 2,
              p: 1,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)'
            }}>
              {user.user_metadata?.avatar_url ? (
                <Avatar 
                  src={user.user_metadata.avatar_url} 
                  sx={{ width: 40, height: 40, mr: 1.5 }}
                />
              ) : (
                <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: '#7B42F6' }}>
                  <PersonIcon />
                </Avatar>
              )}
              <Box sx={{ overflow: 'hidden' }}>
                <Box sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {user.user_metadata?.full_name || 'User'}
                </Box>
                <Box sx={{ 
                  fontSize: '0.8rem', 
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {user.email}
                </Box>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={signOut}
              startIcon={<LogoutIcon />}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  borderColor: '#fff',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              onClick={() => handleAuthOpen('login')}
              variant="outlined"
              sx={{ ...loginButtonStyles, justifyContent: 'center' }}
            >
              Log In
            </Button>
            <Button
              fullWidth
              onClick={() => handleAuthOpen('signup')}
              variant="contained"
              sx={{ ...signupButtonStyles, ml: 0, justifyContent: 'center' }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
    <AppBar position="sticky" elevation={0} sx={{
      background: 'rgba(24,24,43,0.52)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 6px 24px 0 rgba(123,66,246,0.15)',
      border: '1px solid rgba(123,66,246,0.13)',
      borderBottom: '1px solid rgba(123,66,246,0.10)',
      borderRadius: { xs: '0 0 16px 16px', md: '0 0 24px 24px' },
      mx: 'auto',
      mt: { xs: 0.5, md: 1 },
      width: { xs: 'calc(100% - 10px)', sm: 'calc(100% - 20px)', md: 'calc(100% - 40px)' },
      maxWidth: '1800px',
      overflow: 'hidden', // Ensures nothing extends outside the AppBar
      zIndex: 1200,
      backgroundColor: 'rgba(24,24,43,0.52)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 6px 24px 0 rgba(123,66,246,0.15)',
      border: '1px solid rgba(123,66,246,0.13)',
      borderBottom: '1px solid rgba(123,66,246,0.10)',
    }}>
      <Toolbar sx={{ 
        px: { xs: 1, sm: 2 },
        height: { xs: '60px', sm: '64px' },
        minHeight: { xs: '60px', sm: '64px' }, // Override default Toolbar minHeight
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo Section */}
        <Box 
          component="a" 
          href="https://repspheres.com" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            mr: 1,
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 }
          }}>
            {orb}
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            fontWeight: 800,
            letterSpacing: '0.03em',
          }}>
            <Box component="span">Rep</Box>
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #00ffc6 0%, #7B42F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Spheres</Box>
          </Box>
        </Box>

        {/* Middle Section - Navigation (only on desktop) */}
        {!isMobile && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              px: { sm: 1, md: 2 },
              maxWidth: { sm: '65vw', md: '70vw' },
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}>
              {navLinks.map((link) => (
                <Button
                  key={link.key}
                  component="a"
                  href={link.href}
                  sx={{
                    ...navButtonStyles,
                    // Hide text on smaller screens
                    '& .buttonText': {
                      display: { xs: 'none', sm: 'inline' }
                    }
                  }}
                >
                  <Box sx={{ 
                    mr: { xs: 0, sm: 1 },
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {link.icon}
                  </Box>
                  <Box component="span" className="buttonText">{link.label}</Box>
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Right Section - Auth Buttons & Menu Button */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          ml: 'auto',
          gap: { xs: 0.5, sm: 1 },
        }}>
          {/* Theme Toggle - Subtle but visible */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 1,
            opacity: 0.8,
          }}>
            <ThemeToggle />
          </Box>
          
          {/* Auth Button or User Profile */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            {loading ? (
              <CircularProgress size={24} color="inherit" sx={{ opacity: 0.7 }} />
            ) : user ? (
              <IconButton
                onClick={handleAuthMenuOpen}
                size="small"
                sx={{
                  ml: 0.5,
                  border: '1px solid rgba(255,255,255,0.2)',
                  p: 0.5
                }}
              >
                {user.user_metadata?.avatar_url ? (
                  <Avatar
                    src={user.user_metadata.avatar_url}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <PersonIcon sx={{ color: '#fff' }} />
                )}
              </IconButton>
            ) : (
              <>
                <Button
                  onClick={() => handleAuthOpen('login')}
                  variant="outlined"
                  sx={loginButtonStyles}
                >
                  Log In
                </Button>
                <Button
                  onClick={() => handleAuthOpen('signup')}
                  variant="contained"
                  sx={signupButtonStyles}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
          
          {/* User Menu */}
          <Menu
            id="auth-menu"
            anchorEl={authMenuAnchorEl}
            open={Boolean(authMenuAnchorEl)}
            onClose={handleAuthMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: 'rgba(20,14,38,0.96)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderRadius: 2,
                border: '1px solid rgba(123,66,246,0.15)',
                minWidth: 180,
              }
            }}
          >
            <MenuItem sx={{ color: '#fff', opacity: 0.8 }}>
              {user?.email}
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem onClick={handleSignOut} sx={{ color: '#fff' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton 
              edge="end" 
              color="inherit" 
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* More Menu - Only on desktop */}
          {!isMobile && (
            <IconButton
              aria-label="more options"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ 
                ml: 0.5, 
                color: '#fff',
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}

          {/* More Menu Dropdown */}
          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: 'rgba(20,14,38,0.96)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderRadius: 2,
                border: '1px solid rgba(123,66,246,0.15)',
                minWidth: 180,
              }
            }}
          >
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

            {/* More Menu Items */}
            {moreMenuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => handleInfoOpen(item.key)}
                sx={{ color: '#fff' }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {drawerContent}
        </Drawer>
      </Toolbar>
    </AppBar>

    {/* Auth Modals */}
    <AuthModal
      open={openAuth === 'login'}
      onClose={handleAuthClose}
      mode="login"
    />
    <AuthModal
      open={openAuth === 'signup'}
      onClose={handleAuthClose}
      mode="signup"
    />

    {/* Information Modals */}
    <InfoModal
      open={openInfo === 'about'}
      onClose={handleInfoClose}
      title="About RepSpheres"
      maxWidth="xs"
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        RepSpheres empowers elite sales teams with unified workflows and
        actionable market intelligence.
      </Typography>
    </InfoModal>

    <InfoModal
      open={openInfo === 'contact'}
      onClose={handleInfoClose}
      title="Contact"
      maxWidth="xs"
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        Reach us at <a href="mailto:contact@repspheres.com">contact@repspheres.com</a>
        {' '}to learn more or schedule a call.
      </Typography>
    </InfoModal>

    <InfoModal
      open={openInfo === 'careers'}
      onClose={handleInfoClose}
      title="Careers"
      maxWidth="xs"
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        We're always looking for talent passionate about sales technology.
        Send your resume to{' '}
        <a href="mailto:careers@repspheres.com">careers@repspheres.com</a>.
      </Typography>
    </InfoModal>

    <InfoModal
      open={openInfo === 'legal'}
      onClose={handleInfoClose}
      title="Legal"
      maxWidth="xs"
    >
      <Typography variant="body1">
        Use of RepSpheres is subject to our{' '}
        <a href="/terms.html">Terms of Service</a> and{' '}
        <a href="/privacy.html">Privacy Policy</a>.
      </Typography>
    </InfoModal>
    </>
  );
}
