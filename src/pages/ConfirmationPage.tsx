import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, Star, Home, ShoppingBag, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/api/products";
import { adaptProduct } from "@/lib/adaptProduct";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import { AuthModal } from "@/components/auth/AuthModal";

const STEPS = [
  { icon: CheckCircle2, label: "Commandée" },
  { icon: Package,      label: "En traitement" },
  { icon: Truck,        label: "Expédiée" },
  { icon: Star,         label: "Livrée" },
];

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as {
    orderId?: string;
    orderRef?: string;
    cartItems?: { product: { id: string; name: string; images: string[]; price: number }; quantity: number; selectedSize: string; selectedColor: { name: string } }[];
    total?: number;
    subtotal?: number;
    shipping?: number;
    discountAmount?: number;
    paymentMethod?: string;
  } | null;

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!state?.orderId) {
      navigate("/");
      return;
    }
    const orderProductIds = new Set(state.cartItems?.map((i) => i.product.id) ?? []);
    getProducts()
      .then((raw) => {
        if (!Array.isArray(raw)) return;
        const all = raw.map(adaptProduct).filter((p) => !orderProductIds.has(p.id));
        setRecommendations(all.slice(0, 4));
      })
      .finally(() => setLoadingRecs(false));
  }, []);

  if (!state?.orderId) return null;

  const orderRef = state.orderRef ?? `DS-${String(state.orderId).slice(-8).toUpperCase()}`;

  return (
    <Layout>
      <div className="container-custom px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Commande confirmée !</h1>
            <p className="text-muted-foreground">
              Merci pour votre commande. Vous recevrez une confirmation par SMS ou email.
            </p>
            <div className="inline-flex items-center gap-2 mt-4 bg-muted rounded-lg px-4 py-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-mono font-semibold text-sm">{orderRef}</span>
            </div>
          </div>

          {/* Delivery timeline */}
          <div className="bg-card rounded-xl shadow-card p-6 mb-6">
            <h2 className="font-display text-base font-semibold mb-6">Suivi de livraison</h2>
            <div className="flex items-center">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const active = i === 0;
                return (
                  <div key={step.label} className="flex-1 flex flex-col items-center relative">
                    {i < STEPS.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 ${active || i < 0 ? "bg-primary" : "bg-border"}`} />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs mt-2 text-center ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          {state.cartItems && state.cartItems.length > 0 && (
            <div className="bg-card rounded-xl shadow-card p-6 mb-6">
              <h2 className="font-display text-base font-semibold mb-4">Articles commandés</h2>
              <div className="space-y-3">
                {state.cartItems.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-14 h-18 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.selectedSize} · {item.selectedColor.name} · ×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary shrink-0">
                      {(item.product.price * item.quantity).toLocaleString("fr-GN")} GNF
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-1.5">
                {state.subtotal != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{state.subtotal.toLocaleString("fr-GN")} GNF</span>
                  </div>
                )}
                {(state.discountAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Réduction</span>
                    <span>-{state.discountAmount!.toLocaleString("fr-GN")} GNF</span>
                  </div>
                )}
                {state.shipping != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>{state.shipping === 0 ? "Gratuite" : `${state.shipping.toLocaleString("fr-GN")} GNF`}</span>
                  </div>
                )}
                {state.total != null && (
                  <div className="flex justify-between font-semibold pt-1 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{state.total.toLocaleString("fr-GN")} GNF</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guest CTA */}
          {!user && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6 text-center">
              <p className="text-sm font-medium mb-3">Créez un compte pour suivre vos commandes et accéder à votre historique.</p>
              <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>Créer un compte</Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link to="/catalogue" className="flex-1">
              <Button variant="hero" size="lg" className="w-full gap-2">
                <ShoppingBag className="h-4 w-4" /> Continuer mes achats
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Home className="h-4 w-4" /> Accueil
              </Button>
            </Link>
          </div>

          {/* Recommendations */}
          {!loadingRecs && recommendations.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold mb-5">Vous aimerez aussi</h2>
              {loadingRecs ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendations.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab="register" />
    </Layout>
  );
};

export default ConfirmationPage;
