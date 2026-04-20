export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  description: string;
  icon?: string;
  subCategories?: SubCategory[];
}

export interface ApiProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice: number | null;
  isPromotional: boolean;
  stock: number;
  size: string | null;
  color: string | null;
  categoryId: string;
  subCategoryId: string | null;
  isActive: boolean;
  images: ApiProductImage[];
  category?: { id: string; name: string };
  subCategory?: { id: string; name: string };
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export interface FilterState {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}
