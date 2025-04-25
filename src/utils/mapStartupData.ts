import type { Startup } from "../types";
import type { DocumentData } from "firebase/firestore";

export const mapStartupData = (doc: DocumentData): Startup => {
  const data = doc.data();
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  return {
    id: doc.id,
    name: data.name || "",
    description: data.description || "",
    category: data.category || "",
    rating: Number(rating.toFixed(1)), 
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
    social: data.social || { facebook: "", instagram: "" },
    services: data.services || [],
  };
};