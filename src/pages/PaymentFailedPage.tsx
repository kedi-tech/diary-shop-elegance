import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RefreshCcw, Home } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container-custom px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">Paiement échoué</h1>
          <p className="text-muted-foreground mb-8">
            Votre paiement n'a pas pu être traité. Votre commande a été annulée. Aucun montant n'a été débité.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="hero"
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate("/commande")}
            >
              <RefreshCcw className="h-4 w-4" /> Réessayer
            </Button>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Home className="h-4 w-4" /> Retour à l'accueil
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentFailedPage;
