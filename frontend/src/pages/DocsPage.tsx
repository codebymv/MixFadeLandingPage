import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

  const formatName = (name: string) => {
    return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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

  const renderDocTree = (items: DocStructure[], level = 0) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => (
      <div key={item.path} style={{ paddingLeft: `${level * 14}px` }}>
        <Link
          to={`/help/${item.path}`}
          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${docPath === item.path || (docPath === undefined && item.path === 'getting-started')
              ? 'bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          onClick={() => setIsSidebarOpen(false)}
        >
          {item.type === 'folder' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2.5 flex-shrink-0">
              <path
                d="M3 7V5C3 3.89543 3.89543 3 5 3H9.58579C10.1716 3 10.7337 3.23179 11.1213 3.61939L12.8787 5.37705C13.2663 5.76466 13.8284 5.99645 14.4142 5.99645H19C20.1046 5.99645 21 6.89188 21 7.99645V9M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H5C3.89543 7 3 7.89543 3 9V7Z"
                stroke="url(#docsIconGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2.5 flex-shrink-0">
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
          <span className={`truncate font-medium ${docPath === item.path || (docPath === undefined && item.path === 'getting-started')
              ? 'text-gradient-emerald-purple'
              : ''
            }`}>{formatName(item.name)}</span>
        </Link>
        {item.children && (
          <div className="mt-0.5 space-y-0.5">
            {renderDocTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const findItemByPath = (items: DocStructure[], path: string): DocStructure | null => {
    for (const item of items) {
      if (item.path === path) return item;
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
        const structureData = Array.isArray(structure) ? structure : [];
        setDocStructure(structureData);
      } catch (err) {
        console.error('Error fetching documentation structure:', err);
        setDocStructure([]);
      }
    };

    fetchDocContent();
    fetchDocStructure();
  }, [docPath]);

  useEffect(() => {
    const syncHeights = () => {
      if (mainContentRef.current && sidebarRef.current) {
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) {
          const mainContentHeight = mainContentRef.current.offsetHeight;
          const sidebarScrollContainer = sidebarRef.current.querySelector('.overflow-y-auto');
          if (sidebarScrollContainer) {
            const sidebarContentHeight = sidebarScrollContainer.scrollHeight;
            const sidebarHeader = sidebarRef.current.querySelector('.sidebar-header') as HTMLElement;
            const headerHeight = sidebarHeader?.offsetHeight || 0;
            const totalSidebarNeeded = sidebarContentHeight + headerHeight;
            const minSidebarHeight = Math.min(window.innerHeight - 80, totalSidebarNeeded);
            const finalHeight = Math.max(mainContentHeight, minSidebarHeight);
            sidebarRef.current.style.height = `${finalHeight}px`;
          } else {
            sidebarRef.current.style.height = `${mainContentHeight}px`;
          }
        } else {
          sidebarRef.current.style.height = '';
        }
      }
    };

    setTimeout(syncHeights, 100);
    window.addEventListener('resize', syncHeights);
    const observer = new MutationObserver(() => setTimeout(syncHeights, 50));
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current, { childList: true, subtree: true, attributes: true });
    }
    return () => {
      window.removeEventListener('resize', syncHeights);
      observer.disconnect();
    };
  }, [markdownContent]);

  useEffect(() => {
    const handleScrollPrevention = () => {
      const isMobile = window.innerWidth < 1024;
      if (isSidebarOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    handleScrollPrevention();
    window.addEventListener('resize', handleScrollPrevention);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleScrollPrevention);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const resetScrollState = () => {
      document.body.style.overflow = '';
      if (sidebarRef.current) {
        sidebarRef.current.style.height = '';
        const scrollContainer = sidebarRef.current.querySelector('.overflow-y-auto');
        if (scrollContainer) scrollContainer.scrollTop = 0;
      }
    };
    resetScrollState();
  }, [docPath]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return;
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="max-w-md mx-auto p-8 text-center rounded-xl border border-slate-700/30 glass-panel">
          <div className="text-lg font-semibold mb-2 text-red-400">Documentation Error</div>
          <div className="text-slate-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white pt-20 noise-bg relative">
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
        <div
          ref={sidebarRef}
          className={`w-72 glass-panel fixed top-20 bottom-0 left-0 transform transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:translate-x-0 lg:self-stretch z-30 border-r border-slate-800/50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } flex flex-col`}
        >
          {/* Fixed header */}
          <div className="sidebar-header p-5 border-b border-slate-800/50">
            <h2 className="font-display text-lg font-bold mb-5 text-gradient-emerald-purple">Documentation</h2>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs... (Press /)"
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-800/50 bg-slate-800/30 text-slate-200 placeholder-slate-500 text-sm focus:border-emerald-500/30 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-2 text-xs text-slate-500">
                {(() => {
                  const filteredDocs = filterDocStructure(docStructure, searchQuery);
                  const count = filteredDocs.reduce((total, item) => {
                    const countItems = (items: DocStructure[]): number => {
                      return items.reduce((sum, i) => sum + 1 + (i.children ? countItems(i.children) : 0), 0);
                    };
                    return total + countItems([item]);
                  }, 0);
                  return count === 0 ? 'No results found' : `${count} result${count === 1 ? '' : 's'} found`;
                })()}
              </div>
            )}
          </div>

          {/* Scrollable nav */}
          <div className="flex-1 overflow-y-auto p-4 pt-2">
            <nav className="space-y-0.5">
              {loading && docStructure.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-sm">Loading structure...</div>
              ) : (
                (() => {
                  const filteredDocs = filterDocStructure(docStructure, searchQuery);
                  return filteredDocs.length === 0 && searchQuery ? (
                    <div className="text-center py-4 text-slate-500">
                      <div className="text-sm">No results for "{searchQuery}"</div>
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

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div ref={mainContentRef} className="flex-1 min-h-0">
          {/* Navigation bar */}
          <div className="py-4">
            <div className="hidden lg:block">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
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
                  className="flex items-center px-4 py-2.5 rounded-lg glass-panel-strong text-slate-400 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Documentation Menu
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {loading && !markdownContent ? (
              <div className="text-center py-12 text-slate-500 text-lg">Loading documentation...</div>
            ) : (
              <div className="prose lg:prose-xl max-w-none prose-invert prose-headings:font-display prose-headings:text-gradient-emerald-purple prose-p:text-slate-300 prose-strong:text-slate-200 prose-code:text-emerald-400 prose-pre:bg-slate-800/40 prose-pre:border prose-pre:border-slate-700/30 prose-blockquote:text-slate-300 prose-blockquote:border-emerald-500/30 prose-a:text-emerald-400 prose-a:hover:text-emerald-300 prose-a:no-underline prose-a:hover:underline">
                <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
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