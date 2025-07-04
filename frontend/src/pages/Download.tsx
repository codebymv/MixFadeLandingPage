import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileText, Zap, Waves, Settings, Headphones, Monitor, Smartphone, HardDrive } from "lucide-react";
import Footer from "@/components/Footer";
import EmailGateModal from "@/components/EmailGateModal";
// import DownloadAnalytics from "@/components/DownloadAnalytics";
import { DOWNLOAD_URLS, VERSION_HISTORY, CURRENT_VERSION, ANALYTICS_CONFIG, PLATFORM_MAPPINGS } from "@/config/downloads";
import { initiateDownload } from "@/services/api";

// Mobile device detection utility
const isMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'iphone', 'ipad', 'android', 'mobile', 'phone', 'tablet',
    'blackberry', 'webos', 'opera mini', 'windows phone'
  ];
  
  // Check user agent for mobile keywords
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // Check screen size as additional indicator
  const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 1024;
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isMobileUA || (isSmallScreen && isTouchDevice);
};

// Platform detection utility (only for desktop devices)
const detectPlatform = () => {
  // If it's a mobile device, return null (we'll handle this separately)
  if (isMobileDevice()) {
    return null;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // For now, only support Windows
  if (userAgent.includes('win')) {
    return 'windows';
  }
  
  // Default to Windows for all desktop platforms
  return 'windows';
};

// Download tracking utility
const trackDownload = async (platform: string, version: string) => {
  if (!ANALYTICS_CONFIG.enabled) return;
  
  try {
    const downloadData = {
      platform,
      version,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: crypto.randomUUID()
    };
    
    // Store in localStorage
    const downloads = JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.storageKey) || '[]');
    downloads.push(downloadData);
    
    // Keep only the most recent records
    if (downloads.length > ANALYTICS_CONFIG.maxRecords) {
      downloads.splice(0, downloads.length - ANALYTICS_CONFIG.maxRecords);
    }
    
    localStorage.setItem(ANALYTICS_CONFIG.storageKey, JSON.stringify(downloads));
    
    // TODO: Send to analytics service
    // await fetch(ANALYTICS_CONFIG.endpoints.track, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(downloadData)
    // });
    
    console.log('Download tracked:', downloadData);
  } catch (error) {
    console.error('Failed to track download:', error);
  }
};

const DownloadPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("features");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>('windows');
  const [isMobile, setIsMobile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{platform: string, version: string} | null>(null);

  useEffect(() => {
    // Detect mobile device and platform on component mount
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setDetectedPlatform(detectPlatform());
    
    const tab = searchParams.get("tab");
    if (tab === "features" || tab === "history") {
      setActiveTab(tab);
      // Only scroll when there's a specific tab parameter (coming from a link)
      setTimeout(() => {
        const tabbedSection = document.getElementById("tabbed-content");
        if (tabbedSection) {
          tabbedSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // If no tab parameter, ensure we're at the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    // Add resize listener to re-check mobile state on window resize
    const handleResize = () => {
      const mobile = isMobileDevice();
      setIsMobile(mobile);
      setDetectedPlatform(detectPlatform());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchParams]);

  // Get download URLs from configuration
  const getDownloadUrls = (version?: string) => {
    if (version && version !== CURRENT_VERSION) {
      const versionData = VERSION_HISTORY.find(v => v.version === version);
      return versionData?.downloads || DOWNLOAD_URLS;
    }
    return DOWNLOAD_URLS;
  };

  // Handle download button click - show email modal
  const handleDownloadClick = (platform: string, version: string = CURRENT_VERSION) => {
    setPendingDownload({ platform, version });
    setShowEmailModal(true);
  };

  // Handle successful email collection - initiate download
  const handleEmailSuccess = async (sessionId: string) => {
    if (!pendingDownload) return;
    
    setIsDownloading(true);
    
    try {
      // Use the API service to initiate download with tracking
      await initiateDownload(
        sessionId,
        '', // Email will be handled by the API service
        pendingDownload.platform,
        pendingDownload.version
      );
      
      console.log(`Download started: MixFade v${pendingDownload.version} for ${pendingDownload.platform}`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again later.');
    } finally {
      setIsDownloading(false);
      setPendingDownload(null);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowEmailModal(false);
    setPendingDownload(null);
  };

  // Get platform display info (Windows-only for now)
  const getPlatformInfo = () => {
    return {
      name: 'Windows',
      icon: Monitor
    };
  };

  // Use version history from configuration
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
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-emerald-purple">Free Download</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get the latest version of MixFade for Windows and start referencing with precision.
          </p>
          
          <div className="glass-panel rounded-2xl p-8 max-w-md mx-auto border border-slate-700/50 neon-glow-fusion">
            <h3 className="text-2xl font-bold text-white mb-2">Current Version</h3>
            <p className="text-3xl font-mono text-emerald-400 mb-4">v{CURRENT_VERSION}</p>
            <p className="text-slate-400 mb-4">Released {versions[0]?.date} • {DOWNLOAD_URLS.windows?.size}</p>
            
            {isMobile ? (
              // Mobile message
              <div className="text-center py-4">
                <Monitor className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Desktop Experience</h4>
                <p className="text-slate-300 mb-4">
                  MixFade is designed for desktop audio production workflows.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-emerald-400 font-medium">
                    💻 Try it out on your desktop or laptop!
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Available for Windows computers
                  </p>
                </div>
              </div>
            ) : (
              // Desktop download button
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold py-4 text-lg neon-glow-fusion disabled:opacity-50 mb-4"
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

      {/* Tabbed Content Section */}
      <section id="tabbed-content" className="py-20 px-6">
        <div className="container mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="glass-panel rounded-xl p-2 border border-slate-700/50">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("features")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "features"
                      ? "bg-gradient-to-r from-emerald-500 to-purple-500 text-white neon-glow-fusion"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Zap className="inline mr-2 h-4 w-4" />
                  Features
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "history"
                      ? "bg-gradient-to-r from-emerald-500 to-purple-500 text-white neon-glow-fusion"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Version History
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "features" && (
              <div className="space-y-6">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gradient-emerald-purple mb-4">
                    Powerful Features
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="glass-panel rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-purple-500/20">
                          <feature.icon className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-slate-300">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

                         {activeTab === "history" && (
               <div className="space-y-6">
                 <div className="text-center mb-12">
                   <h2 className="text-4xl font-bold text-gradient-emerald-purple mb-4">
                     Version History
                   </h2>
                 </div>
                
                {versions.map((version, index) => (
                  <div 
                    key={version.version} 
                    className={`glass-panel rounded-xl p-6 border border-slate-700/50 ${
                      index === 0 ? 'neon-glow-green' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-mono font-bold text-emerald-400">
                          v{version.version}
                        </span>
                        {index === 0 && (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-slate-400 text-sm mt-2 md:mt-0">
                        <span>{version.date}</span>
                        <span>•</span>
                        <span>{version.size}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center mb-3">
                        <FileText className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="text-white font-medium">What's New</span>
                      </div>
                      <ul className="space-y-1 text-slate-300">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start">
                            <span className="text-emerald-400 mr-2 mt-1">•</span>
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
      {/* <DownloadAnalytics /> */}
      
      {/* Email Gate Modal */}
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
