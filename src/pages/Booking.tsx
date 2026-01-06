import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Users, Home, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Mock rooms data - in production this would come from Supabase
const ROOMS = [
  { id: "1", room_number: "1", name: "Room 1 - Mountain View", price_per_night: 350000 },
  { id: "2", room_number: "2", name: "Room 2 - Garden View", price_per_night: 350000 },
  { id: "3", room_number: "3", name: "Room 3 - Deluxe Suite", price_per_night: 500000 },
];

const WHATSAPP_NUMBER = "6281234567890"; // Replace with actual number

const Booking = () => {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("1");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoomData = ROOMS.find((r) => r.id === selectedRoom);
  const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;
  const totalPrice = selectedRoomData ? selectedRoomData.price_per_night * nights : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleProceedToBooking = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate || !guestName || !guestPhone) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (nights < 1) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save booking to Supabase
      const { error } = await supabase.from("bookings").insert({
        room_id: selectedRoom,
        guest_name: guestName,
        guest_email: guestEmail || null,
        guest_phone: guestPhone,
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        check_out_date: format(checkOutDate, "yyyy-MM-dd"),
        number_of_guests: parseInt(guestCount),
        total_price: totalPrice,
        status: "pending",
        payment_status: "unpaid",
      });

      if (error) {
        console.error("Booking error:", error);
        // Continue to WhatsApp even if DB fails (they'll setup later)
      }

      // Generate WhatsApp message
      const roomName = selectedRoomData?.name || `Room ${selectedRoom}`;
      const checkIn = format(checkInDate, "dd MMMM yyyy");
      const checkOut = format(checkOutDate, "dd MMMM yyyy");
      
      const message = `Halo, saya mau pesan kamar di Toraja Hill Stop.

📋 *Detail Pemesanan:*
• Nama: ${guestName}
• No. HP: ${guestPhone}
• Kamar: ${roomName}
• Jumlah Tamu: ${guestCount} orang
• Check-in: ${checkIn}
• Check-out: ${checkOut}
• Total: ${formatCurrency(totalPrice)}

Apakah kamar tersedia?`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Booking Request Sent",
        description: "You will be redirected to WhatsApp to confirm your booking.",
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

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-body">Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 lg:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <div className="text-center mb-10">
              <span className="inline-block bg-accent/80 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                RESERVATION
              </span>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Book Your Stay
              </h1>
              <p className="text-muted-foreground font-body">
                Fill in the details below to reserve your room
              </p>
            </div>

            {/* Booking Form */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-soft space-y-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Guest Information
                </h2>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      placeholder="Enter your full name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guestPhone">Phone Number *</Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestEmail">Email (Optional)</Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Room Selection
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Select Room *</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOMS.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Number of Guests *</Label>
                    <Select value={guestCount} onValueChange={setGuestCount}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Select Dates
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1.5",
                            !checkInDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Check-out Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1.5",
                            !checkOutDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          disabled={(date) => date <= (checkInDate || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {selectedRoomData && nights > 0 && (
                <div className="bg-accent/30 rounded-xl p-4 space-y-2">
                  <h3 className="font-heading font-semibold text-foreground">Booking Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{selectedRoomData.name}</span>
                    <span className="text-foreground">{formatCurrency(selectedRoomData.price_per_night)}/night</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground">{nights} night{nights > 1 ? "s" : ""}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                onClick={handleProceedToBooking}
                disabled={isSubmitting}
              >
                <MessageCircle className="w-5 h-5" />
                {isSubmitting ? "Processing..." : "Proceed to Booking via WhatsApp"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                You will be redirected to WhatsApp to confirm your booking with our team.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Booking;
