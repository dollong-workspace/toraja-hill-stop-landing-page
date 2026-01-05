import { Mountain, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <a
              href="#"
              className="flex items-center gap-2 group"
              aria-label="Toraja Hill Stop - Home"
            >
              <Mountain
                className="w-5 h-5 text-primary-foreground/90 transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <span className="font-heading text-lg font-bold">
                Toraja Hill Stop
              </span>
            </a>
            <p className="font-body text-sm text-primary-foreground/60">
              Experience the highlands authentically.
            </p>
          </div>

          {/* Copyright */}
          <p className="font-body text-sm text-primary-foreground/60 text-center">
            © {currentYear} Toraja Hill Stop. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
