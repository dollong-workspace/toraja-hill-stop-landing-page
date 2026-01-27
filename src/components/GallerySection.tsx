import bedroomImage from "@/assets/bedroom.jpeg";
import buntuBurakeImage from "@/assets/burake.jpg";
import breakfastImage from "@/assets/breakfast.jpg";
import bathroomImage from "@/assets/bathroom.jpg";
import burakeViewImage from "@/assets/burake-view.jpeg";
import nightExterior2Image from "@/assets/night-exterior-2.jpg";
import outsideViewImage from "@/assets/outside-view.jpg";

const galleryImages = [
  {
    src: bedroomImage,
    alt: "Cozy bedroom with pink and terracotta bedding at Toraja Hill Stop Guesthouse",
    className: "row-span-2",
  },
  {
    src: buntuBurakeImage,
    alt: "Buntu Burake Jesus Statue near Toraja Hill Stop Guesthouse",
    className: "row-span-2",
  },
  {
    src: breakfastImage,
    alt: "Delicious breakfast spread with fresh fruits and coffee at Toraja Hill Stop",
    className: "",
  },
  {
    src: bathroomImage,
    alt: "Modern bathroom with hot shower at Toraja Hill Stop Guesthouse",
    className: "row-span-2",
  },
  {
    src: nightExterior2Image,
    alt: "Toraja Hill Stop Guesthouse exterior at night with warm lighting and tropical garden",
    className: "row-span-2",
  },
  {
    src: burakeViewImage,
    alt: "Exterior view of Toraja Hill Stop Guesthouse during the day",
    className: "md:hidden",
  },
  {
    src: outsideViewImage,
    alt: "Toraja Hill Stop Guesthouse exterior at night with warm lighting and tropical garden",
    className: "col-span-2",
  },
  {
    src: burakeViewImage,
    alt: "Exterior view of Toraja Hill Stop Guesthouse during the day",
    className: "hidden md:block",
  },
];

const GallerySection = () => {
  return (
    <section
      id="gallery"
      className="py-20 lg:py-28 bg-card"
      aria-labelledby="gallery-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2
            id="gallery-heading"
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Our Spaces
          </h2>
          <p className="font-body text-muted-foreground text-base md:text-lg">
            Explore our cozy rooms, modern amenities, and the beautiful
            surroundings waiting for you.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[180px] md:auto-rows-[200px]">
          {galleryImages.map((image, index) => (
            <figure
              key={index}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${image.className}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
