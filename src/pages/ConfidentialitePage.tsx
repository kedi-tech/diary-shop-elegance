import { Layout } from "@/components/layout/Layout";

const ConfidentialitePage = () => (
  <Layout>
    <div className="container-custom px-4 py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-muted-foreground mb-8">Dernière mise à jour : janvier 2025</p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Données collectées</h2>
          <p>
            Lors de votre inscription ou de vos commandes, nous collectons les informations suivantes : nom, adresse email, numéro de téléphone et adresse de livraison. Ces données sont nécessaires au traitement de vos commandes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Utilisation des données</h2>
          <p>Vos données personnelles sont utilisées exclusivement pour :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Le traitement et la livraison de vos commandes</li>
            <li>La communication concernant votre commande</li>
            <li>L'amélioration de nos services</li>
          </ul>
          <p className="mt-2">Nous ne vendons ni ne partageons vos données avec des tiers à des fins commerciales.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Conservation des données</h2>
          <p>
            Vos données sont conservées aussi longtemps que votre compte est actif ou que nécessaire pour fournir nos services. Vous pouvez demander la suppression de votre compte à tout moment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Vos droits</h2>
          <p>
            Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à{" "}
            <a href="mailto:contact@diaryshop.com" className="text-primary hover:underline">contact@diaryshop.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Cookies</h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son bon fonctionnement (session, panier). Aucun cookie publicitaire n'est utilisé.
          </p>
        </section>
      </div>
    </div>
  </Layout>
);

export default ConfidentialitePage;
