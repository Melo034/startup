import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";
import { categoryMapping, slugToCategory } from "../constants";
import { mapStartupData } from "../utils/mapStartupData";
import { Startup } from "../types";
import { toast, Toaster } from "sonner";
import Loading from "./utils/Loading";

export function StartupList() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const startupsCollection = collection(db, "startups");
        const startupsSnapshot = await getDocs(startupsCollection);
        const startupsList = startupsSnapshot.docs.map(mapStartupData);
        setStartups(startupsList);
      } catch (error) {
        console.error("Error fetching startups:", error);
        setError("Failed to load startups.");
        toast.error("Error", { description: "Failed to load startups." });
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = useMemo(() => {
    return startups.filter((startup) => {
      const matchesSearch = [startup.name, startup.description, startup.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const selectedCategory = searchParams.get("category");
      const selectedCategories = searchParams.get("categories")?.split(",") || [];
      const activeCategories = selectedCategory ? [selectedCategory] : selectedCategories;
      const matchesCategory =
        activeCategories.length === 0 ||
        activeCategories.includes(
          categoryMapping[startup.category]?.slug ||
            startup.category.toLowerCase().replace(/\s+/g, "-")
        ) ||
        activeCategories.some((slug) => slugToCategory[slug] === startup.category);

      const minRating = parseFloat(searchParams.get("minRating") || "0");
      const matchesRating = startup.rating >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [startups, searchQuery, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 py-12">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto mb-10 max-w-md">
        <Input
          type="search"
          placeholder="Search startups..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search startups"
        />
      </div>
      {filteredStartups.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No startups found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStartups.map((startup) => (
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
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {startup.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
                  <div className="truncate">{startup.contact.email || "No email"}</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Toaster richColors position="top-center" closeButton={false} />
    </div>
  );
}