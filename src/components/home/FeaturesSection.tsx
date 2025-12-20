import { motion } from "framer-motion";
import { Truck, Shield, RefreshCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Livraison rapide",
    description: "Livraison gratuite à partir de 50 000 FCFA"
  },
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "Orange Money et paiement à la livraison"
  },
  {
    icon: RefreshCcw,
    title: "Retours faciles",
    description: "Échanges et retours sous 7 jours"
  },
  {
    icon: Headphones,
    title: "Support client",
    description: "Assistance disponible 7j/7"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-12 border-y border-border bg-muted/20">
      <div className="container-custom px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-sm md:text-base mb-1">{feature.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
