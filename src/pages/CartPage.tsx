import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, ChevronLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    totalPrice, 
    totalItems,
    promoCode,
    applyPromoCode,
    discount
  } = useCart();
  const { toast } = useToast();
  const [promoInput, setPromoInput] = useState("");

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      toast({
        title: "Code promo appliqué",
        description: `Vous bénéficiez de ${discount}% de réduction`,
      });
      setPromoInput("");
    } else {
      toast({
        title: "Code invalide",
        description: "Ce code promo n'existe pas ou a expiré",
        variant: "destructive",
      });
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-custom px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">
              Votre panier est vide
            </h1>
            <p className="text-muted-foreground mb-8">
              Découvrez notre collection et trouvez des articles qui vous plaisent
            </p>
            <Link to="/catalogue">
              <Button variant="hero" size="lg">
                Découvrir la collection
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b border-border">
        <div className="container-custom px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Accueil
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Panier</span>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/catalogue">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Continuer mes achats
            </Button>
          </Link>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">
          Mon Panier ({totalItems} article{totalItems !== 1 ? "s" : ""})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card rounded-xl p-4 shadow-card"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={`/produit/${item.product.id}`} className="flex-shrink-0">
                      <div className="w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <Link to={`/produit/${item.product.id}`}>
                          <h3 className="font-medium hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <span>Taille: {item.selectedSize}</span>
                          <span className="flex items-center gap-1">
                            Couleur:
                            <span
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name,
                              item.quantity - 1
                            )}
                            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-9 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name,
                              item.quantity + 1
                            )}
                            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Price */}
                          <span className="font-display text-lg font-semibold text-primary">
                            {(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </span>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name
                            )}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-card sticky top-28">
              <h2 className="font-display text-xl font-semibold mb-6">Récapitulatif</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Code promo"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Appliquer
                  </Button>
                </div>
                {promoCode && (
                  <p className="text-sm text-primary mt-2">
                    Code {promoCode} appliqué (-{discount}%)
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Réduction (-{discount}%)</span>
                    <span>-{((subtotal * discount) / 100).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-primary font-medium">
                    {subtotal >= 50000 ? "Gratuite" : "2 500 FCFA"}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-display text-xl font-bold text-primary">
                      {(totalPrice + (subtotal < 50000 ? 2500 : 0)).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout */}
              <Link to="/commande">
                <Button variant="cart" size="xl" className="mb-4">
                  Passer la commande
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              {/* Info */}
              <p className="text-xs text-center text-muted-foreground">
                Livraison gratuite à partir de 50 000 FCFA
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
