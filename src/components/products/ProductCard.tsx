import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/produit/${product.id}`} className="block">
        <div className="card-product">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>
              )}
              {product.isSale && discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="icon" className="h-9 w-9 bg-background/90 backdrop-blur-sm">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Add */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Button className="w-full gap-2" size="sm">
                <ShoppingBag className="h-4 w-4" />
                Voir le produit
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Name */}
            <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span className="text-sm text-muted-foreground">{product.rating}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold text-primary">
                {product.price.toLocaleString('fr-GN')} GNF
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString('fr-GN')} GNF
                </span>
              )}
            </div>

            {/* Colors Preview */}
            <div className="flex items-center gap-1 mt-3">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
