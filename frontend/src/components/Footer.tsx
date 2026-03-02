import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, Twitter, Github, Globe, ArrowUp, Mail, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="relative border-t border-slate-800/50 mt-6">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 gradient-divider" />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="https://opaquesound.com" className="inline-block mb-4 group">
              <img
                src="/OS_Initials_Icon_transparent.png"
                alt="OpaqueSound icon"
                className="w-8 h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Professional audio tools crafted with precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xs font-semibold mb-5 text-slate-400 tracking-widest uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  className="flex items-center text-slate-500 hover:text-white transition-colors duration-300 group text-sm"
                  onClick={() => handleNavigate('/download')}
                >
                  <Download className="mr-2 h-3.5 w-3.5 group-hover:text-emerald-400 transition-colors duration-300" />
                  <span>Download</span>
                </button>
              </li>
              <li>
                <button
                  className="flex items-center text-slate-500 hover:text-white transition-colors duration-300 group text-sm"
                  onClick={() => window.open('/help', '_blank')}
                >
                  <FileText className="mr-2 h-3.5 w-3.5 group-hover:text-emerald-400 transition-colors duration-300" />
                  <span>Documentation</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display text-xs font-semibold mb-5 text-slate-400 tracking-widest uppercase">
              Connect
            </h3>
            <div className="flex space-x-2">
              {[
                { icon: Twitter, url: 'https://twitter.com/codebymv', label: 'Twitter' },
                { icon: Github, url: 'https://github.com/codebymv', label: 'GitHub' },
                { icon: Globe, url: 'https://codebymv.com', label: 'Website' },
                { icon: Mail, url: 'mailto:support@mixfade.app', label: 'Email' },
              ].map(({ icon: Icon, url, label }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="icon"
                  className="border-slate-800 text-slate-500 hover:bg-slate-800/60 hover:text-emerald-400 hover:border-slate-700 transition-all duration-300 h-9 w-9"
                  onClick={() => window.open(url, '_blank')}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-600 mb-4 md:mb-0 tracking-wide">
            © {currentYear} OpaqueSound. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <button
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-300 flex items-center gap-1"
              onClick={() => window.open('/terms', '_blank')}
            >
              <FileText className="h-3 w-3" />
              Terms of Service
            </button>
            <button
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-300 flex items-center gap-1"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-3 w-3" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;