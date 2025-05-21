import React from 'react';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import TimelineSection from './components/TimelineSection';
import DeploymentSection from './components/DeploymentSection';
import OrbContextProvider from './components/OrbContextProvider';


import CTASection from './components/CTASection';
import IntelligenceSection from './components/IntelligenceSection';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <OrbContextProvider>
      <StarryBackground />
      <NavBar />
      <HeroSection />
      <IntelligenceSection />
      <SolutionSection />
      <TimelineSection />
      <DeploymentSection />

      <CTASection />
      <Footer />
      <ThemeToggle />
      {/* Add more sections/components as needed */}
    </OrbContextProvider>
  );
}

export default App;
