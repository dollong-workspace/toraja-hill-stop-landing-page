import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Toraja Hill Stop Guesthouse | Retreat Alam di Tana Toraja, Indonesia</title>
        <meta
          name="description"
          content="Nikmati ketenangan di Toraja Hill Stop Guesthouse, penginapan nyaman di pegunungan Tana Toraja. Fasilitas lengkap, sarapan inklusif, dekat Patung Jesus Buntu Burake."
        />
        <meta
          name="keywords"
          content="guesthouse Toraja, penginapan Tana Toraja, retreat alam Indonesia, Buntu Burake, akomodasi Rantepao, hotel Makale"
        />
        <link rel="canonical" href="https://torajahillstop.com" />
        <meta property="og:title" content="Toraja Hill Stop Guesthouse | Experience Serenity in Toraja" />
        <meta
          property="og:description"
          content="Your comfortable sanctuary amidst the misty mountains and rich culture of Toraja."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://torajahillstop.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: "Toraja Hill Stop Guesthouse",
            description:
              "A peaceful retreat for travelers in the highlands of Tana Toraja, Indonesia.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Jl. Poros Makale-Rantepao",
              addressLocality: "Tana Toraja",
              addressRegion: "South Sulawesi",
              addressCountry: "ID",
            },
            telephone: "+6281234567890",
            email: "stay@torajahillstop.com",
            priceRange: "$$",
            amenityFeature: [
              { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
              { "@type": "LocationFeatureSpecification", name: "Free Parking" },
              { "@type": "LocationFeatureSpecification", name: "Hot Shower" },
              { "@type": "LocationFeatureSpecification", name: "Breakfast Included" },
            ],
          })}
        </script>
      </Helmet>

      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
