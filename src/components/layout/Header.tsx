import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, Heart, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFavourites } from "@/context/FavouritesContext";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/api/categories";
import { Category } from "@/types/product";
import { AuthModal } from "@/components/auth/AuthModal";

const staticNavLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
];

const MAX_VISIBLE = 5;

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  const visibleCategories = categories.slice(0, MAX_VISIBLE);
  const hasMore = categories.length > MAX_VISIBLE;
  const allNavLinks = [
    ...staticNavLinks,
    ...visibleCategories.map((cat) => ({ href: `/catalogue?category=${cat.id}`, label: cat.name })),
  ];

  const handleUserClick = () => {
    if (user) navigate("/compte");
    else setIsAuthModalOpen(true);
  };

  const handleFavouritesClick = () => navigate("/favoris");

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        {/* Top Banner */}
        <div className="bg-primary text-primary-foreground text-center py-2 text-xs sm:text-sm px-4">
          <p>Livraison gratuite à partir de 50 000 FCFA | Code: DIARY10 pour -10%</p>
        </div>

        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 px-3 sm:px-4">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center">
                <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">DIARY</span>
                <span className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] text-secondary font-medium -mt-1">SHOP</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-6">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`link-underline text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${
                    location.pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {hasMore && (
                <Link to="/catalogue" className="text-sm font-medium transition-colors shrink-0 whitespace-nowrap text-primary hover:text-primary/80 flex items-center gap-1">
                  Toutes <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Search */}
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "160px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden md:block overflow-hidden"
                  >
                    <Input placeholder="Rechercher..." className="h-8" autoFocus onBlur={() => setIsSearchOpen(false)} />
                  </motion.div>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden md:flex h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </AnimatePresence>

              {/* Favourites */}
              <Button variant="ghost" size="icon" onClick={handleFavouritesClick} className="hidden md:flex h-8 w-8 relative">
                <Heart className={`h-4 w-4 ${favourites.length > 0 ? "fill-primary text-primary" : ""}`} />
                {favourites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {favourites.length}
                  </span>
                )}
              </Button>

              {/* User */}
              {user ? (
                <div className="hidden md:flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={handleUserClick} className="h-8 w-8" title={user.name}>
                    <User className="h-4 w-4 text-primary" />
                  </Button>
                  {/* <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8" title="Déconnexion">
                    <LogOut className="h-4 w-4" />
                  </Button> */}
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={handleUserClick} className="hidden md:flex h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
              )}

              {/* Cart */}
              <Link to="/panier">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[min(320px,85vw)] bg-background z-50 md:hidden shadow-xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-display text-xl font-bold text-primary">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." className="pl-10 h-9" />
                  </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-2">
                  {staticNavLinks.map((link) => (
                    <Link
                      key={link.href} to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-5 py-3.5 text-base font-medium border-b border-border/50 transition-colors ${
                        location.pathname === link.href ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {categories.length > 0 && (
                    <>
                      <p className="px-5 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catégories</p>
                      {visibleCategories.map((cat) => (
                        <Link
                          key={cat.id} to={`/catalogue?category=${cat.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-5 py-3 text-sm font-medium border-b border-border/30 transition-colors text-foreground hover:text-primary hover:bg-primary/5"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      {hasMore && (
                        <Link to="/catalogue" onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-1 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                        >
                          Toutes les catégories <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </>
                  )}
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                  {user ? (
                    <>
                      <Button variant="outline" className="w-full justify-start gap-3 h-10" onClick={() => { setIsMobileMenuOpen(false); navigate("/compte"); }}>
                        <User className="h-4 w-4" /> {(user.name ?? "Compte").split(" ")[0]}
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3 h-10" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>
                        <LogOut className="h-4 w-4" /> Se déconnecter
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full justify-start gap-3 h-10"
                      onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                    >
                      <User className="h-4 w-4" /> Mon compte
                    </Button>
                  )}
                  <Link to="/favoris" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-3 h-10">
                      <Heart className="h-4 w-4" /> Mes favoris {favourites.length > 0 && `(${favourites.length})`}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
