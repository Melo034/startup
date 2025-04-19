import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";
import type { Startup } from "@/types";

const categoryMapping: { [key: string]: { label: string; slug: string } } = {
  Technology: { label: "Tech", slug: "tech" },
  Fintech: { label: "Fintech", slug: "fintech" },
  Agriculture: { label: "Agriculture", slug: "agriculture" },
  "E-commerce": { label: "E-commerce", slug: "ecommerce" },
  "Food & Beverage": { label: "Food & Beverage", slug: "food" },
  Logistics: { label: "Logistics", slug: "logistics" },
  Telecommunications: { label: "Telecommunications", slug: "telecom" },
  Energy: { label: "Energy", slug: "energy" },
  Health: { label: "Health", slug: "health" },
};

const slugToCategory: { [key: string]: string } = Object.keys(categoryMapping).reduce(
  (acc, key) => ({
    ...acc,
    [categoryMapping[key].slug]: key,
  }),
  {},
);

export function StartupList() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const startupsCollection = collection(db, "startups");
        const startupsSnapshot = await getDocs(startupsCollection);
        const startupsList = startupsSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Fetched startup:", data); // Debug log
          const reviews = Array.isArray(data.reviews) ? data.reviews : [];
          const rating =
            typeof data.rating === "number"
              ? data.rating
              : reviews.length > 0
              ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
                reviews.length
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
        setStartups(startupsList);
      } catch (error) {
        console.error("Error fetching startups:", error);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = startups.filter((startup) => {

    const matchesSearch = [startup.name, startup.description, startup.category]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const selectedCategory = searchParams.get("category");
    const selectedCategories = searchParams.get("categories")?.split(",") || [];
    const activeCategories = selectedCategory
      ? [selectedCategory]
      : selectedCategories;
    const matchesCategory =
      activeCategories.length === 0 ||
      activeCategories.includes(
        categoryMapping[startup.category]?.slug ||
          startup.category.toLowerCase().replace(/\s+/g, "-"),
      ) ||
      activeCategories.some((slug) => slugToCategory[slug] === startup.category);

    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const rating =
      typeof startup.rating === "number"
        ? startup.rating
        : startup.reviews.length > 0
        ? startup.reviews.reduce((sum, r) => sum + r.rating, 0) / startup.reviews.length
        : 0;
    const matchesRating = rating >= minRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="space-y-4">
      <div className="relative mx-auto mb-10 max-w-md">
        <Input
          type="search"
          placeholder="Search startups..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {startup.description}
                  </p>
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
      )}
    </div>
  );
}