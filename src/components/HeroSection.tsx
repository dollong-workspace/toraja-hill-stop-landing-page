import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Misty mountain landscape of Tana Toraja with traditional Tongkonan houses and rice terraces"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center pt-20">
        <div className="max-w-3xl mx-auto">
          {/* Pre-headline Badge */}
          <span className="inline-block bg-accent/80 text-primary font-semibold text-sm md:text-base uppercase tracking-[0.15em] px-5 py-2 rounded-full mb-6 animate-fade-in-up">
            Welcome to Tana Toraja
          </span>

          {/* Main Headline */}
          <h1
            id="hero-heading"
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up animation-delay-100"
          >
            Experience Serenity at
            <br />
            <span className="text-primary">Toraja Hill Stop</span>
          </h1>

          {/* Sub-headline */}
          <p className="font-body text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Your comfortable sanctuary amidst the misty mountains and rich
            culture of Toraja. Wake up to nature and local hospitality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
            <Button variant="cta" size="lg" asChild>
              <a href="#booking">
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Check Availability
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/20 hover:bg-foreground/5"
              asChild
            >
              <a
                href="https://wa.me/6281354617616"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us via WhatsApp"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
