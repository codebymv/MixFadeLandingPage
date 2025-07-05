import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Removed useTheme import - using consistent MFLanding styling
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { docsService, DocStructure } from '../services/docsService';
import Footer from '@/components/Footer';

const DocsPage: React.FC = () => {
  const { '*': docPath } = useParams<{ '*': string }>();
  const navigate = useNavigate();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [docStructure, setDocStructure] = useState<DocStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // MFLanding theme colors and styling
  const bgColor = 'bg-slate-900';
  const sidebarBg = 'glass-panel border-slate-700/50';
  const textColor = 'text-slate-100';
  const mutedTextColor = 'text-slate-400';
  const borderColor = 'border-slate-700/50';
  const hoverBg = 'hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-purple-500/10';
  const activeBg = 'bg-gradient-to-r from-emerald-500/20 to-purple-500/20 border-emerald-500/30';
  const buttonBg = 'glass-panel hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-purple-500/10';
  const shadowClass = 'shadow-slate-900/50';

  // Function to format names for display
  const formatName = (name: string) => {
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Function to filter documentation structure based on search query
  const filterDocStructure = (items: DocStructure[], query: string): DocStructure[] => {
    if (!query.trim()) return items;
    
    const searchLower = query.toLowerCase();
    
    const filterItems = (items: DocStructure[]): DocStructure[] => {
      const filtered: DocStructure[] = [];
      
      for (const item of items) {
        const nameMatches = formatName(item.name).toLowerCase().includes(searchLower);
        const pathMatches = item.path.toLowerCase().includes(searchLower);
        
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          if (nameMatches || pathMatches || filteredChildren.length > 0) {
            filtered.push({
              ...item,
              children: filteredChildren.length > 0 ? filteredChildren : item.children
            });
          }
        } else if (nameMatches || pathMatches) {
          filtered.push(item);
        }
      }
      
      return filtered;
    };
    
    return filterItems(items);
  };

  // Function to recursively render the document tree (sidebar)
  const renderDocTree = (items: DocStructure[], level = 0) => {
    // Safety check to ensure items is an array
    if (!Array.isArray(items)) {
      console.warn('renderDocTree received non-array items:', items);
      return [];
    }
    return items.map((item) => (
      <div key={item.path} style={{ paddingLeft: `${level * 16}px` }}>
        <Link
          to={`/help/${item.path}`}
          className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
            docPath === item.path || (docPath === undefined && item.path === 'getting-started') 
              ? activeBg + ' shadow-sm text-white'
              : `${textColor} ${hoverBg} hover:text-white`
          }`}
          style={{ fontFamily: '"Inter", sans-serif' }}
          onClick={() => setIsSidebarOpen(false)}
        >
          {item.type === 'folder' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-3 flex-shrink-0">
              <path 
                d="M3 7V5C3 3.89543 3.89543 3 5 3H9.58579C10.1716 3 10.7337 3.23179 11.1213 3.61939L12.8787 5.37705C13.2663 5.76466 13.8284 5.99645 14.4142 5.99645H19C20.1046 5.99645 21 6.89188 21 7.99645V9M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H5C3.89543 7 3 7.89543 3 9V7Z" 
                stroke="url(#docsIconGradient)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-3 flex-shrink-0">
              <path 
                d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
                stroke="url(#docsIconGradient)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M14 2V8H20" 
                stroke="url(#docsIconGradient)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
                      <span className={`truncate font-semibold ${
              docPath === item.path || (docPath === undefined && item.path === 'getting-started') 
                ? 'text-gradient-emerald-purple'
                : 'text-slate-300'
            }`}>{formatName(item.name)}</span>
        </Link>
        {item.children && (
          <div className="mt-1 space-y-1">
            {renderDocTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Helper function to find an item by path in the structure
  const findItemByPath = (items: DocStructure[], path: string): DocStructure | null => {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findItemByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchDocContent = async () => {
      setLoading(true);
      try {
        setError(null);
        const effectivePath = (!docPath || docPath === '/') ? 'getting-started' : docPath;

        // Check if this path is a folder in our structure
        const structure = await docsService.getDocStructure();
        const isFolder = findItemByPath(structure, effectivePath)?.type === 'folder';

        let markdownContent: string;
        if (isFolder) {
          markdownContent = docsService.generateFolderContent(effectivePath);
        } else {
          markdownContent = await docsService.getDocContent(effectivePath);
        }

        setMarkdownContent(markdownContent);
      } catch (err) {
        console.error('Error fetching documentation content:', err);
        setError('Failed to load documentation content. Please try again later.');
        setMarkdownContent('');
      } finally {
        setLoading(false);
      }
    };

    const fetchDocStructure = async () => {
      try {
        const structure = await docsService.getDocStructure();
        // Ensure the response data is an array
        const structureData = Array.isArray(structure) ? structure : [];
        setDocStructure(structureData);
      } catch (err) {
        console.error('Error fetching documentation structure:', err);
        // Set empty array on error to prevent .map() issues
        setDocStructure([]);
      }
    };

    fetchDocContent();
    fetchDocStructure();
  }, [docPath]);

  // Hybrid solution: Intelligent height management for both short and long pages
  useEffect(() => {
    const syncHeights = () => {
      if (mainContentRef.current && sidebarRef.current) {
        const isDesktop = window.innerWidth >= 1024; // lg breakpoint
        
        if (isDesktop) {
          // Get measurements
          const mainContentHeight = mainContentRef.current.offsetHeight;
          const sidebarScrollContainer = sidebarRef.current.querySelector('.overflow-y-auto');
          
          if (sidebarScrollContainer) {
            // Get natural sidebar content height
            const sidebarContentHeight = sidebarScrollContainer.scrollHeight;
            const sidebarHeader = sidebarRef.current.querySelector('.p-6.border-b') as HTMLElement;
            const headerHeight = sidebarHeader?.offsetHeight || 0;
            const totalSidebarNeeded = sidebarContentHeight + headerHeight;
            
            // Minimum height to ensure scrollbars appear (viewport constraint)
            const minSidebarHeight = Math.min(window.innerHeight - 80, totalSidebarNeeded);
            
            // Use the larger of: main content height or minimum needed height
            const finalHeight = Math.max(mainContentHeight, minSidebarHeight);
            
            sidebarRef.current.style.height = `${finalHeight}px`;
          } else {
            // Fallback: use itemize.cloud approach
            sidebarRef.current.style.height = `${mainContentHeight}px`;
          }
        } else {
          // On mobile, clear any explicit height to let CSS take over
          sidebarRef.current.style.height = '';
        }
      }
    };

    // Initial sync with slight delay to ensure DOM is ready
    setTimeout(syncHeights, 100);

    // Sync on window resize
    window.addEventListener('resize', syncHeights);

    // Sync when content changes (using MutationObserver)
    const observer = new MutationObserver(() => {
      setTimeout(syncHeights, 50);
    });
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    return () => {
      window.removeEventListener('resize', syncHeights);
      observer.disconnect();
    };
  }, [markdownContent]);

  // Prevent body scroll when sidebar is open on mobile only
  useEffect(() => {
    const handleScrollPrevention = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      
      if (isSidebarOpen && isMobile) {
        // Only prevent body scroll on mobile when sidebar overlay is open
        document.body.style.overflow = 'hidden';
      } else {
        // Allow normal scrolling on desktop or when sidebar is closed
        document.body.style.overflow = '';
      }
    };

    handleScrollPrevention();
    
    // Also handle window resize to ensure proper scroll state
    window.addEventListener('resize', handleScrollPrevention);
    
    return () => {
      // Always restore scroll on cleanup
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleScrollPrevention);
    };
  }, [isSidebarOpen]);

  // Reset scroll state when navigating between pages
  useEffect(() => {
    // Ensure scroll state is properly reset when switching pages
    const resetScrollState = () => {
      // Reset body scroll to ensure it works properly on new pages
      document.body.style.overflow = '';
      
      // Reset sidebar height to allow natural calculation
      if (sidebarRef.current) {
        sidebarRef.current.style.height = '';
        
        // Reset any scroll positions that might be stuck
        const scrollContainer = sidebarRef.current.querySelector('.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      }
    };

    resetScrollState();
  }, [docPath]);

  // Keyboard shortcut to focus search (press "/" key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // Only if not focused on an input/textarea
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          return;
        }
        
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor}`} style={{ fontFamily: '"Inter", sans-serif' }}>
        <div className={`max-w-md mx-auto p-8 text-center rounded-lg border ${borderColor} ${sidebarBg} ${shadowClass}`}>
          <div className="text-lg font-semibold mb-2 text-red-400">
            Documentation Error
          </div>
          <div className={mutedTextColor}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${bgColor} ${textColor} pt-20`} style={{ fontFamily: '"Inter", sans-serif', outline: 'none !important', boxShadow: 'none !important' }}>
      
      {/* SVG Gradient Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="docsIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(16, 185, 129)" />
            <stop offset="100%" stopColor="rgb(168, 85, 247)" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="flex w-full flex-grow">
      {/* Sidebar */}
      <div ref={sidebarRef} className={`w-80 ${sidebarBg} fixed top-20 bottom-0 left-0 transform transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:translate-x-0 lg:self-stretch z-30 border-r ${borderColor} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`} style={{ fontFamily: '"Inter", sans-serif' }}>
        {/* Fixed header area */}
        <div className="p-6 border-b border-slate-600 bg-inherit">
          <h2 className={`text-xl font-bold mb-6 text-gradient-emerald-purple`} style={{ fontFamily: '"Inter", sans-serif' }}>Documentation</h2>

          {/* Search box */}
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation... (Press / to focus)"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderColor} bg-slate-800/50 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors backdrop-blur-sm`}
                style={{ fontFamily: '"Inter", sans-serif' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Search results count */}
            {searchQuery && (
              <div className={`mt-2 text-xs ${mutedTextColor}`} style={{ fontFamily: '"Inter", sans-serif' }}>
                {(() => {
                  const filteredDocs = filterDocStructure(docStructure, searchQuery);
                  const count = filteredDocs.reduce((total, item) => {
                    const countItems = (items: DocStructure[]): number => {
                      return items.reduce((sum, i) => sum + 1 + (i.children ? countItems(i.children) : 0), 0);
                    };
                    return total + countItems([item]);
                  }, 0);
                  
                  return count === 0 
                    ? `No results found` 
                    : `${count} result${count === 1 ? '' : 's'} found`;
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable navigation area */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <nav className="space-y-1">
            {loading && docStructure.length === 0 ? (
              <div className={`text-center py-4 ${mutedTextColor}`} style={{ fontFamily: '"Inter", sans-serif' }}>
                <div className="text-sm">Loading structure...</div>
              </div>
            ) : (
              (() => {
                const filteredDocs = filterDocStructure(docStructure, searchQuery);
                return filteredDocs.length === 0 && searchQuery ? (
                  <div className={`text-center py-4 ${mutedTextColor}`} style={{ fontFamily: '"Inter", sans-serif' }}>
                    <div className="text-sm">No results found for "{searchQuery}"</div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs mt-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  renderDocTree(filteredDocs)
                );
              })()
            )}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div ref={mainContentRef} className="flex-1 min-h-0" style={{ outline: 'none !important', boxShadow: 'none !important' }}>
        {/* Back button and Mobile menu - responsive layout */}
        <div className="py-4">
          {/* Desktop: Back button aligned with logo using container positioning */}
          <div className="hidden lg:block">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                {/* Spacer to match logo position - using estimated logo width */}
                <div className="w-24 sm:w-28 lg:w-32"></div>
                <Button
                  onClick={() => navigate(-1)}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Back and Documentation Menu in same row */}
          <div className="lg:hidden px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/')}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-semibold transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`flex items-center px-4 py-3 rounded-lg ${buttonBg} ${textColor} transition-all duration-300 shadow-sm font-semibold`}
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                <Menu className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Documentation Menu</span>
              </button>
            </div>
          </div>
        </div>



        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

          {loading && !markdownContent ? (
            <div className={`text-center py-12 ${mutedTextColor}`} style={{ fontFamily: '"Inter", sans-serif' }}>
              <div className="text-lg">Loading documentation...</div>
            </div>
          ) : (
            <div 
              className="prose lg:prose-xl max-w-none prose-invert prose-headings:text-gradient-emerald-purple prose-p:text-slate-300 prose-strong:text-slate-200 prose-code:text-emerald-400 prose-pre:bg-slate-800/50 prose-blockquote:text-slate-300 prose-blockquote:border-emerald-500/50 prose-a:text-emerald-400 prose-a:hover:text-emerald-300"
              style={{ 
                fontFamily: '"Inter", sans-serif',
                '--tw-prose-body': '"Inter", sans-serif',
                '--tw-prose-headings': '"Inter", sans-serif',
                '--tw-prose-lead': '"Inter", sans-serif',
                '--tw-prose-links': '"Inter", sans-serif',
                '--tw-prose-bold': '"Inter", sans-serif',
                '--tw-prose-counters': '"Inter", sans-serif',
                '--tw-prose-bullets': '"Inter", sans-serif',
                '--tw-prose-hr': '"Inter", sans-serif',
                '--tw-prose-quotes': '"Inter", sans-serif',
                '--tw-prose-quote-borders': '"Inter", sans-serif',
                '--tw-prose-captions': '"Inter", sans-serif',
                '--tw-prose-kbd': '"Inter", sans-serif',
                '--tw-prose-code': '"Inter", sans-serif',
                '--tw-prose-pre-code': '"Inter", sans-serif',
                '--tw-prose-th-borders': '"Inter", sans-serif'
              } as React.CSSProperties}
            >
              <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-slate-200 prose-li:text-slate-200 prose-strong:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default DocsPage;