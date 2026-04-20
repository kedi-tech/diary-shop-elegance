import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/api/categories";
import { useEffect, useState } from "react";
import { Category } from "@/types/product";

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  const visibleCategories = categories.slice(0, 5);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary tracking-wider uppercase"
          >
            Explorer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold mt-2"
          >
            Nos Catégories
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {visibleCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={`/catalogue?category=${category.id}`}
                className="group block"
              >
                <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-1">
                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Voir
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "All categories" card */}
          {categories.length > 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 5 * 0.08 }}
            >
              <Link to="/catalogue" className="group block">
                <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-6 text-center transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-md hover:-translate-y-1">
                  <h3 className="font-display text-base font-semibold text-primary line-clamp-2">
                    Toutes les catégories
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-primary">
                    Explorer
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
