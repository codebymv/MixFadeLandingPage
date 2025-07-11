export interface DocStructure {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: DocStructure[];
}

// Fallback documentation structure (used when backend is unavailable)
export const docStructure: DocStructure[] = [
  {
    name: 'Getting Started',
    path: 'getting-started',
    type: 'file'
  },
  {
    name: 'Getting Started Github',
    path: 'getting-started-github',
    type: 'file'
  },
  {
    name: 'Config',
    path: 'Config',
    type: 'folder',
    children: [
      {
        name: 'Config Overview',
        path: 'Config/config-overview',
        type: 'file'
      }
    ]
  },
  {
    name: 'Stack',
    path: 'Stack',
    type: 'folder',
    children: [
      {
        name: 'Stack Overview',
        path: 'Stack/stack-overview',
        type: 'file'
      }
    ]
  },
  {
    name: 'Types',
    path: 'Types',
    type: 'folder',
    children: [
      {
        name: 'Component Interfaces',
        path: 'Types/component-interfaces',
        type: 'file'
      }
    ]
  },
  {
    name: 'Electron',
    path: 'Electron',
    type: 'folder',
    children: [
      {
        name: 'Architecture',
        path: 'Electron/architecture',
        type: 'file'
      }
    ]
  },
  {
    name: 'Implementations',
    path: 'Implementations',
    type: 'folder',
    children: [
      {
        name: 'Audio Tools',
        path: 'Implementations/AudioTools',
        type: 'folder',
        children: [
          {
            name: 'Audio Tools Overview',
            path: 'Implementations/AudioTools/audio-tools-overview',
            type: 'file'
          },
          {
            name: 'Audio Analysis Overview',
            path: 'Implementations/AudioTools/audio-analysis-overview',
            type: 'file'
          },
          {
            name: 'Frequency Visualizer',
            path: 'Implementations/AudioTools/FrequencyVisualizer',
            type: 'folder',
            children: [
              {
                name: 'Frequency Visualizer Overview',
                path: 'Implementations/AudioTools/FrequencyVisualizer/frequency-visualizer-overview',
                type: 'file'
              }
            ]
          },
          {
            name: 'Level Meters',
            path: 'Implementations/AudioTools/LevelMeters',
            type: 'folder',
            children: [
              {
                name: 'Level Meters Overview',
                path: 'Implementations/AudioTools/LevelMeters/level-meters-overview',
                type: 'file'
              }
            ]
          },
          {
            name: 'Spectrogram Visualizer',
            path: 'Implementations/AudioTools/SpectrogramVisualizer',
            type: 'folder',
            children: [
              {
                name: 'Spectrogram Visualizer Overview',
                path: 'Implementations/AudioTools/SpectrogramVisualizer/spectrogram-visualizer-overview',
                type: 'file'
              }
            ]
          },
          {
            name: 'Stereo Visualizer',
            path: 'Implementations/AudioTools/StereoVisualizer',
            type: 'folder',
            children: [
              {
                name: 'Stereo Visualizer Overview',
                path: 'Implementations/AudioTools/StereoVisualizer/stereo-visualizer-overview',
                type: 'file'
              }
            ]
          }
        ]
      },
      {
        name: 'Local Storage',
        path: 'Implementations/LocalStorage',
        type: 'folder',
        children: [
          {
            name: 'LocalStorage Overview',
            path: 'Implementations/LocalStorage/localstorage-overview',
            type: 'file'
          }
        ]
      },
      {
        name: 'Playback Engine',
        path: 'Implementations/PlaybackEngine',
        type: 'folder',
        children: [
          {
            name: 'PlaybackEngine Overview',
            path: 'Implementations/PlaybackEngine/playbackengine-overview',
            type: 'file'
          }
        ]
      },
      {
        name: 'Sidebar',
        path: 'Implementations/Sidebar',
        type: 'folder',
        children: [
          {
            name: 'Sidebar Overview',
            path: 'Implementations/Sidebar/sidebar-overview',
            type: 'file'
          }
        ]
      },
      {
        name: 'Waveforms',
        path: 'Implementations/Waveforms',
        type: 'folder',
        children: [
          {
            name: 'Waveforms Overview',
            path: 'Implementations/Waveforms/waveforms-overview',
            type: 'file'
          }
        ]
      },
      {
        name: 'AWS',
        path: 'Implementations/AWS',
        type: 'folder',
        children: [
          {
            name: 'S3',
            path: 'Implementations/AWS/S3',
            type: 'folder',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: 'Security',
    path: 'Security',
    type: 'folder',
    children: [
      {
        name: 'Security Overview',
        path: 'Security/security-overview',
        type: 'file'
      }
    ]
  },
  {
    name: 'Deploy',
    path: 'Deploy',
    type: 'folder',
    children: [
      {
        name: 'Build and Deployment',
        path: 'Deploy/build-and-deployment',
        type: 'file'
      }
    ]
  },
  {
    name: 'Version',
    path: 'Version',
    type: 'folder',
    children: [
      {
        name: '0.9.3 Overview',
        path: 'Version/0.9.3-overview',
        type: 'file'
      }
    ]
  }
];

export const fetchDocContent = async (path: string): Promise<string> => {
  try {
    // Use backend API to fetch document content
    const apiUrl = import.meta.env.VITE_API_URL || 'https://mixfade-frontend-production.up.railway.app';
    const response = await fetch(`${apiUrl}/api/docs/content?path=${encodeURIComponent(path)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.content || `# Document Not Found\n\nThe requested document at path "${path}" could not be found.`;
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error loading document:', error);
    return `# Error Loading Document\n\nThere was an error loading the document at path "${path}".`;
  }
};

class DocsService {
  async getDocContent(path: string): Promise<string> {
    // Use the new fetchDocContent function to get real markdown files
    return await fetchDocContent(path);
  }

  async getDocStructure(): Promise<DocStructure[]> {
    try {
      // Use backend API to fetch document structure
      const apiUrl = import.meta.env.VITE_API_URL || 'https://mixfade-frontend-production.up.railway.app';
      const response = await fetch(`${apiUrl}/api/docs/structure`);
      
      if (!response.ok) {
        console.warn('Failed to fetch doc structure from backend, using fallback');
        return docStructure;
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : docStructure;
    } catch (error) {
      console.error('Error fetching doc structure:', error);
      return docStructure;
    }
  }

  async searchDocuments(query: string): Promise<DocStructure[]> {
    try {
      if (!query.trim()) {
        return [];
      }
      
      // Use backend API to search documents
      const apiUrl = import.meta.env.VITE_API_URL || 'https://mixfade-frontend-production.up.railway.app';
      const response = await fetch(`${apiUrl}/api/docs/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        console.warn('Failed to search documents from backend');
        return [];
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  generateFolderContent(path: string): string {
    const folder = this.findFolderByPath(docStructure, path);

    if (!folder || folder.type !== 'folder') {
      return this.getFallbackContent(path);
    }

    const folderName = folder.name;
    let content = `# ${folderName}\n\n`;

    // Add breadcrumb navigation for nested folders
    const pathSegments = path.split('/');
    if (pathSegments.length > 1) {
      pathSegments.forEach((segment, index) => {
        const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

        if (index === 0) {
          content += `[${capitalizedSegment}](/help/${segment})`;
        } else {
          const segmentPath = pathSegments.slice(0, index + 1).join('/');
          content += ` > [${capitalizedSegment}](/help/${segmentPath})`;
        }
      });
      content += `\n\n`;
    }

    // Add description based on folder
    content += this.getFolderDescription(path, folderName) + `\n\n`;

    if (folder.children && folder.children.length > 0) {
      content += `## Contents\n\n`;
      
      folder.children.forEach(child => {
        const icon = child.type === 'folder' ? '📁' : '📄';
        content += `- ${icon} [${child.name}](/help/${child.path})\n`;
      });
    }

    return content;
  }

  private findFolderByPath(structure: DocStructure[], path: string): DocStructure | null {
    for (const item of structure) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = this.findFolderByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  private getFallbackContent(path: string): string {
    return `# ${this.formatPathName(path)}

This documentation section is coming soon.

In the meantime, you can:
- Explore other sections in the sidebar
- Submit feedback through the bug report form
- Check back later for updates

Thank you for your patience as we continue to improve the documentation!
`;
  }

  private formatPathName(path: string): string {
    return path
      .split('/')
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase()) || 'Documentation';
  }

  private getFolderDescription(path: string, folderName: string): string {
    const descriptions: Record<string, string> = {
      'Config': 'Configuration settings, environment variables, API endpoints, and deployment configurations for MixFade.',
      'Types': 'Understanding the type system and interfaces used throughout MixFade.',
      'Stack': 'Technical architecture and technology stack overview.',
      'Security': 'Security guidelines, best practices, and implementation details.',
      'Implementations': 'Detailed implementation guides for MixFade features and components.',
      'Implementations/AudioTools': 'Audio processing and manipulation tools.',
      'Implementations/LocalStorage': 'Local storage and data persistence mechanisms.',
      'Implementations/PlaybackEngine': 'Audio playback and timeline control systems.',
      'Implementations/Sidebar': 'Sidebar navigation and panel management.',
      'Implementations/Waveforms': 'Waveform visualization and interaction features.',
      'Implementations/AWS': 'Amazon Web Services integration and cloud storage solutions.',
      'Electron': 'Electron-specific implementation details and platform integration.',
      'Deploy': 'Application building, packaging, and distribution processes.',
      'Version': 'Version history, release notes, and changelog information.',
    };

    return descriptions[path] || `Documentation for the ${folderName} section.`;
  }

  private getGettingStartedGitHubContent(): string {
    return `# Getting Started with MixFade Development

## Repository Setup

This guide will help you set up the MixFade development environment from the GitHub repository.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/mixfade.git
cd mixfade
\`\`\`

### Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Development Scripts

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Start electron app
npm run electron:dev
\`\`\`

### Project Structure

\`\`\`
mixfade/
├── src/                 # Source code
├── public/              # Static assets
├── dist/                # Build output
├── scripts/             # Build scripts
└── package.json         # Dependencies
\`\`\`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For more detailed development information, see the other documentation sections.
`;
  }
}

export const docsService = new DocsService();