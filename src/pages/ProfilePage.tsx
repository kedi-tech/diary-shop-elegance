import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, LogOut, Edit2, Check, X,
  Loader2, Package, ChevronRight, ChevronLeft, ShoppingBag, Heart,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useFavourites } from "@/context/FavouritesContext";
import { updateClientInfos, getCurrentClient } from "@/api/clients";
import { type Order } from "@/api/orders";
import { useToast } from "@/hooks/use-toast";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING:    { label: "En attente",   className: "bg-yellow-100 text-yellow-800" },
  CONFIRMED:  { label: "Confirmée",    className: "bg-blue-100 text-blue-800" },
  PROCESSING: { label: "En cours",     className: "bg-blue-100 text-blue-800" },
  SHIPPED:    { label: "Expédiée",     className: "bg-indigo-100 text-indigo-800" },
  DELIVERED:  { label: "Livrée",       className: "bg-green-100 text-green-800" },
  CANCELLED:  { label: "Annulée",      className: "bg-red-100 text-red-800" },
};

const statusInfo = (status: string) =>
  STATUS_LABEL[status?.toUpperCase()] ?? { label: status, className: "bg-muted text-muted-foreground" };

const ProfilePage = () => {
  const { user, token, loading, logout, updateUser } = useAuth();
  const { favourites } = useFavourites();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [ordersPage, setOrdersPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/"); return; }
    setForm({ name: user.name ?? "", email: user.email ?? "", phone: user.phone ?? "", address: user.address ?? "" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!token) return;
    setOrdersLoading(true);
    getCurrentClient(token)
      .then((data) => {
        const client = data.client ?? data;
        updateUser({
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
        });
        setForm({
          name: client.name ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          address: client.address ?? "",
        });
        const raw = Array.isArray(client?.orders) ? client.orders : [];
        setOrders([...raw].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()));
      })
      .catch((err) => setOrdersError(err?.message ?? "Impossible de charger les commandes."))
      .finally(() => setOrdersLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await updateClientInfos(token, { name: form.name, phone: form.phone, address: form.address });
      updateUser({ name: form.name, phone: form.phone, address: form.address });
      toast({ title: "Profil mis à jour" });
      setEditing(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.data?.message ?? "Impossible de mettre à jour le profil.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", address: user?.address ?? "" });
    setEditing(false);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading || !user) return null;

  const initials = (user.name ?? "?")
    .split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  return (
    <Layout>
      <div className="container-custom px-4 py-10 md:py-16 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Avatar + name */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-card rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Mes informations</h2>
              {!editing ? (
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4" /> Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}><X className="h-4 w-4" /></Button>
                  <Button size="sm" className="gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-muted-foreground text-xs"><User className="h-3.5 w-3.5" /> Nom complet</Label>
                {editing ? <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /> : <p className="font-medium">{user.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-muted-foreground text-xs"><Mail className="h-3.5 w-3.5" /> Email</Label>
                <p className="font-medium text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-muted-foreground text-xs"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
                {editing
                  ? <Input type="tel" placeholder="+224 6XX XX XX XX" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                  : <p className="font-medium">{user.phone || <span className="text-muted-foreground italic">Non renseigné</span>}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-muted-foreground text-xs"><MapPin className="h-3.5 w-3.5" /> Adresse</Label>
                {editing
                  ? <Input placeholder="Votre adresse de livraison" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                  : <p className="font-medium">{user.address || <span className="text-muted-foreground italic">Non renseignée</span>}</p>}
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-card rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Mes commandes</h2>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : ordersError ? (
              <p className="text-sm text-destructive text-center py-6">{ordersError}</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Vous n'avez pas encore de commandes.</p>
                <Link to="/catalogue">
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    Découvrir la collection <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (() => {
              const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
              const paginated = orders.slice((ordersPage - 1) * ORDERS_PER_PAGE, ordersPage * ORDERS_PER_PAGE);
              return (
                <>
                  <div className="space-y-3">
                    {paginated.map((order) => {
                      const { label, className } = statusInfo(order.status);
                      const date = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("fr-GN", { day: "numeric", month: "long", year: "numeric" })
                        : "";
                      return (
                        <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-sm font-semibold">DS-{String(order.id).slice(-8).toUpperCase()}</p>
                              {date && <p className="text-xs text-muted-foreground mt-0.5">{date}</p>}
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${className}`}>
                              {label}
                            </span>
                          </div>

                          {order.items?.length > 0 && (
                            <div className="space-y-1.5">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 text-sm">
                                  {item.product?.images?.[0]?.url && (
                                    <img src={item.product.images[0].url} alt={item.product.name} className="w-8 h-10 object-cover rounded" />
                                  )}
                                  <span className="flex-1 truncate text-muted-foreground">
                                    {item.product?.name ?? `Produit #${item.productId}`}
                                  </span>
                                  <span className="shrink-0">×{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                            <span className="font-semibold text-primary text-sm">
                              {order.total.toLocaleString("fr-GN")} GNF
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <button
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        disabled={ordersPage === 1}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" /> Précédent
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Page {ordersPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setOrdersPage((p) => Math.min(totalPages, p + 1))}
                        disabled={ordersPage === totalPages}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Suivant <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Wishlist preview */}
          <div className="bg-card rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Mes favoris</h2>
              </div>
              {favourites.length > 0 && (
                <Link to="/favoris">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Voir tout <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
            {favourites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun article en favori.</p>
                <Link to="/catalogue">
                  <Button variant="outline" size="sm" className="mt-3 gap-2">
                    Découvrir la collection <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {favourites.slice(0, 6).map((p) => (
                  <Link key={p.id} to={`/produit/${p.id}`} className="group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-xs font-medium mt-1.5 truncate">{p.name}</p>
                    <p className="text-xs text-primary">{p.price.toLocaleString("fr-GN")} GNF</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </Button>

        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
