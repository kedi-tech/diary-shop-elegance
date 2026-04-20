import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Plus, Check } from "lucide-react";
import { Product, ProductColor } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFavourites } from "@/context/FavouritesContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { toggleFavourite, isFavourite } = useFavourites();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const liked = isFavourite(product.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    // If no choices needed, add directly
    if (product.sizes.length === 0 && product.colors.length === 0) {
      addToCart(product, "", { name: "Défaut", hex: "#000000" });
      toast({ title: "Ajouté au panier", description: product.name });
      return;
    }
    // Pre-select defaults
    setSelectedSize(product.sizes[0] ?? "");
    setSelectedColor(product.colors[0] ?? null);
    setDialogOpen(true);
  };

  const handleConfirmAdd = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast({ title: "Sélectionnez une taille", variant: "destructive" });
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast({ title: "Sélectionnez une couleur", variant: "destructive" });
      return;
    }
    const size = selectedSize || "";
    const color = selectedColor || { name: "Défaut", hex: "#000000" };
    addToCart(product, size, color);
    toast({ title: "Ajouté au panier", description: product.name });
    setDialogOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group"
      >
        <div className="card-product">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Link to={`/produit/${product.id}`} className="block w-full h-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
              {product.isNew && (
                <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>
              )}
              {product.isSale && discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
              )}
            </div>

            {/* Favourite */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="icon"
                className="h-9 w-9 bg-background/90 backdrop-blur-sm"
                onClick={(e) => { e.preventDefault(); toggleFavourite(product); }}
              >
                <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            {/* Quick add */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Button className="w-full gap-2" size="sm" onClick={handleQuickAdd}>
                <ShoppingBag className="h-4 w-4" />
                Ajouter au panier
              </Button>
            </div>
          </div>

          {/* Info */}
          <Link to={`/produit/${product.id}`}>
            <div className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-semibold text-primary">
                  {product.price.toLocaleString("fr-GN")} GNF
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString("fr-GN")} GNF
                  </span>
                )}
              </div>
              {product.colors.length > 0 && (
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
                    <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Quick-add dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Ajouter au panier</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 mb-4">
            <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium line-clamp-2 mb-1">{product.name}</p>
              <p className="font-display text-lg font-bold text-primary">
                {product.price.toLocaleString("fr-GN")} GNF
              </p>
            </div>
          </div>

          {/* Color picker */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                Couleur{selectedColor ? <span className="text-muted-foreground font-normal"> — {selectedColor.name}</span> : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor?.name === color.name
                        ? "border-primary ring-2 ring-primary ring-offset-1"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && (
                      <Check className={`absolute inset-0 m-auto h-4 w-4 ${color.hex === "#FFFFFF" ? "text-foreground" : "text-background"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size picker */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Taille</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="cart" className="flex-1 gap-2" onClick={handleConfirmAdd}>
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
