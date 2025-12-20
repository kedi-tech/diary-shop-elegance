import { Product, Category } from "@/types/product";

export const categories: Category[] = [
  {
    id: "robes",
    name: "Robes",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    description: "Robes élégantes pour toutes les occasions"
  },
  {
    id: "tops",
    name: "Tops & Blouses",
    image: "https://images.unsplash.com/photo-1564246544814-5c8c893a0fd8?w=600&q=80",
    description: "Tops tendance et confortables"
  },
  {
    id: "pantalons",
    name: "Pantalons",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    description: "Pantalons chic et décontractés"
  },
  {
    id: "chaussures",
    name: "Chaussures",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    description: "Chaussures tendance et confortables"
  },
  {
    id: "accessoires",
    name: "Accessoires",
    image: "https://images.unsplash.com/photo-1611923134239-b9be5816e23d?w=600&q=80",
    description: "Accessoires pour parfaire votre look"
  },
  {
    id: "sacs",
    name: "Sacs",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    description: "Sacs élégants pour toutes les occasions"
  }
];

export const products: Product[] = [
  {
    id: "1",
    name: "Robe Élégante Fleurie",
    price: 89.99,
    originalPrice: 129.99,
    description: "Une robe magnifique avec des motifs floraux délicats, parfaite pour les occasions spéciales. Tissu léger et confortable.",
    category: "robes",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Rose", hex: "#F8B4C4" },
      { name: "Vert", hex: "#7CB69D" },
      { name: "Bleu", hex: "#6B8DB9" }
    ],
    stock: 15,
    isNew: true,
    isSale: true,
    rating: 4.8
  },
  {
    id: "2",
    name: "Blouse Satin Luxe",
    price: 59.99,
    description: "Blouse en satin de haute qualité avec une coupe élégante. Idéale pour le bureau ou les sorties.",
    category: "tops",
    images: [
      "https://images.unsplash.com/photo-1564246544814-5c8c893a0fd8?w=800&q=80"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Blanc", hex: "#FFFFFF" },
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Crème", hex: "#F5F5DC" }
    ],
    stock: 23,
    rating: 4.5
  },
  {
    id: "3",
    name: "Pantalon Palazzo Fluide",
    price: 79.99,
    description: "Pantalon palazzo ultra confortable avec une taille haute et une coupe fluide.",
    category: "pantalons",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Beige", hex: "#D4C5B9" },
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Marine", hex: "#1E3A5F" }
    ],
    stock: 18,
    isNew: true,
    rating: 4.7
  },
  {
    id: "4",
    name: "Escarpins Élégants",
    price: 119.99,
    originalPrice: 149.99,
    description: "Escarpins classiques avec un talon confortable de 7cm. Parfaits pour toutes les occasions.",
    category: "chaussures",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Nude", hex: "#E8C8B8" },
      { name: "Rouge", hex: "#C41E3A" }
    ],
    stock: 12,
    isSale: true,
    rating: 4.9
  },
  {
    id: "5",
    name: "Sac à Main Cuir Premium",
    price: 159.99,
    description: "Sac à main en cuir véritable avec des finitions dorées. Spacieux et élégant.",
    category: "sacs",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
    ],
    sizes: ["Unique"],
    colors: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Bordeaux", hex: "#722F37" }
    ],
    stock: 8,
    rating: 4.6
  },
  {
    id: "6",
    name: "Robe Longue Bohème",
    price: 99.99,
    description: "Robe longue style bohème avec des détails brodés. Parfaite pour l'été.",
    category: "robes",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blanc", hex: "#FFFFFF" },
      { name: "Terracotta", hex: "#E2725B" }
    ],
    stock: 10,
    isNew: true,
    rating: 4.4
  },
  {
    id: "7",
    name: "Top Crop Tendance",
    price: 39.99,
    description: "Top crop moderne avec une coupe flatteuse. Parfait avec un jean taille haute.",
    category: "tops",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Vert", hex: "#2D5A4A" },
      { name: "Rose", hex: "#FFB6C1" },
      { name: "Blanc", hex: "#FFFFFF" }
    ],
    stock: 30,
    rating: 4.3
  },
  {
    id: "8",
    name: "Sneakers Élégantes",
    price: 89.99,
    description: "Sneakers confortables avec un design épuré. Parfaites pour un look casual chic.",
    category: "chaussures",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    colors: [
      { name: "Blanc", hex: "#FFFFFF" },
      { name: "Beige", hex: "#F5F5DC" }
    ],
    stock: 25,
    isNew: true,
    rating: 4.7
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};

export const getNewProducts = (): Product[] => {
  return products.filter(p => p.isNew);
};

export const getSaleProducts = (): Product[] => {
  return products.filter(p => p.isSale);
};
