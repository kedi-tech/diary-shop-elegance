import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCcw,
  Minus,
  Plus,
  Check,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { getProductById, getProducts } from "@/api/products";
import { adaptProduct } from "@/lib/adaptProduct";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useFavourites } from "@/context/FavouritesContext";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductColor } from "@/types/product";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCurrentImageIndex(0);
    setSelectedSize("");
    setSelectedColor(null);
    setQuantity(1);

    Promise.all([getProductById(id), getProducts()]).then(([raw, allRaw]) => {
      const p = raw ? adaptProduct(raw) : null;
      setProduct(p);

      if (p && Array.isArray(allRaw)) {
        const all = allRaw.map(adaptProduct);
        setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container-custom px-4 py-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom px-4 py-16 text-center">
          <h1 className="font-display text-2xl mb-4">Produit non trouvé</h1>
          <Link to="/catalogue">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const liked = isFavourite(product.id);

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0] || "";
    const color = selectedColor || product.colors[0] || { name: "Défaut", hex: "#000000" };

    if (product.sizes.length > 0 && !selectedSize) {
      toast({ title: "Sélectionnez une taille", variant: "destructive" });
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast({ title: "Sélectionnez une couleur", variant: "destructive" });
      return;
    }

    addToCart(product, size, color, quantity);
    toast({ title: "Ajouté au panier", description: product.name });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({ title: "Lien copié !" });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b border-border">
        <div className="container-custom px-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Accueil</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/catalogue" className="text-muted-foreground hover:text-foreground">Catalogue</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.isNew && (
                  <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>
                )}
                {product.isSale && discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
                )}
              </div>

              {/* Arrow navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Floating actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="icon"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => toggleFavourite(product)}
                >
                  <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Button
                  size="icon"
                  variant="icon"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                      currentImageIndex === idx ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:py-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </p>

            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="text-destructive font-medium">Rupture de stock</span>
              )}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-primary">
                {product.price.toLocaleString("fr-GN")} GNF
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString("fr-GN")} GNF
                  </span>
                  <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Couleur</span>
                  {selectedColor && (
                    <span className="text-sm text-muted-foreground">{selectedColor.name}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColor?.name === color.name
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          className={`absolute inset-0 m-auto h-5 w-5 ${
                            color.hex === "#FFFFFF" || color.hex === "#F5F5DC"
                              ? "text-foreground"
                              : "text-background"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Taille</span>
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    Guide des tailles
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
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

            {/* Quantity */}
            <div className="mb-8">
              <span className="font-medium block mb-3">Quantité</span>
              <div className="inline-flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="cart"
                size="xl"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.stock === 0 ? "Rupture de stock" : `Ajouter au panier • ${(product.price * quantity).toLocaleString("fr-GN")} GNF`}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 shrink-0"
                onClick={() => toggleFavourite(product)}
              >
                <Heart className={`h-5 w-5 transition-colors ${liked ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Livraison rapide</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Paiement sécurisé</p>
              </div>
              <div className="text-center">
                <RefreshCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Retours 7 jours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
