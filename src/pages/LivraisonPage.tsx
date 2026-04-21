import { Layout } from "@/components/layout/Layout";
import { Truck, Clock, MapPin, Phone } from "lucide-react";

const LivraisonPage = () => (
  <Layout>
    <div className="container-custom px-4 py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-2">Livraison</h1>
      <p className="text-muted-foreground mb-10">Toutes les informations sur la livraison de vos commandes.</p>

      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 shadow-card flex gap-4">
          <Truck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold mb-1">Livraison à domicile</h2>
            <p className="text-sm text-muted-foreground">
              Nous livrons directement à votre adresse. Les frais de livraison sont calculés lors de la commande selon votre zone.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card flex gap-4">
          <Clock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold mb-1">Délais de livraison</h2>
            <p className="text-sm text-muted-foreground">
              Les commandes sont livrées sous <strong>24 à 72 heures</strong> après confirmation. Un membre de notre équipe vous contactera pour fixer l'heure de livraison.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card flex gap-4">
          <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold mb-1">Zones desservies</h2>
            <p className="text-sm text-muted-foreground">
              Nous livrons actuellement en Guinée. Pour toute question sur la disponibilité dans votre zone, contactez-nous directement.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card flex gap-4">
          <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold mb-1">Suivi de commande</h2>
            <p className="text-sm text-muted-foreground">
              Connectez-vous à votre compte pour suivre l'état de votre commande en temps réel. Vous pouvez aussi nous contacter par téléphone pour toute question.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default LivraisonPage;
