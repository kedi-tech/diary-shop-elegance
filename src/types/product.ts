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

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export interface FilterState {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}
