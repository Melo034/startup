import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";
import { categoryMapping, categoryIcons } from "../constants";
import Loading from "./utils/Loading";

interface Category {
  name: string;
  count: number;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const startupsCollection = collection(db, "startups");
        const querySnapshot = await getDocs(startupsCollection);
        const categoryCounts: { [key: string]: number } = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const category = data.category || "Uncategorized";
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const categoryList: Category[] = Object.keys(categoryCounts).map((name) => ({
          name,
          count: categoryCounts[name],
          slug: categoryMapping[name]?.slug || name.toLowerCase().replace(/\s+/g, "-"),
          icon: categoryIcons[name] || categoryIcons.Tech, 
        }));

        categoryList.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
      <Loading/>
      </div>
    );
  }

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
              aria-label={`View startups in ${category.name}`}
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