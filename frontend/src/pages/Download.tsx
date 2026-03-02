import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileText, Zap, Waves, Settings, Headphones, Monitor } from "lucide-react";
import Footer from "@/components/Footer";
import EmailGateModal from "@/components/EmailGateModal";
import { DOWNLOAD_URLS, VERSION_HISTORY, CURRENT_VERSION } from "@/config/downloads";
import { initiateDownload } from "@/services/api";

const isMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'iphone', 'ipad', 'android', 'mobile', 'phone', 'tablet',
    'blackberry', 'webos', 'opera mini', 'windows phone'
  ];
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 1024;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return isMobileUA || (isSmallScreen && isTouchDevice);
};

const detectPlatform = () => {
  if (isMobileDevice()) return null;
  return 'windows';
};

const DownloadPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("features");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>('windows');
  const [isMobile, setIsMobile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ platform: string, version: string } | null>(null);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setDetectedPlatform(detectPlatform());

    const tab = searchParams.get("tab");
    if (tab === "features" || tab === "history") {
      setActiveTab(tab);
      setTimeout(() => {
        const tabbedSection = document.getElementById("tabbed-content");
        if (tabbedSection) {
          tabbedSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const handleResize = () => {
      const mobile = isMobileDevice();
      setIsMobile(mobile);
      setDetectedPlatform(detectPlatform());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchParams]);

  const getDownloadUrls = (version?: string) => {
    if (version && version !== CURRENT_VERSION) {
      const versionData = VERSION_HISTORY.find(v => v.version === version);
      return versionData?.downloads || DOWNLOAD_URLS;
    }
    return DOWNLOAD_URLS;
  };

  const handleDownloadClick = (platform: string, version: string = CURRENT_VERSION) => {
    setPendingDownload({ platform, version });
    setShowEmailModal(true);
  };

  const handleEmailSuccess = async (sessionId: string) => {
    if (!pendingDownload) return;
    setIsDownloading(true);
    try {
      await initiateDownload(sessionId, '', pendingDownload.platform, pendingDownload.version);
      console.log(`Download started: MixFade v${pendingDownload.version} for ${pendingDownload.platform}`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again later.');
    } finally {
      setIsDownloading(false);
      setPendingDownload(null);
    }
  };

  const handleModalClose = () => {
    setShowEmailModal(false);
    setPendingDownload(null);
  };

  const versions = VERSION_HISTORY;

  const features = [
    {
      icon: Waves,
      title: "Advanced Crossfade Engine",
      description: "Professional-grade crossfading with customizable curves and real-time preview"
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Optimized for low-latency mixing with efficient memory management"
    },
    {
      icon: Settings,
      title: "Precision Controls",
      description: "Fine-tune every aspect of your mix with professional-grade controls"
    },
    {
      icon: Headphones,
      title: "Multi-Format Support",
      description: "Works with WAV, MP3, FLAC, and other popular audio formats"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 noise-bg relative">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4 animate-reveal">
            Download
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 animate-reveal delay-1">
            <span className="text-gradient-emerald-purple">Free Download</span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto animate-reveal delay-2">
            Get the latest version of MixFade for Windows and start referencing!
          </p>

          <div className="glass-panel rounded-2xl p-8 max-w-md mx-auto border border-slate-700/30 neon-glow-fusion animate-reveal-scale delay-3">
            <h3 className="font-display text-xl font-bold text-white mb-2">Current Version</h3>
            <p className="text-3xl font-mono text-emerald-400 mb-4">v{CURRENT_VERSION}</p>
            <p className="text-slate-500 text-sm mb-6">Released {versions[0]?.date} • {DOWNLOAD_URLS.windows?.size}</p>

            {isMobile ? (
              <div className="text-center py-4">
                <Monitor className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h4 className="font-display text-lg font-semibold text-white mb-2">Desktop Experience</h4>
                <p className="text-slate-400 text-sm mb-4">
                  MixFade is designed for desktop audio production workflows.
                </p>
                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                  <p className="text-emerald-400 font-medium text-sm">
                    💻 Try it out on your desktop or laptop!
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Available for Windows computers
                  </p>
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold py-4 text-lg neon-glow-fusion disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                onClick={() => handleDownloadClick('windows')}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}
                {isDownloading ? 'Downloading...' : 'Download for Windows'}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* Tabbed Content Section */}
      <section id="tabbed-content" className="py-20 px-6">
        <div className="container mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-xl p-1 bg-slate-800/40 border border-slate-700/30">
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === "features"
                    ? "bg-gradient-to-r from-emerald-500 to-purple-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Zap className="inline mr-2 h-4 w-4" />
                Features
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === "history"
                    ? "bg-gradient-to-r from-emerald-500 to-purple-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Calendar className="inline mr-2 h-4 w-4" />
                Version History
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "features" && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-12">
                  <h2 className="font-display text-4xl font-bold text-gradient-emerald-purple mb-4">
                    Powerful Features
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`glass-panel rounded-xl p-6 border border-slate-700/30 hover:border-emerald-500/20 transition-all duration-300 hover-lift animate-reveal delay-${index + 1}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-12">
                  <h2 className="font-display text-4xl font-bold text-gradient-emerald-purple mb-4">
                    Version History
                  </h2>
                </div>

                {versions.map((version, index) => (
                  <div
                    key={version.version}
                    className={`glass-panel rounded-xl p-6 border border-slate-700/30 transition-all duration-300 hover-lift ${index === 0 ? 'neon-glow-green' : ''
                      } animate-reveal delay-${Math.min(index + 1, 5)}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-mono font-bold text-emerald-400">
                          v{version.version}
                        </span>
                        {index === 0 && (
                          <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-medium tracking-wide">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-slate-500 text-sm mt-2 md:mt-0">
                        <span>{version.date}</span>
                        <span className="text-slate-700">•</span>
                        <span>{version.size}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center mb-3">
                        <FileText className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="text-white font-medium text-sm">What's New</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-400 text-sm">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start">
                            <span className="text-emerald-500/60 mr-2 mt-0.5">›</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <EmailGateModal
        isOpen={showEmailModal}
        onClose={handleModalClose}
        onSuccess={handleEmailSuccess}
        platform={pendingDownload?.platform || 'windows'}
        version={pendingDownload?.version || CURRENT_VERSION}
      />
    </div>
  );
};

export default DownloadPage;
