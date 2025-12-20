import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  CreditCard, 
  Smartphone, 
  Truck,
  CheckCircle2,
  Package
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { items, totalPrice, discount, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container-custom px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Commande confirmée !
            </h1>
            <p className="text-muted-foreground mb-8">
              Merci pour votre commande. Vous recevrez un SMS de confirmation avec les détails de livraison.
            </p>
            <div className="bg-muted rounded-xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">Numéro de commande</span>
              </div>
              <p className="font-mono text-lg font-semibold">
                DS-{Date.now().toString().slice(-8)}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/catalogue">
                <Button variant="hero" size="lg" className="w-full">
                  Continuer mes achats
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
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
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Accueil
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/panier" className="text-muted-foreground hover:text-foreground">
              Panier
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Commande</span>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8 md:py-12">
        <Link to="/panier">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ChevronLeft className="h-4 w-4" />
            Retour au panier
          </Button>
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">
          Finaliser la commande
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold mb-6">
                  Informations personnelles
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+225 07 00 00 00 00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">
                    Adresse de livraison
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Rue, quartier, repères..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Abidjan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Instructions de livraison</Label>
                    <Input
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Instructions supplémentaires pour le livreur"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold mb-6">
                  Mode de paiement
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="cash" id="cash" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-muted-foreground">
                        Payez en espèces à la réception de votre commande
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors mt-3 ${
                      paymentMethod === "orange"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="orange" id="orange" />
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Orange Money</p>
                      <p className="text-sm text-muted-foreground">
                        Paiement sécurisé via Orange Money
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-28">
                <h2 className="font-display text-lg font-semibold mb-6">
                  Votre commande
                </h2>

                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                      className="flex gap-3"
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedSize} • {item.selectedColor.name} • x{item.quantity}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">
                          {(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-border pt-4 mb-6">
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
                      {shipping === 0 ? "Gratuite" : `${shipping.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-display text-xl font-bold text-primary">
                        {total.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="cart" 
                  size="xl" 
                  disabled={isLoading}
                >
                  {isLoading ? "Traitement..." : "Confirmer la commande"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
