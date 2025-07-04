import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { House, Download, Bug, Book, Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: "/", icon: House, label: "Home", exact: true },
    { path: "/download", icon: Download, label: "Download", exact: false },
    { path: "/help", icon: Book, label: "Help", exact: false },
    { path: "/bug-report", icon: Bug, label: "Bug Report", exact: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-700/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <img 
              src="/lovable-uploads/2b4957a6-9739-4776-bf94-3ac1d6439ccc.png" 
              alt="MixFade Icon" 
              className="w-8 h-8"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label, exact }) => (
              <Link 
                key={path}
                to={path} 
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  (exact ? isActive(path) && location.pathname === path : isActive(path))
                    ? "text-white" 
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  (exact ? isActive(path) && location.pathname === path : isActive(path)) 
                    ? "text-emerald-400" 
                    : ""
                }`} />
                <span className={
                  (exact ? isActive(path) && location.pathname === path : isActive(path)) 
                    ? "text-gradient-emerald-purple" 
                    : ""
                }>
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 text-slate-300 hover:text-white transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-panel border-b border-slate-700/50 shadow-lg">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map(({ path, icon: Icon, label, exact }) => (
                  <Link 
                    key={path}
                    to={path} 
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                      (exact ? isActive(path) && location.pathname === path : isActive(path))
                        ? "text-white bg-slate-800/50" 
                        : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      (exact ? isActive(path) && location.pathname === path : isActive(path)) 
                        ? "text-emerald-400" 
                        : ""
                    }`} />
                    <span className={
                      (exact ? isActive(path) && location.pathname === path : isActive(path)) 
                        ? "text-gradient-emerald-purple" 
                        : ""
                    }>
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
