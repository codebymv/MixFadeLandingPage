// Download configuration for MixFade releases
// Update this file when new versions are released

export interface DownloadInfo {
  url: string;
  filename: string;
  size: string;
}

export interface VersionInfo {
  version: string;
  date: string;
  size: string;
  changes: string[];
  downloads: {
    windows: DownloadInfo;
    macos: DownloadInfo;
    linux: DownloadInfo;
  };
}

// Current release configuration
export const CURRENT_VERSION = '0.9.4';

// Base URLs for different hosting providers
export const DOWNLOAD_BASE_URLS = {
  github: 'https://github.com/yourusername/mixfade/releases/download',
  cdn: 'https://cdn.mixfade.app/releases',
  backup: 'https://releases.mixfade.app'
};

// Use S3 bucket for downloads
const BASE_URL = 'https://mixfade.s3.us-east-1.amazonaws.com/releases';

// Download URLs for all supported platforms
export const DOWNLOAD_URLS: Record<string, DownloadInfo> = {
  windows: {
    url: 'https://mixfade.s3.us-east-1.amazonaws.com/releases/windows/MixFade+Setup+0.9.4.exe',
    filename: 'MixFade Setup 0.9.4.exe',
    size: '80.90 MB'
  },
  macos: {
    url: `${BASE_URL}/macos/MixFade-${CURRENT_VERSION}-macOS-x64.dmg`,
    filename: `MixFade-${CURRENT_VERSION}-macOS-x64.dmg`,
    size: '87.1 MB'
  },
  linux: {
    url: `${BASE_URL}/v${CURRENT_VERSION}/MixFade-${CURRENT_VERSION}.AppImage`,
    filename: `MixFade-${CURRENT_VERSION}.AppImage`,
    size: '89.3 MB'
  }
};

// Version history with download links
export const VERSION_HISTORY: VersionInfo[] = [
  {
    version: '0.9.4',
    date: '2025-07-03',
    size: '80.90 MB download (294.6 MB installed)',
    changes: [
      'Hotfix: Linting improvements and functionality refinements',
      'Professional Windows installer (.exe) - no more zip files!',
      'One-click installation with desktop shortcuts',
      'Automatic file associations for audio files',
      'Enhanced crossfade algorithms',
      'Improved audio processing engine',
      'New DJ-style playback controls',
      'Real-time audio visualization',
      'Performance optimizations',
      'Bug fixes and stability improvements'
    ],
    downloads: {
      windows: {
        url: 'https://mixfade.s3.us-east-1.amazonaws.com/releases/windows/MixFade+Setup+0.9.4.exe',
        filename: 'MixFade Setup 0.9.4.exe',
        size: '80.90 MB'
      },
      macos: {
        url: `${BASE_URL}/macos/MixFade-0.9.3-macOS-x64.dmg`,
        filename: 'MixFade-0.9.3-macOS-x64.dmg',
        size: '87.1 MB'
      },
      linux: {
        url: `${BASE_URL}/v0.9.3/MixFade-0.9.3.AppImage`,
        filename: 'MixFade-0.9.3.AppImage',
        size: '89.3 MB'
      }
    }
  },
  {
    version: '0.9.3',
    date: '2025-07-02',
    size: '81.06 MB download (294.6 MB installed)',
    changes: [
      'Professional Windows installer (.exe) - no more zip files!',
      'One-click installation with desktop shortcuts',
      'Automatic file associations for audio files',
      'Enhanced crossfade algorithms',
      'Improved audio processing engine',
      'New DJ-style playback controls',
      'Real-time audio visualization',
      'Performance optimizations',
      'Bug fixes and stability improvements'
    ],
    downloads: {
      windows: {
        url: `https://mixfade.s3.us-east-1.amazonaws.com/releases/windows/MixFade-0.9.3-Windows-x64-Setup.exe`,
        filename: 'MixFade-0.9.3-Windows-x64-Setup.exe',
        size: '81.06 MB'
      },
      macos: {
        url: `${BASE_URL}/macos/MixFade-0.9.3-macOS-x64.dmg`,
        filename: 'MixFade-0.9.3-macOS-x64.dmg',
        size: '87.1 MB'
      },
      linux: {
        url: `${BASE_URL}/v0.9.3/MixFade-0.9.3.AppImage`,
        filename: 'MixFade-0.9.3.AppImage',
        size: '89.3 MB'
      }
    }
  },
  {
    version: '0.0.0',
    date: '2024-12-19',
    size: '113.75 MB',
    changes: [
      'Initial release',
      'DJ-style playback controls',
      'Real-time audio processing',
      'Simple file swapping interface'
    ],
    downloads: {
      windows: {
        url: `${BASE_URL}/windows/MixFade-0.0.0-Windows-x64.zip`,
        filename: 'MixFade-0.0.0-Windows-x64.zip',
        size: '113.75 MB'
      },
      macos: {
        url: `${BASE_URL}/v0.0.0/MixFade-0.0.0.dmg`,
        filename: 'MixFade-0.0.0.dmg',
        size: '87.1 MB'
      },
      linux: {
        url: `${BASE_URL}/v0.0.0/MixFade-0.0.0.AppImage`,
        filename: 'MixFade-0.0.0.AppImage',
        size: '89.3 MB'
      }
    }
  },
  {
    version: '2.1.0',
    date: '2024-06-15',
    size: '85.2 MB',
    changes: [
      'Improved crossfade algorithms',
      'New audio effects pack',
      'Performance optimizations',
      'Bug fixes and stability improvements'
    ],
    downloads: {
      windows: {
        url: `${BASE_URL}/v2.1.0/MixFade-Setup-2.1.0.exe`,
        filename: 'MixFade-Setup-2.1.0.exe',
        size: '85.2 MB'
      },
      macos: {
        url: `${BASE_URL}/v2.1.0/MixFade-2.1.0.dmg`,
        filename: 'MixFade-2.1.0.dmg',
        size: '87.1 MB'
      },
      linux: {
        url: `${BASE_URL}/v2.1.0/MixFade-2.1.0.AppImage`,
        filename: 'MixFade-2.1.0.AppImage',
        size: '89.3 MB'
      }
    }
  },
  {
    version: '2.0.1',
    date: '2024-05-20',
    size: '82.1 MB',
    changes: [
      'Fixed audio dropouts on Windows',
      'Updated UI components',
      'Minor performance improvements'
    ],
    downloads: {
      windows: {
        url: `${BASE_URL}/v2.0.1/MixFade-Setup-2.0.1.exe`,
        filename: 'MixFade-Setup-2.0.1.exe',
        size: '82.1 MB'
      },
      macos: {
        url: `${BASE_URL}/v2.0.1/MixFade-2.0.1.dmg`,
        filename: 'MixFade-2.0.1.dmg',
        size: '84.2 MB'
      },
      linux: {
        url: `${BASE_URL}/v2.0.1/MixFade-2.0.1.AppImage`,
        filename: 'MixFade-2.0.1.AppImage',
        size: '86.1 MB'
      }
    }
  },
  {
    version: '2.0.0',
    date: '2024-04-10',
    size: '80.5 MB',
    changes: [
      'Complete UI redesign',
      'New mixing engine',
      'Advanced crossfade controls',
      'Multi-format audio support'
    ],
    downloads: {
      windows: {
        url: `${BASE_URL}/v2.0.0/MixFade-Setup-2.0.0.exe`,
        filename: 'MixFade-Setup-2.0.0.exe',
        size: '80.5 MB'
      },
      macos: {
        url: `${BASE_URL}/v2.0.0/MixFade-2.0.0.dmg`,
        filename: 'MixFade-2.0.0.dmg',
        size: '82.3 MB'
      },
      linux: {
        url: `${BASE_URL}/v2.0.0/MixFade-2.0.0.AppImage`,
        filename: 'MixFade-2.0.0.AppImage',
        size: '84.1 MB'
      }
    }
  },
  {
    version: '1.5.2',
    date: '2024-02-28',
    size: '75.8 MB',
    changes: [
      'Stability improvements',
      'Fixed memory leaks',
      'Updated dependencies'
    ],
    downloads: {
      windows: {
        url: `${BASE_URL}/v1.5.2/MixFade-Setup-1.5.2.exe`,
        filename: 'MixFade-Setup-1.5.2.exe',
        size: '75.8 MB'
      },
      macos: {
        url: `${BASE_URL}/v1.5.2/MixFade-1.5.2.dmg`,
        filename: 'MixFade-1.5.2.dmg',
        size: '77.5 MB'
      },
      linux: {
        url: `${BASE_URL}/v1.5.2/MixFade-1.5.2.AppImage`,
        filename: 'MixFade-1.5.2.AppImage',
        size: '79.2 MB'
      }
    }
  }
];

// Analytics configuration
export const ANALYTICS_CONFIG = {
  // Enable/disable analytics tracking
  enabled: true,
  
  // Local storage key for download data
  storageKey: 'mixfade_downloads',
  
  // Maximum number of download records to keep locally
  maxRecords: 1000,
  
  // Analytics endpoints (replace with your actual analytics service)
  endpoints: {
    track: 'https://analytics.mixfade.app/track',
    batch: 'https://analytics.mixfade.app/batch'
  }
};

// Platform detection mappings
export const PLATFORM_MAPPINGS = {
  windows: {
    name: 'Windows',
    userAgentKeys: ['win'],
    fileExtension: '.exe',
    icon: 'Monitor'
  },
  macos: {
    name: 'macOS',
    userAgentKeys: ['mac'],
    fileExtension: '.dmg',
    icon: 'Smartphone'
  },
  linux: {
    name: 'Linux',
    userAgentKeys: ['linux'],
    fileExtension: '.AppImage',
    icon: 'HardDrive'
  }
};