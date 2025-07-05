#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const DOCS_SOURCE = '!docs';
const DOCS_TARGET = process.env.RAILWAY_ENVIRONMENT ? 'docs' : 'backend/docs';

/**
 * Cross-platform copy function
 */
async function copyDocs() {
  console.log('🔄 Syncing documentation...');
  console.log(`📁 Source: ${DOCS_SOURCE}`);
  console.log(`📁 Target: ${DOCS_TARGET}`);
  console.log(`📁 Current working directory: ${process.cwd()}`);
  console.log(`📁 __dirname: ${__dirname}`);
  console.log(`📁 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`📁 RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT}`);
  console.log(`📁 Full DOCS_SOURCE path: ${path.resolve(DOCS_SOURCE)}`);
  console.log(`📁 Full DOCS_TARGET path: ${path.resolve(DOCS_TARGET)}`);
  
  // List all files in current directory for debugging
  try {
    const currentDirContents = await fs.readdir('.');
    console.log(`📋 Current directory contents: ${currentDirContents.join(', ')}`);
  } catch (err) {
    console.log(`❌ Could not read current directory: ${err.message}`);
  }

  try {
    // Check if source exists
    console.log(`🔍 Checking if source exists: ${DOCS_SOURCE}`);
    
    // Try to get detailed info about the source
    try {
      const sourceStat = await fs.stat(DOCS_SOURCE);
      console.log(`✅ Source directory found - isDirectory: ${sourceStat.isDirectory()}`);
      
      // Also check absolute path
      const absoluteSourcePath = path.resolve(DOCS_SOURCE);
      console.log(`🔍 Absolute source path: ${absoluteSourcePath}`);
      const absoluteSourceStat = await fs.stat(absoluteSourcePath);
      console.log(`✅ Absolute source confirmed - isDirectory: ${absoluteSourceStat.isDirectory()}`);
      
    } catch (statError) {
      console.log(`❌ Source stat failed: ${statError.message}`);
      
      // Try to list what's actually in the current directory
      console.log('🔍 Attempting to find !docs or similar directories...');
      const allItems = await fs.readdir('.', { withFileTypes: true });
      const directories = allItems.filter(item => item.isDirectory()).map(item => item.name);
      console.log(`📁 Available directories: ${directories.join(', ')}`);
      
      // Look for any docs-related directories
      const docsLike = directories.filter(dir => dir.toLowerCase().includes('docs'));
      console.log(`📚 Docs-like directories: ${docsLike.join(', ')}`);
      
      // Check if the absolute source path exists
      const absoluteSourcePath = path.resolve(DOCS_SOURCE);
      console.log(`🔍 Checking absolute source path: ${absoluteSourcePath}`);
      try {
        const absoluteSourceStat = await fs.stat(absoluteSourcePath);
        console.log(`✅ Absolute source found - isDirectory: ${absoluteSourceStat.isDirectory()}`);
      } catch (absSourceError) {
        console.log(`❌ Absolute source also failed: ${absSourceError.message}`);
      }
      
      throw statError;
    }
    
    // List source contents for debugging
    const sourceContents = await fs.readdir(DOCS_SOURCE);
    console.log(`📋 Source contents: ${sourceContents.join(', ')}`);
    
    // Remove target if it exists
    console.log(`🗑️ Removing existing target: ${DOCS_TARGET}`);
    try {
      await fs.rm(DOCS_TARGET, { recursive: true, force: true });
      console.log('✅ Target directory removed');
    } catch (err) {
      console.log('ℹ️ Target directory did not exist');
    }

    // Create target directory
    console.log(`📁 Creating target directory: ${DOCS_TARGET}`);
    await fs.mkdir(DOCS_TARGET, { recursive: true });
    console.log('✅ Target directory created');

    // Copy recursively
    console.log('📋 Starting recursive copy...');
    await copyRecursive(DOCS_SOURCE, DOCS_TARGET);
    
    // Verify the copy worked
    const targetContents = await fs.readdir(DOCS_TARGET);
    console.log(`📋 Target contents after copy: ${targetContents.join(', ')}`);
    
    // Extra verification: check if target directory actually exists at absolute path
    const absoluteTargetPath = path.resolve(DOCS_TARGET);
    console.log(`🔍 Verifying absolute target path exists: ${absoluteTargetPath}`);
    try {
      const absoluteStats = await fs.stat(absoluteTargetPath);
      console.log(`✅ Absolute target confirmed - isDirectory: ${absoluteStats.isDirectory()}`);
      const absoluteContents = await fs.readdir(absoluteTargetPath);
      console.log(`📋 Absolute target contents: ${absoluteContents.join(', ')}`);
    } catch (absError) {
      console.error(`❌ Absolute target verification failed: ${absError.message}`);
    }
    
    console.log('✅ Documentation synced successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error syncing documentation:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // In Railway build environment, we want to fail the build if docs sync fails
    if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
      console.error('❌ CRITICAL: Documentation sync failed in production environment');
      process.exit(1);
    }
    
    return false;
  }
}

/**
 * Recursive copy function
 */
async function copyRecursive(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  await fs.mkdir(dest, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Watch for changes in docs directory
 */
function watchDocs() {
  console.log('👀 Watching for changes in documentation...');
  console.log('💡 Press Ctrl+C to stop watching');
  
  try {
    const chokidar = require('chokidar');
    
    const watcher = chokidar.watch(DOCS_SOURCE, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    let syncTimeout;

    watcher
      .on('add', (path) => debounceSync(`📄 Added: ${path}`))
      .on('change', (path) => debounceSync(`📝 Changed: ${path}`))
      .on('unlink', (path) => debounceSync(`🗑️  Deleted: ${path}`))
      .on('addDir', (path) => debounceSync(`📁 Added directory: ${path}`))
      .on('unlinkDir', (path) => debounceSync(`🗑️  Deleted directory: ${path}`))
      .on('error', (error) => console.error('❌ Watcher error:', error))
      .on('ready', () => console.log('✅ Initial scan complete. Ready for changes.'));

    function debounceSync(message) {
      console.log(message);
      
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        copyDocs();
      }, 500); // Wait 500ms for multiple rapid changes
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping documentation watcher...');
      watcher.close();
      process.exit(0);
    });
  } catch (error) {
    console.log('❌ chokidar not found. Please install it:');
    console.log('npm install chokidar --save-dev');
    console.log('💡 Falling back to simple sync for now');
    copyDocs();
  }
}

/**
 * Check if documentation is in sync
 */
async function checkSync() {
  try {
    const sourceExists = await fs.access(DOCS_SOURCE).then(() => true).catch(() => false);
    const targetExists = await fs.access(DOCS_TARGET).then(() => true).catch(() => false);

    if (!sourceExists) {
      console.log('❌ Source documentation directory (!docs) not found');
      return false;
    }

    if (!targetExists) {
      console.log('⚠️  Target documentation directory (backend/docs) not found');
      console.log('💡 Run: npm run docs:sync');
      return false;
    }

    // Simple check - compare directory contents
    const sourceFiles = await getFileList(DOCS_SOURCE);
    const targetFiles = await getFileList(DOCS_TARGET);

    if (sourceFiles.length !== targetFiles.length) {
      console.log('⚠️  Documentation appears to be out of sync');
      console.log(`📊 Source files: ${sourceFiles.length}, Target files: ${targetFiles.length}`);
      console.log('💡 Run: npm run docs:sync');
      return false;
    }

    console.log('✅ Documentation appears to be in sync');
    console.log(`📊 ${sourceFiles.length} files found`);
    return true;
  } catch (error) {
    console.error('❌ Error checking sync status:', error.message);
    return false;
  }
}

/**
 * Get list of all files in directory recursively
 */
async function getFileList(dir, fileList = []) {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      await getFileList(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'sync':
      const syncResult = await copyDocs();
      if (!syncResult) {
        console.error('❌ Documentation sync failed');
        process.exit(1);
      }
      break;
    
    case 'watch':
      watchDocs();
      break;
    
    case 'check':
      const checkResult = await checkSync();
      if (!checkResult) {
        console.error('❌ Documentation check failed');
        process.exit(1);
      }
      break;
    
    default:
      console.log(`
📚 MixFade Landing Documentation Sync Tool

Usage:
  node sync-docs.js sync    - Sync documentation once
  node sync-docs.js watch   - Watch for changes and auto-sync
  node sync-docs.js check   - Check if docs are in sync

NPM Scripts:
  npm run docs:sync         - Same as 'sync'
  npm run docs:watch        - Same as 'watch'
  npm run docs:check        - Same as 'check'

Description:
  This tool syncs documentation from the '!docs' directory to 'backend/docs'
  where the backend documentation service can serve them via API endpoints.
`);
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error in main:', error);
    process.exit(1);
  });
}

module.exports = { copyDocs, watchDocs, checkSync };