import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getProducts } from "@/api/products";
import { adaptProduct } from "@/lib/adaptProduct";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

export const PromoSection = () => {
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (Array.isArray(data)) {
        const promo = data.filter((p) => p.isPromotional).map(adaptProduct).slice(0, 4);
        setPromoProducts(promo);
      }
    });
  }, []);

  return (
    <section className="section-padding overflow-hidden">
      <div className="container-custom px-4">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
              alt="Promotion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent" />
          </div>

          <div className="relative py-10 sm:py-16 md:py-24 px-5 sm:px-8 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-secondary-foreground">Offre spéciale</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4">
                Jusqu'à -40% sur la nouvelle collection
              </h2>

              <p className="text-lg text-secondary-foreground/80 mb-8">
                Profitez de nos réductions exceptionnelles sur une sélection de robes,
                tops et accessoires. Offre limitée !
              </p>

              <Link to="/catalogue?sale=true">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
                >
                  Voir les offres
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Promo products grid */}
        {promoProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {promoProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
