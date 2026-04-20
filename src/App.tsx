import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FavouritesProvider } from "@/context/FavouritesContext";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import FavouritesPage from "./pages/FavouritesPage";
import ProfilePage from "./pages/ProfilePage";
import ConfirmationPage from "./pages/ConfirmationPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavouritesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/produit/:id" element={<ProductPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/commande" element={<CheckoutPage />} />
                <Route path="/favoris" element={<FavouritesPage />} />
                <Route path="/compte" element={<ProfilePage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/paiement-echoue" element={<PaymentFailedPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </FavouritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
