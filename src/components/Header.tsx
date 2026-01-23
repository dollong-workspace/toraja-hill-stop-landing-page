import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Mountain, Calendar, ArrowRight } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Gallery", href: "#gallery" },
    { label: "Location", href: "#location" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Toraja Hill Stop - Home"
        >
          <Mountain
            className="w-6 h-6 text-primary transition-transform group-hover:scale-110"
            aria-hidden="true"
          />
          <span className="font-heading text-xl font-bold text-foreground">
            Toraja Hill Stop
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Button variant="cta" size="sm" asChild>
            <a href="/booking">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Book Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-lg text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
              </a>
            ))}
            <Button variant="cta" className="w-full mt-2" asChild>
              <a href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Book Now
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
