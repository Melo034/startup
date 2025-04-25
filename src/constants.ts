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
  
  export const categoryMapping: Record<string, { label: string; slug: string }> = {
    Tech: { label: "Tech", slug: "tech" },
    Fintech: { label: "Fintech", slug: "fintech" },
    Agritech: { label: "Agritech", slug: "agritech" },
    "E-commerce": { label: "E-commerce", slug: "ecommerce" },
    Edutech: { label: "Edutech", slug: "edutech" },
    Entertainment: { label: "Entertainment", slug: "entertainment" },
    Energy: { label: "Energy", slug: "energy" },
    Healthtech: { label: "Healthtech", slug: "healthtech" },
    SaaS: { label: "SaaS", slug: "saas" },
    AI: { label: "AI & ML", slug: "ai-ml" },
    Blockchain: { label: "Blockchain", slug: "blockchain" },
    Cloud: { label: "Cloud", slug: "cloud" },
    SocialImpact: { label: "Social Impact", slug: "social-impact" },
    Cybersecurity: { label: "Cybersecurity", slug: "cybersecurity" },
    BioTech: { label: "Biotech", slug: "biotech" },
    Media: { label: "Media", slug: "media" },
    Mobility: { label: "Mobility", slug: "mobility" },
  };
  
  export const slugToCategory: { [key: string]: string } = Object.keys(categoryMapping).reduce(
    (acc, key) => ({
      ...acc,
      [categoryMapping[key].slug]: key,
    }),
    {}
  );
  
  export const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Tech: Code,
    Fintech: DollarSign,
    Agritech: Cpu,
    "E-commerce": ShoppingBag,
    Edutech: BookOpen,
    Entertainment: Film,
    Energy: Zap,
    Healthtech: HeartPulse,
    SaaS: Server,
    AI: Activity,
    Blockchain: Shield,
    Cloud: Cloud,
    SocialImpact: Users,
    Cybersecurity: Shield,
    BioTech: Activity,
    Media: Film,
    Mobility: Globe,
  };