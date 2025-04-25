import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StarIcon} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";
import { mapStartupData } from "../utils/mapStartupData";
import { Startup } from "../types";
import { toast, Toaster } from "sonner";
import Loading from "./utils/Loading";

export function FeaturedStartups() {
  const [featuredStartups, setFeaturedStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedStartups = async () => {
      try {
        setLoading(true);
        const startupsCollection = collection(db, "startups");
        const q = query(startupsCollection, where("featured", "==", true), limit(3));
        const querySnapshot = await getDocs(q);
        const startupsList = querySnapshot.docs.map(mapStartupData);
        setFeaturedStartups(startupsList);
      } catch (error) {
        console.error("Error fetching featured startups:", error);
        setError("Failed to load featured startups.");
        toast.error("Error", { description: "Failed to load featured startups." });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStartups();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 mt-8">{error}</p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
      {featuredStartups.length === 0 ? (
        <p className="col-span-full text-center text-muted-foreground">
          No featured startups found
        </p>
      ) : (
        featuredStartups.map((startup) => (
          <Link to={`/startups/${startup.id}`} key={startup.id} className="group">
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <CardHeader className="p-0">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={startup.imageUrl || import.meta.env.VITE_PLACEHOLDER_IMAGE || "/images/placeholder.jpg"}
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
                <div className="truncate">{startup.contact.email || "No email"}</div>
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
      <Toaster richColors position="top-center" closeButton={false} />
    </div>
  );
}