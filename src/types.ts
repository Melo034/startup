export interface ContactInfo {
    phone: string;
    email: string;
    website: string;
  }
  
  export interface OperatingHours {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  }
  
  export interface Review {
    name: string;
    email: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface Startup {
    id?: string;
    name: string;
    description: string;
    category: string;
    rating: number;
    featured: boolean;
    foundedYear: number;
    imageUrl?: string;
    contact: ContactInfo;
    address: string;
    operatingHours: OperatingHours;
    reviews: Review[];
  }
  