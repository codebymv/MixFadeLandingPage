import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Users, Calendar } from 'lucide-react';
import { ANALYTICS_CONFIG } from '@/config/downloads';

interface DownloadData {
  platform: string;
  version: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

const DownloadAnalytics = () => {
  const [downloads, setDownloads] = useState<DownloadData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadDownloads = () => {
      try {
        const storedDownloads = JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.storageKey) || '[]');
        setDownloads(storedDownloads);
      } catch (error) {
        console.error('Failed to load download analytics:', error);
      }
    };

    loadDownloads();
    // Refresh every 30 seconds
    const interval = setInterval(loadDownloads, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPlatformStats = () => {
    const platformCounts = downloads.reduce((acc, download) => {
      acc[download.platform] = (acc[download.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(platformCounts).map(([platform, count]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      count,
      percentage: downloads.length > 0 ? Math.round((count / downloads.length) * 100) : 0
    }));
  };

  const getRecentDownloads = () => {
    return downloads
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const clearAnalytics = () => {
    localStorage.removeItem(ANALYTICS_CONFIG.storageKey);
    setDownloads([]);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
          size="sm"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics ({downloads.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <div className="glass-panel rounded-xl p-4 border border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-emerald-400" />
            Download Analytics
          </h3>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            ×
          </Button>
        </div>

        <div className="space-y-4">
          {/* Total Downloads */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center">
              <Download className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-slate-300">Total Downloads</span>
            </div>
            <span className="text-xl font-bold text-white">{downloads.length}</span>
          </div>

          {/* Platform Breakdown */}
          {getPlatformStats().length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Platform Breakdown</h4>
              <div className="space-y-2">
                {getPlatformStats().map(({ platform, count, percentage }) => (
                  <div key={platform} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{platform}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-white font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Downloads */}
          {getRecentDownloads().length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Downloads</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {getRecentDownloads().map((download, index) => (
                  <div key={index} className="flex items-center justify-between text-xs text-slate-400">
                    <span>{download.platform} v{download.version}</span>
                    <span>{new Date(download.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              onClick={clearAnalytics}
              variant="outline"
              size="sm"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Clear Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAnalytics;