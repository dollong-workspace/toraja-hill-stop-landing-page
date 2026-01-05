import { Wifi, Car, ShowerHead, Utensils } from "lucide-react";
import interiorImage from "@/assets/interior-decor.jpg";

const amenities = [
  {
    icon: Wifi,
    title: "Free Wi-Fi",
    description: "Stay connected",
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure spot",
  },
  {
    icon: ShowerHead,
    title: "Hot Shower",
    description: "Relaxing bath",
  },
  {
    icon: Utensils,
    title: "Breakfast",
    description: "Included daily",
  },
];

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-20 lg:py-28 bg-background"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with pink/rose accent background */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-accent rounded-3xl rotate-3 scale-[1.02]" />
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={interiorImage}
                alt="Elegant interior decor at Toraja Hill Stop Guesthouse with tropical plant and rattan lamp"
                className="w-full h-auto object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2
              id="about-heading"
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            >
              A Home Away From Home
            </h2>
            <div className="space-y-4 font-body text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              <p>
                Nestled in the highlands, Toraja Hill Stop Guesthouse offers a
                peaceful retreat for travelers seeking authenticity. Whether
                you are here to explore the famous Buntu Burake Jesus Statue or
                immerse yourself in the unique funeral ceremonies, our
                guesthouse provides the perfect base.
              </p>
              <p>
                We pride ourselves on clean facilities, warm showers, and a
                hearty breakfast to start your day. Our garden is a quiet spot
                to relax after a day of adventure.
              </p>
            </div>

            {/* Amenities Grid */}
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4" role="list">
              {amenities.map((amenity) => (
                <li
                  key={amenity.title}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <amenity.icon
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground text-sm">
                      {amenity.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-xs">
                      {amenity.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
