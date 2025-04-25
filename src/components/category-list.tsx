import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  DollarSign,
  Cpu,
  ShoppingBag,
  BookOpen,
  Film,
  Zap,
  HeartPulse,
  Cloud,
  Globe,
  Users,
  Shield,
  Activity,
  Server,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";

const categoryMapping: { [key: string]: { label: string; slug: string } } = {
  Technology:     { label: "Tech",           slug: "tech" },
  Fintech:        { label: "Fintech",        slug: "fintech" },
  Agritech:       { label: "Agritech",       slug: "agritech" },
  "E-commerce":   { label: "E-commerce",     slug: "ecommerce" },
  Edutech:        { label: "Edutech",        slug: "edutech" },
  Entertainment:  { label: "Entertainment",  slug: "entertainment" },
  Energy:         { label: "Energy",         slug: "energy" },
  Healthtech:     { label: "Healthtech",     slug: "healthtech" },
  SaaS:           { label: "SaaS",           slug: "saas" },
  AI:             { label: "AI & ML",        slug: "ai-ml" },
  Blockchain:     { label: "Blockchain",     slug: "blockchain" },
  Cloud:          { label: "Cloud",          slug: "cloud" },
  SocialImpact:   { label: "Social Impact",  slug: "social-impact" },
  Cybersecurity:  { label: "Cybersecurity",  slug: "cybersecurity" },
  BioTech:        { label: "Biotech",        slug: "biotech" },
  Media:          { label: "Media",          slug: "media" },
  Mobility:       { label: "Mobility",       slug: "mobility" },
};

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Technology:     Code,
  Fintech:        DollarSign,
  Agritech:       Cpu,            
  "E-commerce":   ShoppingBag,
  Edutech:        BookOpen,
  Entertainment:  Film,
  Energy:         Zap,
  Healthtech:     HeartPulse,
  SaaS:           Server,
  AI:             Activity,
  Blockchain:     Shield,
  Cloud:          Cloud,
  SocialImpact:   Users,
  Cybersecurity:  Shield,
  BioTech:        Activity,      
  Media:          Film,
  Mobility:       Globe,
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

        const categoryList: Category[] = Object.keys(categoryCounts).map((name) => ({
          name,
          count: categoryCounts[name],
          slug:
            categoryMapping[name]?.slug ||
            name.toLowerCase().replace(/\s+/g, "-"),
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
