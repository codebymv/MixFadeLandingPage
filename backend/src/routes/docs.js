const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Function to find the docs directory with comprehensive fallback strategy
function findDocsPath() {
  console.log('Starting docs folder search...');
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  
  // Comprehensive list of possible locations for the docs folder
  const possiblePaths = [
    path.join(__dirname, '../../docs'),          // Copied docs folder in backend/docs
    path.join(__dirname, '../../../!docs'),      // Development: backend/src/routes -> project root
    path.join(__dirname, '../../!docs'),         // Production scenario 1: backend -> project root
    path.join(__dirname, '../!docs'),            // Production scenario 2: src -> project root
    path.join(__dirname, '../../../../!docs'),   // Production scenario 3: deeper nesting
    path.join(process.cwd(), 'docs'),           // Railway: copied docs in working directory
    path.join(process.cwd(), '!docs'),          // Railway: original docs in working directory
    path.join(process.cwd(), '../!docs'),       // One level up from working directory
    path.join(process.cwd(), 'backend/docs'),   // Copied docs in backend subfolder
    '/app/docs',                                // Railway absolute path (common location)
    '/app/!docs',                               // Railway absolute path (original folder)
    '/app/backend/docs',                        // Railway nested backend docs
  ];

  console.log('Checking paths:', possiblePaths);

  // Try each path and return the first one that exists
  for (const docsPath of possiblePaths) {
    try {
      console.log(`Checking path: ${docsPath}`);
      // Check if the path exists and is a directory
      const stats = fs.statSync(docsPath);
      if (stats.isDirectory()) {
        console.log(`✅ Found docs folder at: ${docsPath}`);
        // List contents to verify
        try {
          const contents = fs.readdirSync(docsPath);
          console.log(`Contents: ${contents.join(', ')}`);
        } catch (e) {
          console.log('Could not list contents');
        }
        return docsPath;
      }
    } catch (error) {
      console.log(`❌ Path not found: ${docsPath} - ${error.message}`);
      // Path doesn't exist, try next one
      continue;
    }
  }

  // If no docs folder found, log error and use default
  console.error('!docs folder not found in any expected location. Tried:', possiblePaths);
  return path.join(__dirname, '../../../!docs'); // fallback to original path
}

// Get document content
router.get('/content', async (req, res) => {
  try {
    const { path: docPath } = req.query;
    
    if (!docPath) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    const docsDir = findDocsPath();
    if (!docsDir) {
      return res.status(404).json({ 
        error: 'Documentation directory not found',
        content: getFallbackDocContent(docPath)
      });
    }

    // Construct the full file path
    const fileName = docPath.endsWith('.md') ? docPath : `${docPath}.md`;
    const fullPath = path.join(docsDir, fileName);

    // Security check: ensure the path is within the docs directory
    const resolvedPath = path.resolve(fullPath);
    const resolvedDocsPath = path.resolve(docsDir);
    
    if (!resolvedPath.startsWith(resolvedDocsPath)) {
      return res.status(403).json({
        error: 'Access denied: Path outside docs directory'
      });
    }

    try {
      const content = fs.readFileSync(resolvedPath, 'utf8');
      const stats = fs.statSync(resolvedPath);
    
      res.json({
        content,
        path: docPath,
        lastModified: stats.mtime.toISOString(),
        size: stats.size
      });
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        // File not found, try fallback content
        const fallbackContent = getFallbackDocContent(docPath);
        if (fallbackContent) {
          res.json({
            content: fallbackContent,
            path: docPath,
            lastModified: new Date().toISOString(),
            size: fallbackContent.length,
            source: 'fallback'
          });
        } else {
          res.status(404).json({
            error: 'Document not found',
            path: docPath
          });
        }
      } else {
        throw fileError;
      }
    }
  } catch (error) {
    console.error('Error reading document:', error);
    res.status(500).json({ 
      error: 'Failed to read document',
      content: getFallbackDocContent(req.query.path || 'unknown')
    });
  }
});

// Get documentation structure
router.get('/structure', async (req, res) => {
  try {
    const docsDir = findDocsPath();
    if (!docsDir) {
      return res.json(getDefaultDocStructure());
    }

    const structure = await buildDocStructure(docsDir);
    res.json(structure);
  } catch (error) {
    console.error('Error building doc structure:', error);
    res.status(500).json({ 
      error: 'Failed to build documentation structure',
      structure: getDefaultDocStructure()
    });
  }
});

// Search documents
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const docsDir = findDocsPath();
    if (!docsDir) {
      return res.json([]);
    }

    const results = await searchDocuments(docsDir, query.toLowerCase());
    res.json(results);
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Helper function to build documentation structure
async function buildDocStructure(docsDir, relativePath = '') {
  const items = [];
  const fullPath = path.join(docsDir, relativePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      return items;
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  // Sort: directories first, then files, both alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    
    const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      const children = await buildDocStructure(docsDir, itemPath);
      items.push({
        name: formatName(entry.name),
        path: itemPath,
        type: 'folder',
        children
      });
    } else if (entry.name.endsWith('.md')) {
      const nameWithoutExt = entry.name.replace('.md', '');
      items.push({
        name: formatName(nameWithoutExt),
        path: itemPath.replace('.md', ''),
        type: 'file'
      });
    }
  }

  return items;
  } catch (error) {
    console.error(`Error reading directory ${fullPath}:`, error);
    return items;
  }
}

// Helper function to search documents
async function searchDocuments(docsDir, query, relativePath = '', results = []) {
  const fullPath = path.join(docsDir, relativePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      return results;
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    
    const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      await searchDocuments(docsDir, query, itemPath, results);
    } else if (entry.name.endsWith('.md')) {
      const nameWithoutExt = entry.name.replace('.md', '');
      const docPath = itemPath.replace('.md', '');
      
      // Check if filename matches
      if (nameWithoutExt.toLowerCase().includes(query)) {
        results.push({
          name: formatName(nameWithoutExt),
          path: docPath,
          type: 'file',
          excerpt: `Document: ${formatName(nameWithoutExt)}`
        });
        continue;
      }
      
      // Check if content matches
      try {
        const content = fs.readFileSync(path.join(docsDir, itemPath), 'utf8');
        if (content.toLowerCase().includes(query)) {
          results.push({
            name: formatName(nameWithoutExt),
            path: docPath,
            type: 'file',
            excerpt: extractExcerpt(content, query)
          });
        }
      } catch (error) {
        console.error(`Error reading file ${itemPath}:`, error);
      }
    }
  }

  return results;
  } catch (error) {
    console.error(`Error searching directory ${fullPath}:`, error);
    return results;
  }
}

// Helper function to extract excerpt around search query
function extractExcerpt(content, query) {
  const index = content.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return '';
  
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  let excerpt = content.substring(start, end);
  
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';
  
  return excerpt;
}

// Helper function to format names
function formatName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Fallback content for missing documents
function getFallbackDocContent(docPath) {
  if (docPath === 'getting-started') {
    return `# Getting Started with MixFade

Welcome to MixFade, the ultimate audio mixing and DJ application!

## Quick Start

1. **Download**: Get the latest version from our website
2. **Install**: Run the installer and follow the setup wizard
3. **Launch**: Open MixFade and start mixing!

## Key Features

- **Professional Audio Tools**: Advanced mixing capabilities
- **Real-time Visualization**: Waveforms, spectrograms, and more
- **Cross-platform**: Available on Windows, macOS, and Linux
- **Intuitive Interface**: Easy to learn, powerful to master

## Getting Help

- Check out our documentation sections
- Submit bug reports through our feedback system
- Join our community for tips and tricks

Happy mixing! 🎵`;
  }
  
  return `# ${formatName(docPath)}

This documentation section is coming soon.

In the meantime, you can:
- Explore other sections in the sidebar
- Submit feedback through the bug report form
- Check back later for updates

Thank you for your patience as we continue to improve the documentation!`;
}

// Default documentation structure
function getDefaultDocStructure() {
  return [
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
    }
  ];
}

module.exports = router;