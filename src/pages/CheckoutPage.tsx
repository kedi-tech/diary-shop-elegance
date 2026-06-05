import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft, CreditCard, Smartphone, Truck, Loader2, LogIn, XCircle,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/api/orders";
import { generatePaymentLink, getPaymentStatus, cancelOrderForPayment } from "@/api/payments";
import { AuthModal } from "@/components/auth/AuthModal";

type PollingState = "idle" | "waiting" | "cancelled";

const CheckoutPage = () => {
  const { items, totalPrice, subtotal: cartSubtotal, discount, discountType, discountAmount, promoCode, clearCart } = useCart();
  const { user, token, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("orange");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pollingState, setPollingState] = useState<PollingState>("idle");
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) setIsAuthModalOpen(true);
  }, [authLoading, user]);

  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name ?? "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: first ?? "",
        lastName: rest.join(" ") ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      }));
    }
  }, [user]);

  // Clean up polling interval on unmount
  useEffect(() => () => { if (pollingRef.current) clearInterval(pollingRef.current); }, []);

  const subtotal = cartSubtotal;
  const shipping = subtotal >= 2500000 ? 0 : 125000;
  const total = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const confirmationState = (orderId: string, orderItems = items) => ({
    orderId,
    orderRef: `DS-${String(orderId).slice(-8).toUpperCase()}`,
    cartItems: orderItems.map(i => ({
      product: { id: i.product.id, name: i.product.name, images: i.product.images, price: i.product.price },
      quantity: i.quantity,
      selectedSize: i.selectedSize,
      selectedColor: i.selectedColor,
    })),
    total,
    subtotal,
    shipping,
    discountAmount,
    paymentMethod,
  });

  const startPolling = (orderId: string, paymentId: string, orderItems = items) => {
    setPollingState("waiting");
    setPendingOrderId(orderId);
    setPendingPaymentId(paymentId);

    pollingRef.current = setInterval(async () => {
      if (!token) return;
      try {
        const status = await getPaymentStatus(token, paymentId);
        const s = (status.status ?? "").toUpperCase();
        if (s === "SUCCESS" || s === "PAID" || s === "COMPLETED") {
          clearInterval(pollingRef.current!);
          clearCart();
          navigate("/confirmation", { state: confirmationState(orderId, orderItems) });
        } else if (s === "FAILED" || s === "CANCELLED" || s === "EXPIRED") {
          clearInterval(pollingRef.current!);
          navigate("/paiement-echoue");
        }
        // otherwise keep polling
      } catch {
        // keep retrying on error
      }
    }, 5000);
  };

  const handleCancelPayment = async () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPollingState("cancelled");
    if (token && pendingOrderId) {
      try { await cancelOrderForPayment(token, pendingOrderId); } catch { /* best-effort */ }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) { setIsAuthModalOpen(true); return; }
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
      toast({ title: "Informations manquantes", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const savedItems = [...items];
    try {
      const order = await createOrder(token, {
        clientId: user.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.selectedSize,
          color: item.selectedColor.hex,
        })),
        total,
        paymentMethod,
        address: `${formData.address}, ${formData.city}${formData.notes ? ` — ${formData.notes}` : ""}`,
      });

      const orderId = String(order?.id ?? order?.orderId ?? Date.now().toString().slice(-8));

      if (paymentMethod === "cash") {
        clearCart();
        navigate("/confirmation", { state: confirmationState(orderId, savedItems) });
        return;
      }

      // Mobile money / card — generate payment link then poll
      const link = await generatePaymentLink(token, orderId, promoCode || undefined);
      window.open(link.paymentUrl, "_blank");
      startPolling(orderId, link.paymentId, savedItems);
    } catch (err: any) {
      toast({
        title: "Erreur lors de la commande",
        description: err?.message ?? "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Payment polling screen
  if (pollingState === "waiting") {
    return (
      <Layout>
        <div className="container-custom px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h1 className="font-display text-xl font-bold mb-2">En attente du paiement</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Complétez le paiement dans l'onglet qui vient de s'ouvrir. Cette page se mettra à jour automatiquement.
            </p>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive border-destructive/30"
              onClick={handleCancelPayment}
            >
              <XCircle className="h-4 w-4" /> Annuler la commande
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (pollingState === "cancelled") {
    return (
      <Layout>
        <div className="container-custom px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm w-full text-center">
            <XCircle className="h-14 w-14 text-muted-foreground mx-auto mb-5" />
            <h1 className="font-display text-xl font-bold mb-2">Commande annulée</h1>
            <p className="text-muted-foreground text-sm mb-6">Votre commande a bien été annulée.</p>
            <Link to="/panier"><Button variant="outline">Retour au panier</Button></Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    navigate("/panier");
    return null;
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b border-border">
        <div className="container-custom px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Accueil</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/panier" className="text-muted-foreground hover:text-foreground">Panier</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Commande</span>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8 md:py-12">
        <Link to="/panier">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ChevronLeft className="h-4 w-4" /> Retour au panier
          </Button>
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-card rounded-xl p-4 sm:p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold mb-6">Informations personnelles</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+224 6XX XX XX XX" required />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-card rounded-xl p-4 sm:p-6 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">Adresse de livraison</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Rue, quartier, repères..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Conakry" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Instructions de livraison</Label>
                    <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Instructions supplémentaires pour le livreur" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-xl p-4 sm:p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold mb-6">Mode de paiement</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value="cash" id="cash" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-muted-foreground">Payez en espèces à la réception de votre commande</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors mt-3 ${paymentMethod === "orange" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value="orange" id="orange" />
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-sm text-muted-foreground">Paiement sécurisé via Mobile Money</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-4 sm:p-6 shadow-card lg:sticky lg:top-28">
                <h2 className="font-display text-lg font-semibold mb-6">Votre commande</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`} className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.selectedSize} • {item.selectedColor.name} • x{item.quantity}</p>
                        <p className="text-sm font-medium text-primary mt-1">{(item.product.price * item.quantity).toLocaleString('fr-GN')} GNF</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{subtotal.toLocaleString('fr-GN')} GNF</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Réduction{discountType === "PERCENTAGE" ? ` (-${discount}%)` : ""}</span>
                      <span>-{discountAmount.toLocaleString('fr-GN')} GNF</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-primary font-medium">{shipping === 0 ? "Gratuite" : `${shipping.toLocaleString('fr-GN')} GNF`}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-display text-xl font-bold text-primary">{total.toLocaleString('fr-GN')} GNF</span>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2.5 mb-4">
                    <LogIn className="h-4 w-4 text-primary shrink-0" />
                    <span>Connectez-vous pour confirmer.</span>
                    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="text-primary underline font-medium shrink-0">Se connecter</button>
                  </div>
                )}

                <Button type="submit" variant="cart" size="xl" disabled={isLoading || !user} className="w-full">
                  {isLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Traitement...</>
                    : paymentMethod === "cash" ? "Confirmer la commande" : "Payer maintenant"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <AuthModal
        open={isAuthModalOpen}
        onSuccess={() => setIsAuthModalOpen(false)}
        onClose={() => {
          setIsAuthModalOpen(false);
          navigate("/panier");
        }}
      />
    </Layout>
  );
};

export default CheckoutPage;
