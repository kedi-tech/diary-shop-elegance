import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/api/products";
import { adaptProduct } from "@/lib/adaptProduct";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (Array.isArray(data)) {
        setProducts(data.map(adaptProduct).slice(0, 4));
      }
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary tracking-wider uppercase"
            >
              Tendances
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold mt-2"
            >
              Produits Populaires
            </motion.h2>
          </div>
          <Link to="/catalogue">
            <Button variant="ghost" className="group">
              Voir tout
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
