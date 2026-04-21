import { Layout } from "@/components/layout/Layout";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Comment puis-je passer une commande ?",
    a: "Ajoutez vos articles au panier, puis cliquez sur « Commander » pour finaliser votre achat. Vous pouvez payer par Mobile Money ou à la livraison.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "La livraison est effectuée sous 24 à 72 heures dans les zones desservies. Vous serez contacté(e) par notre équipe pour confirmer l'heure de livraison.",
  },
  {
    q: "Puis-je retourner un article ?",
    a: "Oui, vous disposez de 7 jours après réception pour retourner un article non porté, dans son emballage d'origine. Contactez-nous pour initier le retour.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Connectez-vous à votre compte et rendez-vous dans la section « Mes commandes » pour consulter le statut de votre commande en temps réel.",
  },
  {
    q: "Les tailles sont-elles conformes aux tailles standard ?",
    a: "Nous suivons les tailles standard européennes. Consultez notre guide des tailles pour vous assurer de choisir la bonne taille.",
  },
  {
    q: "Proposez-vous des promotions ?",
    a: "Oui ! Retrouvez toutes nos promotions en cours dans la section « Promotions » de notre catalogue.",
  },
];

const FAQPage = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Layout>
      <div className="container-custom px-4 py-12 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Questions fréquentes</h1>
        <p className="text-muted-foreground mb-8">Tout ce que vous devez savoir sur vos achats chez Diary Shop.</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
