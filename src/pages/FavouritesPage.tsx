import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { useFavourites } from "@/context/FavouritesContext";
import { Button } from "@/components/ui/button";

const FavouritesPage = () => {
  const { favourites } = useFavourites();

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b border-border">
        <div className="container-custom px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Accueil</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Mes Favoris</span>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <h1 className="font-display text-2xl md:text-3xl font-bold">Mes Favoris</h1>
          <span className="text-muted-foreground text-sm">({favourites.length} article{favourites.length !== 1 ? "s" : ""})</span>
        </div>

        {favourites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">Aucun favori pour l'instant</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Parcourez notre catalogue et ajoutez vos articles préférés à vos favoris.
            </p>
            <Link to="/catalogue">
              <Button variant="hero" size="lg">
                Découvrir le catalogue
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favourites.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavouritesPage;
