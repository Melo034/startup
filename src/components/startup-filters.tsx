import { useState, useEffect, useCallback } from "react";
import { Check, ChevronDown, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../server/firebase";
import { useSearchParams } from "react-router-dom";

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

export function StartupFilters({
  onFilterChange,
}: {
  onFilterChange?: (filters: { categories: string[]; minRating: number }) => void;
}) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState([0]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const startupsCollection = collection(db, "startups");
        const querySnapshot = await getDocs(startupsCollection);
        const categorySet = new Set<string>();

        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const category = data.category || "Uncategorized";
          categorySet.add(category);
        });

        const categoryList = Array.from(categorySet).sort();
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const urlCategories = searchParams.get("categories")?.split(",") || [];
    const urlMinRating = parseFloat(searchParams.get("minRating") || "0");
    setSelectedCategories(
      urlCategories.filter((c) =>
        categories.some(
          (cat) => (categoryMapping[cat]?.slug || cat.toLowerCase()) === c,
        ),
      ),
    );
    setRatingRange([urlMinRating]);
  }, [searchParams, categories]);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }, []);

  const handleApplyFilters = () => {
    const filters = {
      categories: selectedCategories.map(
        (c) =>
          categoryMapping[c]?.slug ||
          categories
            .find((cat) => cat === c)
            ?.toLowerCase()
            ?.replace(/\s+/g, "-") ||
          c,
      ),
      minRating: ratingRange[0],
    };

    const newParams = new URLSearchParams();
    if (filters.categories.length > 0) {
      newParams.set("categories", filters.categories.join(","));
    }
    if (filters.minRating > 0) {
      newParams.set("minRating", filters.minRating.toString());
    }
    setSearchParams(newParams);

    if (onFilterChange) {
      onFilterChange({
        categories: filters.categories,
        minRating: filters.minRating,
      });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setRatingRange([0]);
    setSearchParams({});
    if (onFilterChange) {
      onFilterChange({ categories: [], minRating: 0 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Filters
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.length === 0 ? (
              <DropdownMenuCheckboxItem disabled>
                No categories available
              </DropdownMenuCheckboxItem>
            ) : (
              categories.map((category) => {
                const displayLabel = categoryMapping[category]?.label || category;
                return (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  >
                    {displayLabel}
                  </DropdownMenuCheckboxItem>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:block space-y-4">
        <div>
          <h3 className="font-medium mb-2">Filters</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Narrow down results by applying filters
          </p>

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {selectedCategories.map((category) => {
                const displayLabel = categoryMapping[category]?.label || category;
                return (
                  <div
                    key={category}
                    className="flex items-center bg-red-50 text-red-700 text-xs rounded-full px-2 py-1"
                  >
                    {displayLabel}
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className="ml-1 text-red-700 hover:text-red-900"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <Separator />

        <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <h3 className="font-medium">Categories</h3>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                categoryOpen ? "transform rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1 pt-1">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No categories available
                </p>
              ) : (
                categories.map((category) => {
                  const displayLabel = categoryMapping[category]?.label || category;
                  return (
                    <div
                      key={category}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          selectedCategories.includes(category)
                            ? "border-red-500 bg-red-500"
                            : "border-input"
                        }`}
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {selectedCategories.includes(category) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <label
                        className="text-sm cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {displayLabel}
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <h3 className="font-medium">Minimum Rating</h3>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                ratingOpen ? "transform rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 pt-2">
              <Slider
                defaultValue={[0]}
                max={5}
                step={0.5}
                value={ratingRange}
                onValueChange={setRatingRange}
              />
              <div className="flex justify-between">
                <span className="text-sm">{ratingRange[0]}</span>
                <span className="text-sm">5.0</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Button className="w-full" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}