import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-secondary-light" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container-custom relative px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-sm font-medium text-primary tracking-wider uppercase mb-4">
              Nouvelle Collection
            </span>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
              Révélez votre{" "}
              <span className="gradient-text">style</span>
              <br />
              unique
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8">
              Découvrez notre collection exclusive de vêtements et accessoires pour femmes. 
              Qualité premium, style intemporel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalogue">
                <Button variant="hero" size="xl" className="group">
                  Découvrir la collection
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/catalogue?sale=true">
                <Button variant="heroOutline" size="xl">
                  Voir les promotions
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <span className="block font-display text-3xl font-bold text-primary">500+</span>
                <span className="text-sm text-muted-foreground">Produits</span>
              </div>
              <div>
                <span className="block font-display text-3xl font-bold text-primary">10k+</span>
                <span className="text-sm text-muted-foreground">Clientes</span>
              </div>
              <div>
                <span className="block font-display text-3xl font-bold text-primary">4.9</span>
                <span className="text-sm text-muted-foreground">Note moyenne</span>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Fashion collection"
                className="w-full rounded-2xl shadow-hover"
              />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-elegant"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80"
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Robe Élégante</p>
                    <p className="text-primary font-semibold">89 990 FCFA</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-primary/20 rounded-full" />
            <div className="absolute -bottom-10 right-20 w-24 h-24 bg-accent/30 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
