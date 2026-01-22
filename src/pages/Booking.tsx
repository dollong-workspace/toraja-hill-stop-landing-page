import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { format, differenceInDays } from "date-fns";
import { Users, Bed, Wifi, Coffee, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import bedroomImg from "@/assets/bedroom.jpg";

// Room data - in production this would come from Supabase
const ROOMS = [
  { 
    id: "1", 
    room_number: "Kamar 1", 
    name: "Deluxe Mountain View", 
    price_per_night: 750000,
    description: "Experience the breathtaking beauty of Toraja from our Deluxe Mountain View room. This spacious unit features floor-to-ceiling windows, a private balcony for morning coffee, and a modern en-suite bathroom with hot water rain shower.",
    amenities: ["2 Guests", "King Bed", "Fast WiFi", "Breakfast"],
    image: bedroomImg,
  },
  { 
    id: "2", 
    room_number: "Kamar 2", 
    name: "Garden Retreat", 
    price_per_night: 650000,
    description: "A peaceful sanctuary overlooking our lush tropical garden. Wake up to birdsong and enjoy the serene atmosphere of traditional Torajan hospitality with modern comfort.",
    amenities: ["2 Guests", "Queen Bed", "Fast WiFi", "Breakfast"],
    image: bedroomImg,
  },
  { 
    id: "3", 
    room_number: "Kamar 3", 
    name: "Traditional Suite", 
    price_per_night: 850000,
    description: "Our signature room featuring authentic Torajan wood carvings and textiles. Experience the rich cultural heritage while enjoying premium amenities and stunning highland views.",
    amenities: ["2 Guests", "King Bed", "Fast WiFi", "Breakfast"],
    image: bedroomImg,
  },
  { 
    id: "4", 
    room_number: "Kamar 4", 
    name: "Cozy Highland Room", 
    price_per_night: 550000,
    description: "Perfect for solo travelers or couples seeking an intimate escape. This charming room offers all essential comforts with a warm, welcoming ambiance.",
    amenities: ["2 Guests", "Double Bed", "Fast WiFi", "Breakfast"],
    image: bedroomImg,
  },
];

const WHATSAPP_NUMBER = "6281234567890"; // Replace with actual number

const getAmenityIcon = (amenity: string) => {
  if (amenity.includes("Guest")) return Users;
  if (amenity.includes("Bed")) return Bed;
  if (amenity.includes("WiFi")) return Wifi;
  if (amenity.includes("Breakfast")) return Coffee;
  return Users;
};

const Booking = () => {
  const { toast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState<string>("1");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId)!;
  
  // Calculate check-in and check-out from selected dates
  const checkInDate = selectedDates.length > 0 ? selectedDates[0] : undefined;
  const checkOutDate = selectedDates.length > 1 ? selectedDates[selectedDates.length - 1] : undefined;
  const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;
  const totalPrice = selectedRoom ? selectedRoom.price_per_night * (nights || 0) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp ${(amount / 1000).toFixed(0)}k`;
  };

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (selectedDates.length === 0 || selectedDates.length === 2) {
      // Start new selection
      setSelectedDates([date]);
    } else if (selectedDates.length === 1) {
      // Complete the range
      const firstDate = selectedDates[0];
      if (date > firstDate) {
        setSelectedDates([firstDate, date]);
      } else if (date < firstDate) {
        setSelectedDates([date, firstDate]);
      }
    }
  };

  const handleProceedToBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Select Dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (nights < 1) {
      toast({
        title: "Invalid Dates",
        description: "Please select at least one night stay.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save booking to Supabase
      const { error } = await supabase.from("bookings").insert({
        room_id: selectedRoomId,
        guest_name: "Guest", // Will be collected via WhatsApp
        guest_phone: "",
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        check_out_date: format(checkOutDate, "yyyy-MM-dd"),
        number_of_guests: 2,
        total_price: totalPrice,
        status: "pending",
        payment_status: "unpaid",
      });

      if (error) {
        console.error("Booking error:", error);
      }

      // Generate WhatsApp message
      const checkIn = format(checkInDate, "dd MMMM yyyy");
      const checkOut = format(checkOutDate, "dd MMMM yyyy");
      
      const message = `Halo, saya mau pesan kamar di Toraja Hill Stop.

📋 *Detail Pemesanan:*
• Kamar: ${selectedRoom.name} (${selectedRoom.room_number})
• Check-in: ${checkIn}
• Check-out: ${checkOut}
• Durasi: ${nights} malam
• Total: ${formatCurrencyFull(totalPrice)}

Apakah kamar tersedia?`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Redirecting to WhatsApp",
        description: "Complete your booking via WhatsApp.",
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Your Stay - Toraja Hill Stop Guesthouse</title>
        <meta
          name="description"
          content="Book your stay at Toraja Hill Stop Guesthouse. Experience authentic Torajan hospitality with stunning mountain views."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 lg:py-16">
            {/* Title */}
            <div className="mb-8">
              <span className="text-primary text-sm font-medium tracking-wider uppercase">
                RESERVATIONS
              </span>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2">
                Book Your Stay
              </h1>
              <p className="text-muted-foreground font-body mt-2 max-w-xl">
                Select your preferred room to view details and check availability for your retreat in the highlands.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Room Selection & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Room Tabs */}
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                    <Bed className="w-5 h-5 text-primary" />
                    Select Room
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {ROOMS.map((room) => {
                      const isSelected = selectedRoomId === room.id;
                      return (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={cn(
                            "px-4 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2",
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-card border border-border text-foreground hover:bg-accent/50"
                          )}
                        >
                          {room.id === "1" && <Users className="w-4 h-4" />}
                          {room.id === "2" && <Bed className="w-4 h-4" />}
                          {room.id === "3" && <Bed className="w-4 h-4" />}
                          {room.id === "4" && <Bed className="w-4 h-4" />}
                          {room.room_number}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Room Card */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
                  {/* Room Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={selectedRoom.image}
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium uppercase">
                      Available
                    </span>
                  </div>

                  {/* Room Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-foreground">
                          {selectedRoom.name}
                        </h3>
                        <p className="text-primary text-sm font-medium">
                          {selectedRoom.room_number}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-2xl font-bold text-foreground">
                          {formatCurrency(selectedRoom.price_per_night)}
                        </span>
                        <p className="text-muted-foreground text-sm">per night</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                      {selectedRoom.description}
                    </p>

                    {/* Amenities */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {selectedRoom.amenities.map((amenity) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Icon className="w-4 h-4 text-primary/70" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-secondary">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Excellent Choice</span>
                      </div>
                      <button className="text-primary text-sm font-medium hover:underline">
                        View Gallery
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Calendar & Summary */}
              <div className="space-y-6">
                {/* Calendar */}
                <div className="bg-card rounded-2xl border border-border p-4 shadow-soft">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Select Dates
                  </h3>
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      selected: selectedDates,
                      range: checkInDate && checkOutDate ? { from: checkInDate, to: checkOutDate } : undefined,
                    }}
                    modifiersStyles={{
                      selected: { backgroundColor: "hsl(var(--primary))", color: "white" },
                    }}
                    className="pointer-events-auto w-full"
                  />
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-primary" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-muted" />
                      <span>Booked</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-card rounded-2xl border border-border p-5 shadow-soft">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Your Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span className="text-foreground font-medium">{selectedRoom.room_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="text-foreground font-medium">
                        {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="text-foreground font-medium">
                        {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-foreground font-semibold">Total Est.</span>
                      <span className="text-primary font-bold text-lg">
                        {nights > 0 ? formatCurrency(totalPrice) : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!checkInDate || !checkOutDate}
                  >
                    Check Availability
                  </Button>
                  <Button
                    variant="cta"
                    size="lg"
                    className="w-full"
                    onClick={handleProceedToBooking}
                    disabled={isSubmitting || !checkInDate || !checkOutDate}
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Booking"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Pay securely at property.
                  </p>
                </div>
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
