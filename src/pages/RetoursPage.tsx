import { Layout } from "@/components/layout/Layout";
import { RefreshCw, CheckCircle, XCircle, Phone } from "lucide-react";

const RetoursPage = () => (
  <Layout>
    <div className="container-custom px-4 py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-2">Retours & Échanges</h1>
      <p className="text-muted-foreground mb-10">Notre politique de retour et d'échange pour votre satisfaction.</p>

      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 shadow-card flex gap-4">
          <RefreshCw className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold mb-1">Délai de retour</h2>
            <p className="text-sm text-muted-foreground">
              Vous disposez de <strong>7 jours</strong> après réception de votre commande pour effectuer un retour ou un échange.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex gap-4 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
            <h2 className="font-semibold">Articles acceptés en retour</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-2">
            <li>Article non porté, non lavé</li>
            <li>Étiquettes d'origine encore attachées</li>
            <li>Emballage d'origine intact</li>
            <li>Article sans défaut causé par le client</li>
          </ul>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex gap-4 mb-4">
            <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <h2 className="font-semibold">Articles non retournables</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-2">
            <li>Articles portés ou lavés</li>
            <li>Articles sans étiquettes</li>
            <li>Articles en promotion finale</li>
            <li>Accessoires (bijoux, sacs de petite maroquinerie)</li>
          </ul>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card flex gap-4">
          <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold mb-1">Comment initier un retour ?</h2>
            <p className="text-sm text-muted-foreground">
              Contactez notre service client par téléphone ou email avec votre numéro de commande. Notre équipe vous guidera pour organiser le retour ou l'échange.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default RetoursPage;
