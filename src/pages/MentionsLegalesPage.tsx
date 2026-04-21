import { Layout } from "@/components/layout/Layout";

const MentionsLegalesPage = () => (
  <Layout>
    <div className="container-custom px-4 py-12 max-w-2xl mx-auto prose prose-sm">
      <h1 className="font-display text-3xl font-bold mb-2">Mentions légales</h1>
      <p className="text-muted-foreground mb-8">Dernière mise à jour : janvier 2025</p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Éditeur du site</h2>
          <p>
            Le site <strong>diaryshop.com</strong> est édité par la société Diary Shop, entreprise de vente de vêtements et accessoires pour femmes, basée en Guinée.
          </p>
          <p className="mt-2">Email : <a href="mailto:contact@diaryshop.com" className="text-primary hover:underline">contact@diaryshop.com</a></p>
          <p>Téléphone : <a href="tel:+22407000000" className="text-primary hover:underline">+224 07 00 00 00</a></p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Hébergement</h2>
          <p>Le site est hébergé par un prestataire tiers. Pour toute question technique, contactez-nous à l'adresse ci-dessus.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de Diary Shop. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Limitation de responsabilité</h2>
          <p>
            Diary Shop s'efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations publiées sur ce site.
          </p>
        </section>
      </div>
    </div>
  </Layout>
);

export default MentionsLegalesPage;
