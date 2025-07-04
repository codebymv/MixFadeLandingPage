import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Download, Bug, Twitter, Github, Globe, ArrowUp, Mail, FileText, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="border-t border-slate-700/50 glass-panel mt-6">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Link to="https://opaquesound.com" className="flex items-center space-x-3">
                {/* <img 
                  src="/lovable-uploads/a6dcb986-37f8-47dc-b994-bf04e1a6a0bc.png" 
                  alt="MixFade icon" 
                  className="w-10 h-auto"
                /> */}
                <img 
                  src="/OS_Initials_Icon_transparent.png" 
                  alt="OpaqueSound icon" 
                  className="w-8 h-auto opacity-90"
                />
              </Link>
            </div>
            {/* <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Audio analysis and comparative playback engine. 
              Seamlessly A/B your audio sources with references.
            </p> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
                              <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-3 text-slate-300 h-auto py-1 transition-colors duration-200 group flex items-center"
                    onClick={() => handleNavigate('/download')}
                  >
                    <Download className="mr-2 h-4 w-4 text-slate-300 group-hover:!text-emerald-400 transition-colors duration-200" />
                    <span className="group-hover:text-gradient-emerald-purple">Download</span>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-3 text-slate-300 h-auto py-1 transition-colors duration-200 group flex items-center"
                    onClick={() => window.open('/help', '_blank')}
                  >
                    <FileText className="mr-2 h-4 w-4 text-slate-300 group-hover:!text-emerald-400 transition-colors duration-200" />
                    <span className="group-hover:text-gradient-emerald-purple">Documentation</span>
                  </Button>
                </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-white">Connect</h3>
            <div className="flex space-x-3 mb-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all duration-200 border-gradient-hover"
                onClick={() => window.open('https://twitter.com/codebymv', '_blank')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all duration-200 border-gradient-hover"
                onClick={() => window.open('https://github.com/codebymv', '_blank')}
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all duration-200 border-gradient-hover"
                onClick={() => window.open('https://codebymv.com', '_blank')}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all duration-200 border-gradient-hover"
                onClick={() => window.open('mailto:support@mixfade.app', '_blank')}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400 mb-4 md:mb-0">
            © {currentYear} OpaqueSound. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 h-auto py-1 transition-colors duration-200 group flex items-center pl-3"
              onClick={() => window.open('/terms', '_blank')}
            >
              <FileText className="mr-1 h-3 w-3 text-slate-300 group-hover:!text-emerald-400 transition-colors duration-200" />
              <span className="group-hover:text-gradient-emerald-purple">Terms of Service</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 flex items-center h-auto py-1 transition-colors duration-200 group pl-3"
              onClick={scrollToTop}
            >
            <ArrowUp className="ml-1 h-4 w-4 text-slate-300 group-hover:!text-emerald-400 transition-colors duration-200" />
              <span className="group-hover:text-gradient-emerald-purple">Back to top</span>

            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 