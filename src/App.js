import React from 'react';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import HeroSectionV2 from './components/HeroSectionV2';
import AuthoritySection from './components/AuthoritySection';
import SophisticationGapSection from './components/SophisticationGapSection';
import UniverseBuildingSection from './components/UniverseBuildingSection';
import IntelligenceProofSection from './components/IntelligenceProofSection';
import PricingSection from './components/PricingSection';
import CTASection from './components/CTASection';
import OrbContextProvider from './components/OrbContextProvider';
import { AuthProvider } from './contexts/AuthContext';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <OrbContextProvider>
      <AuthProvider>
        <StarryBackground />
        <NavBar />
        <HeroSectionV2 />
        <AuthoritySection />
        <SophisticationGapSection />
        <UniverseBuildingSection />
        <IntelligenceProofSection />
        <PricingSection />
        <CTASection />
        <Footer />
        <ThemeToggle />
      </AuthProvider>
    </OrbContextProvider>
  );
}

export default App;
