import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Wifi, Coffee, Mountain, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import bedroomImg from "@/assets/bedroom.jpg";

// Room data - 3 rooms available (Rp 100k per person per night)
const ROOM_PRICE_PER_PERSON = 100000;
const NUM_GUESTS_PER_ROOM = 2;
const TOTAL_ROOMS = 3;

const AMENITIES = [
  { icon: Wifi, label: "WiFi Gratis" },
  { icon: Coffee, label: "Sarapan" },
  { icon: Users, label: "Kamar Nyaman" },
];

const WHATSAPP_NUMBER = "6281354617616";

const Booking = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: "2",
    numberOfRooms: "1",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${(amount / 1000).toFixed(0)}k`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.guestName.trim()) {
      toast({
        title: "Error",
        description: "Mohon isikan nama Anda.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.guestPhone.trim()) {
      toast({
        title: "Error",
        description: "Mohon isikan nomor WhatsApp Anda.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      toast({
        title: "Error",
        description: "Mohon pilih tanggal check-in dan check-out.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      toast({
        title: "Error",
        description: "Tanggal check-out harus setelah check-in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate nights
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Calculate total price (Rp 100k per person per night)
      const totalPrice =
        ROOM_PRICE_PER_PERSON * parseInt(formData.numberOfGuests) * nights;

      // Save to Supabase
      const { error } = await supabase.from("bookings").insert({
        guest_name: formData.guestName,
        guest_phone: formData.guestPhone,
        guest_email: formData.guestEmail || null,
        check_in_date: formData.checkInDate,
        check_out_date: formData.checkOutDate,
        number_of_guests: parseInt(formData.numberOfGuests),
        number_of_rooms: parseInt(formData.numberOfRooms),
        total_price: totalPrice,
        status: "pending",
        payment_status: "unpaid",
      });

      if (error) {
        console.error("Booking error:", error);
      }

      // Generate WhatsApp message
      const checkInFormatted = format(checkIn, "dd MMMM yyyy");
      const checkOutFormatted = format(checkOut, "dd MMMM yyyy");

      const message = `Halo, saya mau pesan kamar di Toraja Hill Stop.

      *Data Tamu:*
Nama: ${formData.guestName}
Nomor WA: ${formData.guestPhone}

*Detail Pemesanan:*
• Check-in: ${checkInFormatted}
• Check-out: ${checkOutFormatted}
• Jumlah Malam: ${nights}
• Jumlah Tamu: ${formData.numberOfGuests}
• Jumlah Kamar: ${formData.numberOfRooms}
• Estimasi Total: Rp ${totalPrice.toLocaleString("id-ID")}

Apakah kamar tersedia?`;

      const whatsappUrl = `https://wa.me/6281354617616?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Success",
        description: "Akan membuka WhatsApp untuk melanjutkan pemesanan.",
      });

      // Reset form
      setFormData({
        guestName: "",
        guestPhone: "",
        guestEmail: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: "2",
        numberOfRooms: "1",
      });
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Mohon coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Pesan Sekarang - Toraja Hill Stop Guesthouse</title>
        <meta
          name="description"
          content="Pesan kamar Anda sekarang di Toraja Hill Stop Guesthouse. Nikmati ketenangan di pegunungan Tana Toraja dengan hospitality autentik."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-8 md:pb-12">
            <div className="container mx-auto px-4 lg:px-8">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Pesan Kamar Anda
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                3 kamar nyaman, harga terjangkau - hanya{" "}
                <span className="font-bold text-primary">
                  Rp {formatCurrency(ROOM_PRICE_PER_PERSON)}
                </span>{" "}
                per orang per malam.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Booking Form */}
              <div className="lg:col-span-2">
                {/* Booking Form */}
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Form Pemesanan
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="font-heading text-base font-semibold text-foreground mb-3">
                        Data Pribadi
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Nama Lengkap *
                          </label>
                          <Input
                            type="text"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleInputChange}
                            placeholder="Nama Anda"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Nomor WhatsApp *
                          </label>
                          <Input
                            type="tel"
                            name="guestPhone"
                            value={formData.guestPhone}
                            onChange={handleInputChange}
                            placeholder="6281234567890"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Email (Opsional)
                          </label>
                          <Input
                            type="email"
                            name="guestEmail"
                            value={formData.guestEmail}
                            onChange={handleInputChange}
                            placeholder="email@contoh.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <h3 className="font-heading text-base font-semibold text-foreground mb-3">
                        Tanggal & Jumlah
                      </h3>
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1.5">
                              Check-in *
                            </label>
                            <Input
                              type="date"
                              name="checkInDate"
                              value={formData.checkInDate}
                              onChange={handleInputChange}
                              required
                              min={format(new Date(), "yyyy-MM-dd")}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1.5">
                              Check-out *
                            </label>
                            <Input
                              type="date"
                              name="checkOutDate"
                              value={formData.checkOutDate}
                              onChange={handleInputChange}
                              required
                              min={
                                formData.checkInDate ||
                                format(new Date(), "yyyy-MM-dd")
                              }
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1.5">
                              Jumlah Tamu *
                            </label>
                            <select
                              name="numberOfGuests"
                              value={formData.numberOfGuests}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                  {num} orang
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1.5">
                              Jumlah Kamar *
                            </label>
                            <select
                              name="numberOfRooms"
                              value={formData.numberOfRooms}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              {[1, 2, 3].map((num) => (
                                <option key={num} value={num}>
                                  {num} kamar
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="cta"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Memproses..." : "Lanjut ke WhatsApp"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Klik tombol di atas untuk melanjutkan via WhatsApp
                    </p>
                  </form>
                </div>
              </div>

              {/* Right Column - Info & Gallery */}
              <div className="lg:col-span-1 space-y-6">
                {/* Info Card */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    ✨ Apa yang Anda Dapat
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Wifi className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>WiFi Cepat & Stabil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Coffee className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Sarapan Gratis Setiap Pagi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Kamar Nyaman & Bersih</span>
                    </li>
                    <li>• AC & Hot Water</li>
                    <li>• Pemandangan Alam</li>
                    <li>• Parkir Gratis</li>
                  </ul>
                </div>

                {/* Quick Chat Card */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    Ada Pertanyaan?
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Chat langsung via WhatsApp untuk info lebih lanjut.
                  </p>
                  <Button variant="cta" size="sm" asChild className="w-full">
                    <a
                      href="https://wa.me/6281354617616"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="bg-card py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Galeri Kamar Kami
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                {[1, 2, 3].map((room) => (
                  <figure
                    key={room}
                    className="relative overflow-hidden rounded-2xl group cursor-pointer"
                  >
                    <img
                      src={bedroomImg}
                      alt={`Kamar ${room} di Toraja Hill Stop Guesthouse`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-heading font-semibold text-white">
                        Kamar {room}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {formatCurrency(ROOM_PRICE_PER_PERSON)}/orang
                      </p>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Booking;
