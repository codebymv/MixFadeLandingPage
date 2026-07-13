import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Headphones, Zap, Files, Monitor, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

const Home = () => {
  // Defer heavy hero screenshot until after LCP window (or first input).
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const enable = () => setHeroReady(true);
    window.addEventListener("pointerdown", enable, { once: true, passive: true });
    const t = window.setTimeout(enable, 8000);
    return () => {
      window.removeEventListener("pointerdown", enable);
      window.clearTimeout(t);
    };
  }, []);

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
            {/* Hero screenshot first on mobile so it wins LCP over the nav icon */}
            <div className="order-1 lg:order-2 perspective-container">
              <div className="card-tilt rounded-xl overflow-hidden border border-slate-700/30 neon-glow-fusion bg-slate-800/20">
                <div className="relative">
                  {heroReady ? (
                    <picture>
                      <source type="image/webp" srcSet="/mixfade-ui-26-lcp.webp" />
                      <img
                        src="/mixfade-ui-26.png"
                        alt="MixFade Complete Interface"
                        className="w-full object-cover"
                        width={900}
                        height={816}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </picture>
                  ) : (
                    <div className="w-full aspect-[900/816] bg-slate-800/40" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-2 lg:order-1 max-w-xl">
              {/* Logo pair — low priority so hero stays LCP */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-10">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.webp"
                  />
                  <img
                    src="/lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.png"
                    alt="MixFade Logo"
                    className="w-56 h-14 object-contain"
                    width={560}
                    height={135}
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                </picture>
                <span className="text-slate-400 text-sm font-medium tracking-wider uppercase">
                  by
                </span>
                <Link to="https://opaquesound.com">
                  <picture>
                    <source type="image/webp" srcSet="/OS_Full_Logo_transparent.webp" />
                    <img
                      src="/OS_Full_Logo_transparent.png"
                      alt="OpaqueSound Logo"
                      className="w-44 h-11 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                      width={400}
                      height={101}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </picture>
                </Link>
              </div>

              {/* Headline */}
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                <span className="text-white">Audio</span>
                <br />
                <span className="text-gradient-emerald-purple">
                  analysis & playback
                </span>
                <br />
                <span className="text-white">engine.</span>
              </h1>

              {/* Subhead */}
              <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-md">
                Seamlessly A/B your audio sources with references. Built for
                producers, engineers, and anyone who cares about sound.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/download" className="inline-flex min-h-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg neon-glow-fusion transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 min-h-12"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Free
                  </Button>
                </Link>
                <Link to="/download?tab=features" className="inline-flex min-h-12">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-700 text-slate-200 hover:bg-slate-800/60 hover:text-white px-8 py-4 text-lg transition-all duration-300 border-gradient-hover min-h-12"
                  >
                    View Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
              <div className="image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-green bg-slate-800/20">
                <picture>
                  <source type="image/webp" srcSet="/mixfade-deck-26.webp" />
                  <img
                    src="/mixfade-deck-26.png"
                    alt="DJ-Style Playback Interface"
                    className="w-full h-full object-cover"
                    width={611}
                    height={580}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Headphones className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  DJ-Style Playback
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Intuitive deck-like controls for smooth audio playback with
                  precision analysis. Swap between tracks instantly with
                  crossfade transitions.
                </p>
              </div>
            </div>

            {/* Feature 2: Real-time Processing (reversed) */}
            <div className="feature-row reversed animate-reveal delay-2">
              <div className="flex justify-center w-full">
                <div className="image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-fusion bg-slate-800/50">
                  <picture>
                    <source type="image/webp" srcSet="/mixfade-ui-analytics-26.webp" />
                    <img
                      src="/mixfade-ui-analytics-26.png"
                      alt="Real-time Processing Interface"
                      className="h-[400px] sm:h-[500px] w-auto object-cover"
                      width={419}
                      height={624}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Real-time Processing
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Low-latency, responsive metering for smooth and accurate
                  readings. Watch your levels in real-time as you fine-tune your
                  mix.
                </p>
              </div>
            </div>

            {/* Feature 3: Simple File Swapping */}
            <div className="feature-row animate-reveal delay-3">
              <div className="flex justify-center w-full">
                <div className="image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-green bg-slate-800/50">
                  <picture>
                    <source type="image/webp" srcSet="/mixfade-ui-files-26.webp" />
                    <img
                      src="/mixfade-ui-files-26.png"
                      alt="File Swapping Interface"
                      className="h-[400px] sm:h-[500px] w-auto object-cover"
                      width={264}
                      height={498}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Files className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Simple File Swapping
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Pull from dozens of recently added files to quickly swap
                  between sources on the fly. Drag, drop, and compare in
                  seconds.
                </p>
              </div>
            </div>

            {/* Feature 4: Real-time Unique Visuals (reversed) */}
            <div className="feature-row reversed animate-reveal delay-4">
              <div className="image-reveal rounded-xl overflow-hidden border border-slate-700/30 neon-glow-purple bg-slate-800/20">
                <picture>
                  <source type="image/webp" srcSet="/mixfade-visualizer-26.webp" />
                  <img
                    src="/mixfade-visualizer-26.png"
                    alt="Real-time Unique Visuals"
                    className="w-full object-cover"
                    width={1280}
                    height={983}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="flex flex-col justify-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  Real-time Unique Visuals
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
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
          <p className="text-xl text-slate-300 mb-10 max-w-lg mx-auto animate-reveal delay-2">
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
