import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Landmark,
  Leaf,
  ShoppingBag,
  Truck,
  Utensils,
  Wifi,
  Zap,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";

const categoryMapping: { [key: string]: { label: string; slug: string } } = {
  Technology: { label: "Tech", slug: "tech" },
  Fintech: { label: "Fintech", slug: "fintech" },
  Agriculture: { label: "Agriculture", slug: "agriculture" },
  "E-commerce": { label: "E-commerce", slug: "ecommerce" },
  "Food & Beverage": { label: "Food & Beverage", slug: "food" },
  Logistics: { label: "Logistics", slug: "logistics" },
  Telecommunications: { label: "Telecommunications", slug: "telecom" },
  Energy: { label: "Energy", slug: "energy" },
};

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Technology: Code,
  Fintech: Landmark,
  Agriculture: Leaf,
  "E-commerce": ShoppingBag,
  "Food & Beverage": Utensils,
  Logistics: Truck,
  Telecommunications: Wifi,
  Energy: Zap,
};

interface Category {
  name: string;
  count: number;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const startupsCollection = collection(db, "startups");
        const querySnapshot = await getDocs(startupsCollection);
        const categoryCounts: { [key: string]: number } = {};

        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const category = data.category || "Uncategorized";
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        console.log("Category counts:", categoryCounts); 

        const categoryList: Category[] = Object.keys(categoryCounts).map((name) => ({
          name,
          count: categoryCounts[name],
          slug: categoryMapping[name]?.slug || name.toLowerCase().replace(/\s+/g, "-"),
          icon: categoryIcons[name] || Code, 
        }));

        categoryList.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {categories.length === 0 ? (
        <p className="col-span-full text-center text-muted-foreground">
          No categories found
        </p>
      ) : (
        categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              to={`/startups?category=${category.slug}`}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="p-3 rounded-full bg-red-100 mb-3">
                <Icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-medium text-center">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {category.count} startup{category.count !== 1 ? "s" : ""}
              </p>
            </Link>
          );
        })
      )}
    </div>
  );
}