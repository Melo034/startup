import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, Globe, Mail, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "@/components/review-form";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../server/firebase";
import { mapStartupData } from "../../../utils/mapStartupData";
import { Startup } from "@/types";
import { Navbar } from "@/components/utils/Navbar";
import { Footer } from "@/components/utils/Footer";
import { toast, Toaster } from "sonner";
import Loading from "@/components/utils/Loading";
import facebook from "../../../assets/icons8-facebook-48.png"
import instagram from "../../../assets/icons8-instagram-48.png"

const Startups = () => {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No startup ID provided.");
      setLoading(false);
      return;
    }

    const fetchStartup = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "startups", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStartup(mapStartupData(docSnap));
        } else {
          setError("Startup not found.");
        }
      } catch (error) {
        console.error("Error fetching startup:", error);
        setError("Failed to load startup.");
        toast.error("Error", { description: "Failed to load startup." });
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex justify-center">
              <Loading />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div>
        <Navbar />
        <main className="py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <p className="text-red-600">{error || "Startup not found"}</p>
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
                    aria-label="Back to startups list"
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
                        className={`w-5 h-5 ${i < Math.floor(startup.rating) ? "fill-current" : "stroke-current fill-none"
                          }`}
                        aria-hidden="true"
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
                  src={startup.imageUrl || import.meta.env.VITE_PLACEHOLDER_IMAGE || "/images/placeholder.jpg"}
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
                                  className={`w-4 h-4 ${i < review.rating ? "fill-current" : "stroke-current fill-none"
                                    }`}
                                  aria-hidden="true"
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
                        aria-label={`Call ${startup.contact.phone}`}
                      >
                        {startup.contact.phone || "N/A"}
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
                        aria-label={`Email ${startup.contact.email}`}
                      >
                        {startup.contact.email || "N/A"}
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
                        aria-label={`Visit ${startup.name} website`}
                      >
                        {startup.contact.website.replace(/^https?:\/\//, "") || "N/A"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">{startup.address || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Services</h2>
                <div className="space-y-2">
                  {startup.services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No services listed</p>
                  ) : (
                    startup.services.map((service, index) => (
                      <div key={index} className="font-medium">{service}</div>
                    ))
                  )}
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
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Socials</h2>
                <div className="flex justify-center md:justify-start">
                  <button type="button">
                    <Link to={startup.social?.facebook || "#"} className="group flex justify-center rounded-md drop-shadow-xl font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]">
                      <img src={facebook} alt="" className="w-10 h-10" />
                      <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-xs group-hover:-translate-y-6 duration-700">
                        Facebook
                      </span>
                    </Link>
                  </button>

                  <button type="button">
                    <Link to={startup.social?.instagram || "#"} className="group flex justify-center rounded-md drop-shadow-xl  font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]">
                      <img src={instagram} alt="" className="w-10 h-10" />
                      <span className="absolute opacity-0 group-hover:opacity-100 e group-hover:text-xs group-hover:-translate-y-6 duration-700">
                        Instagram
                      </span>
                    </Link>
                  </button>
                </div>
              </div>
              <Button
                className="w-full"
                asChild
                disabled={!startup.contact.website}
                aria-label={`Visit ${startup.name} website`}
              >
                <a href={startup.contact.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster richColors position="top-center" closeButton={false} />
    </div>
  );
};

export default Startups;