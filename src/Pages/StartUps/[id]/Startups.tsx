import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, Globe, Mail, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "@/components/review-form";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../server/firebase";
import type { Startup } from "@/types";
import { Navbar } from "@/components/utils/Navbar";
import { Footer } from "@/components/utils/Footer";

const Startups = () => {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<Startup | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStartup = async () => {
      try {
        const docRef = doc(db, "startups", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched startup data:", data); // Debug log
          const reviews = Array.isArray(data.reviews) ? data.reviews : [];
          const rating =
            typeof data.rating === "number"
              ? data.rating
              : reviews.length > 0
              ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
              : 0;
          setStartup({
            id: docSnap.id,
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            rating,
            featured: data.featured || false,
            foundedYear: data.foundedYear || new Date().getFullYear(),
            address: data.address || "",
            imageUrl: data.imageUrl || "",
            contact: {
              phone: data.contact?.phone || "",
              email: data.contact?.email || "",
              website: data.contact?.website || "",
            },
            operatingHours: {
              Monday: data.operatingHours?.Monday || "9:00 AM - 5:00 PM",
              Tuesday: data.operatingHours?.Tuesday || "9:00 AM - 5:00 PM",
              Wednesday: data.operatingHours?.Wednesday || "9:00 AM - 5:00 PM",
              Thursday: data.operatingHours?.Thursday || "9:00 AM - 5:00 PM",
              Friday: data.operatingHours?.Friday || "9:00 AM - 5:00 PM",
              Saturday: data.operatingHours?.Saturday || "Closed",
              Sunday: data.operatingHours?.Sunday || "Closed",
            },
            reviews,
          });
        } else {
          console.log("No such document!");
          setStartup(null);
        }
      } catch (error) {
        console.error("Error fetching startup:", error);
        setStartup(null);
      }
    };

    fetchStartup();
  }, [id]);

  if (!startup) {
    return (
      <div>
        <Navbar />
        <main className="py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <p>Startup not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="py-32">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    to="/startups"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to startups
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {startup.name}
                  </h1>
                  <Badge variant="outline" className="bg-emerald-50 ml-2">
                    {startup.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(startup.rating) ? "fill-current" : "stroke-current fill-none"
                        }`}
                      />
                    ))}
                  <span className="ml-2 text-foreground font-medium">
                    {startup.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({startup.reviews.length} reviews)
                  </span>
                </div>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={startup.imageUrl ? `${startup.imageUrl}` : "/images/placeholder.jpg"}
                  alt={startup.name}
                  className="object-cover w-full h-full"
                  width={800}
                  height={400}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">About</h2>
                <p className="text-muted-foreground">{startup.description}</p>
              </div>
              <Tabs defaultValue="reviews">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="write-review">Write a Review</TabsTrigger>
                </TabsList>
                <TabsContent value="reviews" className="space-y-4 pt-4">
                  {startup.reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <h3 className="font-medium">No reviews yet</h3>
                      <p className="text-muted-foreground mt-1">
                        Be the first to review this startup
                      </p>
                    </div>
                  ) : (
                    startup.reviews.map((review, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{review.name}</div>
                          <div className="flex items-center text-amber-500">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "fill-current" : "stroke-current fill-none"
                                  }`}
                                />
                              ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="write-review">
                  <ReviewForm startupId={startup.id!} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a
                        href={`tel:${startup.contact.phone}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {startup.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a
                        href={`mailto:${startup.contact.email}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {startup.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a
                        href={startup.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {startup.contact.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">{startup.address}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Operating Hours</h2>
                <div className="space-y-2">
                  {Object.entries(startup.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <div className="font-medium">{day}</div>
                      <div className="text-sm text-muted-foreground">{hours}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Founded</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">{startup.foundedYear}</div>
                </div>
              </div>
              <Button className="w-full" asChild>
                <a href={startup.contact.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Startups;