import { ApiProduct, Product } from "@/types/product";

export function adaptProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.isPromotional && p.promotionalPrice ? p.promotionalPrice : p.price,
    originalPrice: p.isPromotional && p.promotionalPrice ? p.price : undefined,
    category: p.category?.name ?? p.categoryId,
    images: p.images.map((img) => img.url),
    sizes: p.size ? p.size.split(",").map((s) => s.trim()).filter(Boolean) : [],
    colors: p.color
      ? p.color.split(",").map((hex) => ({ name: hex.trim(), hex: hex.trim() }))
      : [],
    stock: p.stock,
    isSale: p.isPromotional,
  };
}
