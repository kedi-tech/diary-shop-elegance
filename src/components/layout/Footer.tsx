import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Newsletter */}
      <div className="border-b border-secondary-foreground/10">
        <div className="container-custom py-12 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl mb-2">Restez connectée</h3>
            <p className="text-secondary-foreground/80 mb-6">
              Inscrivez-vous pour recevoir nos offres exclusives et nouveautés
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
              />
              <Button variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary whitespace-nowrap">
                S'inscrire
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-display text-2xl font-bold">DIARY</span>
              <span className="text-xs tracking-[0.3em] ml-1">SHOP</span>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed mb-4">
              Votre destination mode pour des vêtements et accessoires tendance, de qualité et accessibles.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalogue" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=robes" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Robes
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=chaussures" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Chaussures
                </Link>
              </li>
              <li>
                <Link to="/catalogue?sale=true" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-lg mb-4">Aide</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Livraison
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Retours & Échanges
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Guide des tailles
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>contact@diaryshop.com</span>
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-secondary-foreground/10 py-6">
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/60">
            <p>© 2024 Diary Shop. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-secondary-foreground transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-secondary-foreground transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
