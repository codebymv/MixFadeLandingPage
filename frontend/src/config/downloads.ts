// Download configuration for MixFade releases
// Update this file when a new release ships.

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

export const CURRENT_VERSION = '0.9.8';

const BASE_URL = 'https://mixfade.s3.us-east-1.amazonaws.com/releases';

const createDownloads = (
  version: string,
  windowsUrl: string,
  windowsSize: string,
  macosSize = '87.1 MB',
  linuxSize = '89.3 MB'
): VersionInfo['downloads'] => ({
  windows: {
    url: windowsUrl,
    filename: `MixFade Setup ${version}.exe`,
    size: windowsSize,
  },
  macos: {
    url: `${BASE_URL}/macos/MixFade-${version}-macOS-x64.dmg`,
    filename: `MixFade-${version}-macOS-x64.dmg`,
    size: macosSize,
  },
  linux: {
    url: `${BASE_URL}/v${version}/MixFade-${version}.AppImage`,
    filename: `MixFade-${version}.AppImage`,
    size: linuxSize,
  },
});

export const DOWNLOAD_URLS: Record<string, DownloadInfo> = createDownloads(
  CURRENT_VERSION,
  `https://mixfade.s3.us-east-1.amazonaws.com/releases/v${CURRENT_VERSION}/MixFade%20Setup%20${CURRENT_VERSION}.exe`,
  '89.40 MB'
);

export const VERSION_HISTORY: VersionInfo[] = [
  {
    version: '0.9.8',
    date: '2026-04-01',
    size: '89.40 MB download (updated Windows installer)',
    changes: [
      'Deck upload cards now use deck-specific color styling instead of the shared fusion gradient',
      'Crossfade logic extracted into a dedicated hook with improved transition safety',
      'Recent file and visualizer state extracted into dedicated hooks for cleaner app architecture',
      'Renderer logging reduced for cleaner production diagnostics',
      'WaveformPlayer initialization flow simplified to a single source of truth',
      'Bug fixes and stability improvements',
    ],
    downloads: createDownloads(
      '0.9.8',
      'https://mixfade.s3.us-east-1.amazonaws.com/releases/v0.9.8/MixFade%20Setup%200.9.8.exe',
      '89.40 MB'
    ),
  },
  {
    version: '0.9.7',
    date: '2026-03-17',
    size: '82.80 MB download (294.6 MB installed)',
    changes: [
      'New Visualizer tab with seed-driven audio-reactive fullscreen visuals powered by Butterchurn',
      'Saved visualizer seeds that can be reloaded across sessions',
      'Per-deck loop toggle during A/B playback',
      'Collapsible analysis sections for levels, frequencies, stereo, and spectrogram',
      'Deck color theme selector in Settings',
      'Version number displayed in the header and Settings panel',
      'Keyboard shortcut additions including Ctrl+O, 1/2 track switching, and Escape to exit Visualizer',
      'Bug fixes and stability improvements',
    ],
    downloads: createDownloads(
      '0.9.7',
      'https://mixfade.s3.us-east-1.amazonaws.com/releases/v0.9.7/MixFade%20Setup%200.9.7.exe',
      '82.80 MB'
    ),
  },
  {
    version: '0.9.5',
    date: '2026-03-01',
    size: '80.90 MB download (294.6 MB installed)',
    changes: [
      'Release refresh with latest production fixes',
      'Updated security monitoring and download flow hardening',
      'Improved production build hygiene and release consistency',
      'Bug fixes and stability improvements',
    ],
    downloads: createDownloads(
      '0.9.5',
      'https://mixfade.s3.us-east-1.amazonaws.com/releases/v0.9.5/MixFade%20Setup%200.9.5.exe',
      '80.90 MB'
    ),
  },
  {
    version: '0.9.4',
    date: '2025-07-03',
    size: '80.90 MB download (294.6 MB installed)',
    changes: [
      'Hotfix release with linting improvements and functionality refinements',
      'Professional Windows installer with one-click installation',
      'Desktop shortcuts and audio file associations',
      'Enhanced crossfade algorithms and playback behavior',
      'Real-time audio visualization improvements',
      'Performance optimizations and stability fixes',
    ],
    downloads: createDownloads(
      '0.9.4',
      'https://mixfade.s3.us-east-1.amazonaws.com/releases/windows/MixFade+Setup+0.9.4.exe',
      '80.90 MB'
    ),
  },
  {
    version: '0.9.3',
    date: '2025-07-02',
    size: '81.06 MB download (294.6 MB installed)',
    changes: [
      'Professional Windows installer replacing the original zip distribution',
      'Initial one-click installation workflow',
      'Automatic audio file associations',
      'Enhanced crossfade algorithms',
      'DJ-style playback controls',
      'Real-time audio visualization',
      'Performance optimizations and bug fixes',
    ],
    downloads: {
      windows: {
        url: 'https://mixfade.s3.us-east-1.amazonaws.com/releases/windows/MixFade-0.9.3-Windows-x64-Setup.exe',
        filename: 'MixFade-0.9.3-Windows-x64-Setup.exe',
        size: '81.06 MB',
      },
      macos: {
        url: `${BASE_URL}/macos/MixFade-0.9.3-macOS-x64.dmg`,
        filename: 'MixFade-0.9.3-macOS-x64.dmg',
        size: '87.1 MB',
      },
      linux: {
        url: `${BASE_URL}/v0.9.3/MixFade-0.9.3.AppImage`,
        filename: 'MixFade-0.9.3.AppImage',
        size: '89.3 MB',
      },
    },
  },
];

export const ANALYTICS_CONFIG = {
  enabled: true,
  storageKey: 'mixfade_downloads',
  maxRecords: 1000,
  endpoints: {
    track: 'https://analytics.mixfade.app/track',
    batch: 'https://analytics.mixfade.app/batch',
  },
};

export const PLATFORM_MAPPINGS = {
  windows: {
    name: 'Windows',
    userAgentKeys: ['win'],
    fileExtension: '.exe',
    icon: 'Monitor',
  },
  macos: {
    name: 'macOS',
    userAgentKeys: ['mac'],
    fileExtension: '.dmg',
    icon: 'Smartphone',
  },
  linux: {
    name: 'Linux',
    userAgentKeys: ['linux'],
    fileExtension: '.AppImage',
    icon: 'HardDrive',
  },
};
