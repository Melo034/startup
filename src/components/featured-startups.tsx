import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";
import type { Startup } from "@/types";

export function FeaturedStartups() {
  const [featuredStartups, setFeaturedStartups] = useState<Startup[]>([]);

  useEffect(() => {
    const fetchFeaturedStartups = async () => {
      try {
        const startupsCollection = collection(db, "startups");
        const q = query(startupsCollection, where("featured", "==", true), limit(3));
        const querySnapshot = await getDocs(q);
        const startupsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Fetched featured startup:", data); // Debug log
          const reviews = Array.isArray(data.reviews) ? data.reviews : [];
          const rating =
            typeof data.rating === "number"
              ? data.rating
              : reviews.length > 0
              ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
              : 0;
          return {
            id: doc.id,
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            rating,
            featured: data.featured || false,
            foundedYear: data.foundedYear || new Date().getFullYear(),
            imageUrl: data.imageUrl || "",
            contact: {
              phone: data.contact?.phone || "",
              email: data.contact?.email || "",
              website: data.contact?.website || "",
            },
            address: data.address || "",
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
          };
        });
        setFeaturedStartups(startupsList);
      } catch (error) {
        console.error("Error fetching featured startups:", error);
      }
    };

    fetchFeaturedStartups();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
      {featuredStartups.map((startup) => (
        <Link to={`/startups/${startup.id}`} key={startup.id} className="group">
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <CardHeader className="p-0">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={startup.imageUrl || "/images/placeholder.jpg"}
                  alt={startup.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  width={600}
                  height={300}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-red-50">
                  {startup.category}
                </Badge>
                <div className="flex items-center text-amber-500">
                  <StarIcon className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {startup.rating > 0 ? startup.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-red-600 transition-colors">
                {startup.name}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{startup.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="truncate">{startup.contact.email || "No email"}</div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}