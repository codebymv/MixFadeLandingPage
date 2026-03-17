import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Headphones, Zap, Files, Monitor, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const LOGO_IMAGES = [
  "/lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.png",
  "/OS_Full_Logo_transparent.png",
];

const FEATURE_IMAGES = ["/mixfade-ui-26.png", "/mixfade-deck-26.png", "/mixfade-ui-analytics-26.png", "/mixfade-ui-files-26.png", "/mixfade-visualizer-26.png"];

const Home = () => {
  const { imagesLoaded: logosLoaded, loadedImages: loadedLogos } =
    useImagePreloader({ images: LOGO_IMAGES });

  const { imagesLoaded: featuresLoaded, loadedImages: loadedFeatures } =
    useImagePreloader({ images: FEATURE_IMAGES });

  const allLogosReady = logosLoaded && loadedLogos.size === LOGO_IMAGES.length;
  const allFeaturesReady =
    featuresLoaded && loadedFeatures.size === FEATURE_IMAGES.length;

  return (
    <div className="min-h-screen bg-slate-900 noise-bg relative">
      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[140px]" />
          <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="max-w-xl">
              {/* Logo pair */}
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-10 transition-opacity duration-700 ${allLogosReady ? "opacity-100" : "opacity-0"
                  } animate-reveal`}
              >
                <img
                  src="/lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.png"
                  alt="MixFade Logo"
                  className="w-56 h-14 object-contain"
                  loading="eager"
                  decoding="sync"
                />
                <span className="text-slate-500 text-sm font-medium tracking-wider uppercase">
                  by
                </span>
                <Link to="https://opaquesound.com">
                  <img
                    src="/OS_Full_Logo_transparent.png"
                    alt="OpaqueSound Logo"
                    className="w-44 h-11 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                    loading="eager"
                    decoding="sync"
                  />
                </Link>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 animate-reveal delay-1">
                <span className="text-white">Audio analysis &</span>
                <br />
                <span className="text-gradient-emerald-purple">
                  comparative playback
                </span>
                <br />
                <span className="text-white">engine.</span>
              </h1>

              {/* Subhead */}
              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-md animate-reveal delay-2">
                Seamlessly A/B your audio sources with references. Built for
                producers, engineers, and anyone who cares about sound.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-reveal delay-3">
                <Link to="/download">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg neon-glow-fusion transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Free
                  </Button>
                </Link>
                <Link to="/download?tab=features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:text-white px-8 py-4 text-lg transition-all duration-300 border-gradient-hover"
                  >
                    View Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Hero Screenshot with perspective tilt */}
            <div
              className={`perspective-container transition-opacity duration-700 ${allFeaturesReady ? "opacity-100" : "opacity-0"
                } animate-reveal-scale delay-3`}
            >
              <div className="card-tilt rounded-xl overflow-hidden border border-slate-700/30 neon-glow-fusion bg-slate-800/20">
                <div className="relative">
                  <div
                    className={`w-full aspect-video bg-slate-700/20 animate-pulse rounded-xl ${allFeaturesReady ? "hidden" : "block"
                      }`}
                  />
                  <img
                    src="/mixfade-ui-26.png"
                    alt="MixFade Complete Interface"
                    className={`w-full object-cover ${allFeaturesReady ? "block" : "hidden"
                      }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6 section-glow relative">
        <div className="container mx-auto">
          {/* Section header */}
          <div className="text-center mb-20 animate-reveal">
            <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4">
              Features
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">
              <span className="text-gradient-emerald-purple">
                The Ultimate Reference Tool
              </span>
            </h2>
          </div>

          {/* Feature rows — alternating layout */}
          <div className="space-y-20 lg:space-y-28">
            {/* Feature 1: DJ-Style Playback */}
            <div className="feature-row animate-reveal delay-1">
              <div
                className={`image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-green bg-slate-800/20 transition-opacity duration-500 ${allFeaturesReady ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div
                  className={`w-full aspect-[4/3] bg-slate-700/20 animate-pulse ${allFeaturesReady ? "hidden" : "block"
                    }`}
                />
                <img
                  src="/mixfade-deck-26.png"
                  alt="DJ-Style Playback Interface"
                  className={`w-full h-full object-cover ${allFeaturesReady ? "block" : "hidden"
                    }`}
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Headphones className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  DJ-Style Playback
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  Intuitive deck-like controls for smooth audio playback with
                  precision analysis. Swap between tracks instantly with
                  crossfade transitions.
                </p>
              </div>
            </div>

            {/* Feature 2: Real-time Processing (reversed) */}
            <div className="feature-row reversed animate-reveal delay-2">
              <div className="flex justify-center w-full">
                <div
                  className={`image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-fusion bg-slate-800/50 transition-opacity duration-500 ${allFeaturesReady ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <div
                    className={`h-[400px] sm:h-[500px] w-[280px] bg-slate-700/20 animate-pulse ${allFeaturesReady ? "hidden" : "block"
                      }`}
                  />
                  <img
                    src="/mixfade-ui-analytics-26.png"
                    alt="Real-time Processing Interface"
                    className={`h-[400px] sm:h-[500px] w-auto object-cover ${allFeaturesReady ? "block" : "hidden"
                      }`}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Real-time Processing
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  Low-latency, responsive metering for smooth and accurate
                  readings. Watch your levels in real-time as you fine-tune your
                  mix.
                </p>
              </div>
            </div>

            {/* Feature 3: Simple File Swapping */}
            <div className="feature-row animate-reveal delay-3">
              <div className="flex justify-center w-full">
                <div
                  className={`image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-green bg-slate-800/50 transition-opacity duration-500 ${allFeaturesReady ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <div
                    className={`h-[400px] sm:h-[500px] w-[280px] bg-slate-700/20 animate-pulse ${allFeaturesReady ? "hidden" : "block"
                      }`}
                  />
                  <img
                    src="/mixfade-ui-files-26.png"
                    alt="File Swapping Interface"
                    className={`h-[400px] sm:h-[500px] w-auto object-cover ${allFeaturesReady ? "block" : "hidden"
                      }`}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Files className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Simple File Swapping
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  Pull from dozens of recently added files to quickly swap
                  between sources on the fly. Drag, drop, and compare in
                  seconds.
                </p>
              </div>
            </div>

            {/* Feature 4: Real-time Unique Visuals (reversed) */}
            <div className="feature-row reversed animate-reveal delay-4">
              <div
                className={`image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-purple bg-slate-800/20 transition-opacity duration-500 ${allFeaturesReady ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div
                  className={`w-full aspect-video bg-slate-700/20 animate-pulse rounded-xl ${allFeaturesReady ? "hidden" : "block"
                    }`}
                />
                <img
                  src="/mixfade-visualizer-26.png"
                  alt="Real-time Unique Visuals"
                  className={`w-full object-cover ${allFeaturesReady ? "block" : "hidden"
                    }`}
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Real-time Unique Visuals
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  Seed-driven audio visualizations that react to your music in
                  real time. Roll a new look whenever you want — no two visuals
                  are the same.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/[0.04] to-purple-500/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4 animate-reveal">
            Get Started
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-reveal delay-1">
            <span className="text-gradient-emerald-purple">
              Check it out free.
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-lg mx-auto animate-reveal delay-2">
            Available as a free download for Windows. No strings attached.
          </p>
          <div className="animate-reveal delay-3">
            <Link to="/download">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold px-10 py-5 text-lg neon-glow-fusion transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <Download className="mr-2 h-5 w-5" />
                Get MixFade Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
