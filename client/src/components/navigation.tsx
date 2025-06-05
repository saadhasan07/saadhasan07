import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Menu, X, Globe, ChevronDown } from "lucide-react";


export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Scroll detection to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "skills", "projects", "experience", "blog", "talks", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "about", label: t("nav.about") },
    { id: "projects", label: t("nav.projects") },
    { id: "experience", label: t("nav.experience") },
    { id: "blog", label: t("nav.blog") },
    { id: "talks", label: t("nav.talks") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-colors duration-300">
      <div className="container-width">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("about")}
              className="text-xl font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors logo-hover"
            >
              Saad Hasan
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative nav-item group ${
                    activeSection === item.id
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400 rounded-full nav-active-indicator"></div>
                  )}
                  
                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-green-600/10 dark:bg-green-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                  
                  {/* Hover underline effect */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 dark:bg-green-400 rounded-full group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">

            {/* Language Toggle - Custom Implementation */}
            <div className="relative language-dropdown">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 language-selector bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700/80 border border-slate-600/50"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium">{language.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
              
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-slate-800/95 backdrop-blur-md rounded-lg border border-slate-600/50 shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setIsLanguageOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("de");
                      setIsLanguageOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                  >
                    Deutsch
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="theme-toggle p-2"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 relative group mobile-nav-item ${
                  activeSection === item.id
                    ? "text-primary font-semibold bg-primary/10 border-l-2 border-primary"
                    : "text-foreground hover:text-primary hover:bg-muted/50 hover:translate-x-1"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Mobile hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-r-lg scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
