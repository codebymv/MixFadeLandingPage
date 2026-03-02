import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { House, Download, Bug, Book, Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { path: "/", icon: House, label: "Home", exact: true },
    { path: "/download", icon: Download, label: "Download", exact: false },
    { path: "/help", icon: Book, label: "Help", exact: false },
    { path: "/bug-report", icon: Bug, label: "Bug Report", exact: false },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-panel border-b border-slate-700/30 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={closeMobileMenu}
          >
            <img
              src="/lovable-uploads/2b4957a6-9739-4776-bf94-3ac1d6439ccc.png"
              alt="MixFade Icon"
              className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label, exact }) => {
              const active = exact
                ? isActive(path) && location.pathname === path
                : isActive(path);

              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${
                      active ? "text-emerald-400" : ""
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      active ? "text-gradient-emerald-purple" : ""
                    }`}
                  >
                    {label}
                  </span>
                  {/* Active indicator line */}
                  {active && (
                    <span className="absolute -bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <X
                className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-100 rotate-0"
                    : "opacity-0 rotate-90"
                }`}
              />
              <Menu
                className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-0 -rotate-90"
                    : "opacity-100 rotate-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            isMobileMenuOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="glass-panel-strong rounded-xl p-3 space-y-1">
            {navItems.map(({ path, icon: Icon, label, exact }) => {
              const active = exact
                ? isActive(path) && location.pathname === path
                : isActive(path);

              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 ${
                    active
                      ? "text-white bg-gradient-to-r from-emerald-500/10 to-purple-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-emerald-400" : ""}`}
                  />
                  <span
                    className={`font-medium ${
                      active ? "text-gradient-emerald-purple" : ""
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
