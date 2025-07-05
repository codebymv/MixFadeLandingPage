import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Headphones, Zap, Files } from "lucide-react";
import Footer from "@/components/Footer";
import { useState } from "react";

// Move images array outside component to prevent recreation on every render
const LOGO_IMAGES = [
  "/lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.png",
  "/OS_Full_Logo_transparent.png"
];

const FEATURE_IMAGES = [
  "/ui.png",
  "/dj.png",
  "/processing.png",
  "/fileswap.png"
];

const Home = () => {
  const [logoLoaded, setLogoLoaded] = useState<Set<string>>(new Set());
  const [featureLoaded, setFeatureLoaded] = useState<Set<string>>(new Set());

  const handleLogoLoad = (src: string) => {
    setLogoLoaded(prev => new Set([...prev, src]));
  };

  const handleFeatureLoad = (src: string) => {
    setFeatureLoaded(prev => new Set([...prev, src]));
  };

  const allLogosReady = logoLoaded.size === LOGO_IMAGES.length;
  const allFeaturesReady = featureLoaded.size === FEATURE_IMAGES.length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            {/* Logo Section with MixFade and OpaqueSound logos */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mb-6">
              {/* Logo Container - Direct approach */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                {/* MixFade Logo */}
                <div className="w-80 h-20 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.png" 
                    alt="MixFade Logo" 
                    className={`w-80 sm:w-80 h-auto transition-opacity duration-300 ${logoLoaded.has(LOGO_IMAGES[0]) ? 'opacity-90' : 'opacity-0'}`}
                    loading="eager"
                    decoding="sync"
                    onLoad={() => handleLogoLoad(LOGO_IMAGES[0])}
                    style={{ 
                      imageRendering: 'auto',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
                
                {/* "by" text */}
                <span className="text-slate-400 text-lg sm:text-xl font-medium">by</span>
                
                {/* OpaqueSound Logo */}
                <div className="w-64 h-16 flex items-center justify-center">
                  <img 
                    src="/OS_Full_Logo_transparent.png" 
                    alt="OpaqueSound Logo" 
                    className={`w-64 sm:w-64 h-auto transition-opacity duration-300 ${logoLoaded.has(LOGO_IMAGES[1]) ? 'opacity-90' : 'opacity-0'}`}
                    loading="eager"
                    decoding="sync"
                    onLoad={() => handleLogoLoad(LOGO_IMAGES[1])}
                    style={{ 
                      imageRendering: 'auto',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Audio analysis and comparitive playback engine. 
            <br />
            Seamlessly A/B your audio sources with references.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/download">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg neon-glow-fusion transition-all duration-300"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Now
              </Button>
            </Link>
            <Link to="/download?tab=features">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg border-gradient-hover"
              >
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-gradient-emerald-purple">The Ultimate Reference Tool</span>
          </h2>
          
          {/* Central Feature Card - Break Out Full Width */}
          <div className={`mb-12 sm:mb-16 transition-opacity duration-500 ${allFeaturesReady ? 'opacity-100' : 'opacity-0'} -mx-4 sm:-mx-6`}>
            <div className="glass-panel rounded-none sm:rounded-xl border-0 border-t border-b sm:border border-slate-700/50 neon-glow-fusion overflow-hidden w-full mx-0 sm:mx-4 md:mx-auto sm:max-w-6xl p-4 sm:p-6 md:p-8">
              
              {/* Main UI Screenshot */}
              <div className="rounded-lg overflow-hidden border border-slate-600/30 bg-slate-800/30 relative">
                {/* Loading skeleton */}
                <div className={`w-full aspect-[16/9] bg-slate-700/30 animate-pulse rounded-lg ${allFeaturesReady ? 'hidden' : 'block'}`} />
                <img 
                  src="/ui.png" 
                  alt="MixFade Complete Interface" 
                  className={`w-full h-auto transition-all duration-300 hover:scale-105 ${allFeaturesReady ? 'block' : 'hidden'}`}
                  loading="eager"
                  decoding="sync"
                  style={{ imageRendering: 'auto' }}
                  onLoad={() => handleFeatureLoad("/ui.png")}
                />
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-xl p-6 border border-slate-700/50 neon-glow-green overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Headphones className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">DJ-Style Playback</h3>
                </div>
              </div>
              
              {/* Screenshot */}
              <div className="mb-4 rounded-lg overflow-hidden border border-slate-600/30 aspect-[4/3] bg-slate-800/30 relative">
                {/* Loading skeleton */}
                <div className={`w-full h-full bg-slate-700/30 animate-pulse rounded-lg ${allFeaturesReady ? 'hidden' : 'block'}`} />
                <img 
                  src="/dj.png" 
                  alt="DJ-Style Playback Interface" 
                  className={`w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105 ${allFeaturesReady ? 'block' : 'hidden'}`}
                  loading="eager"
                  decoding="sync"
                  onLoad={() => handleFeatureLoad("/dj.png")}
                />
              </div>
              
              <p className="text-slate-400 leading-relaxed">
                Intuitive deck-like controls for smooth audio playback with precision analysis.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-slate-700/50 neon-glow-fusion overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="zapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                        <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                      </linearGradient>
                    </defs>
                    <Zap size={24} stroke="url(#zapGradient)" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Real-time Processing</h3>
                </div>
              </div>
              
              {/* Screenshot */}
              <div className="mb-4 rounded-lg overflow-hidden border border-slate-600/30 aspect-[4/3] bg-slate-800/30 relative">
                {/* Loading skeleton */}
                <div className={`w-full h-full bg-slate-700/30 animate-pulse rounded-lg ${allFeaturesReady ? 'hidden' : 'block'}`} />
                <img 
                  src="/processing.png" 
                  alt="Real-time Processing Interface" 
                  className={`w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105 ${allFeaturesReady ? 'block' : 'hidden'}`}
                  loading="eager"
                  decoding="sync"
                  onLoad={() => handleFeatureLoad("/processing.png")}
                />
              </div>
              
              <p className="text-slate-400 leading-relaxed">
                Low-latency and responsive metering for smooth and accurate readings.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-slate-700/50 neon-glow-purple overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Files className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Simple File Swapping</h3>
                </div>
              </div>
              
              {/* Screenshot */}
              <div className="mb-4 rounded-lg overflow-hidden border border-slate-600/30 aspect-[4/3] bg-slate-800/30 relative">
                {/* Loading skeleton */}
                <div className={`w-full h-full bg-slate-700/30 animate-pulse rounded-lg ${allFeaturesReady ? 'hidden' : 'block'}`} />
                <img 
                  src="/fileswap.png" 
                  alt="File Swapping Interface" 
                  className={`w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105 ${allFeaturesReady ? 'block' : 'hidden'}`}
                  loading="eager"
                  decoding="sync"
                  onLoad={() => handleFeatureLoad("/fileswap.png")}
                />
              </div>
              
              <p className="text-slate-400 leading-relaxed">
                Pull from dozens of recently added files to quickly swap between sources on the fly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-500/10 to-purple-500/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-gradient-emerald-purple">Check it out free!</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Download for Windows.
          </p>
          <Link to="/download">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg neon-glow-fusion transition-all duration-300"
              >
                <Download className="mr-2 h-5 w-5" />
                Get MixFade Free
              </Button>
            </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
