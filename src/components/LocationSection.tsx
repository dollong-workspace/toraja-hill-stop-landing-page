import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Jl. Poros Makale-Rantepao, Tana Toraja",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+62 812-3456-7890",
    href: "tel:+6281234567890",
  },
  {
    icon: Mail,
    label: "Email",
    value: "stay@torajahillstop.com",
    href: "mailto:stay@torajahillstop.com",
  },
];

const LocationSection = () => {
  return (
    <section
      id="location"
      className="py-20 lg:py-28 bg-background"
      aria-labelledby="location-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Content */}
          <div>
            <h2
              id="location-heading"
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            >
              Find Us in The Hills
            </h2>
            <p className="font-body text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              We are strategically located near major attractions but tucked
              away enough to ensure a good night's sleep. Let us help you plan
              your Toraja adventure.
            </p>

            {/* Contact Info */}
            <address className="not-italic space-y-4 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <info.icon
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wide">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="font-body text-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-body text-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </address>

            {/* CTA Button */}
            <Button variant="cta" size="lg" asChild>
              <a
                href="https://maps.google.com/?q=Tana+Toraja+Indonesia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open location in Google Maps"
              >
                <MapPin className="w-5 h-5" aria-hidden="true" />
                Open in Google Maps
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
          </div>

          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden shadow-medium h-[400px] lg:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127281.75875671!2d119.8!3d-3.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d93f84e3b234567%3A0x12345!2sTana%20Toraja!5e0!3m2!1sen!2sid!4v1699000000000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Toraja Hill Stop Guesthouse location on Google Maps"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
