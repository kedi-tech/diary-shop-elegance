import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const PromoSection = () => {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container-custom px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
              alt="Promotion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative py-16 md:py-24 px-6 md:px-12 lg:px-16">
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

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4">
                Jusqu'à -40% sur la nouvelle collection
              </h2>

              <p className="text-lg text-secondary-foreground/80 mb-8">
                Profitez de nos réductions exceptionnelles sur une sélection de robes, 
                tops et accessoires. Offre limitée !
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalogue?sale=true">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
                  >
                    Voir les offres
                  </Button>
                </Link>
              </div>

              {/* Countdown placeholder */}
              <div className="flex gap-4 mt-8">
                {[
                  { value: "02", label: "Jours" },
                  { value: "14", label: "Heures" },
                  { value: "36", label: "Minutes" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-secondary-foreground/10 backdrop-blur-sm rounded-lg px-4 py-3">
                      <span className="font-display text-2xl font-bold text-secondary-foreground">
                        {item.value}
                      </span>
                    </div>
                    <span className="text-xs text-secondary-foreground/70 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
