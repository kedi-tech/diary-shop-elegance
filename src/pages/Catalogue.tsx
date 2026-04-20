import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Search, SlidersHorizontal, ChevronRight, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories } from "@/api/categories";
import { getProducts } from "@/api/products";
import { Category, ApiProduct, Product } from "@/types/product";
import { adaptProduct as baseAdaptProduct } from "@/lib/adaptProduct";

function adaptProduct(p: ApiProduct): Product & { subCategoryId: string | null } {
  return { ...baseAdaptProduct(p), category: p.categoryId, subCategoryId: p.subCategoryId ?? null };
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const saleParam = searchParams.get("sale") === "true";
  const newParam = searchParams.get("new") === "true";

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<(Product & { subCategoryId: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      getCategories(),
      getProducts(),
    ]).then(([cats, prods]) => {
      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(prods)) setAllProducts(prods.map(adaptProduct));
    }).finally(() => setLoading(false));
  }, []);

  const activeCategory = categories.find(c => c.id === selectedCategory);
  const activeSubCategory = activeCategory?.subCategories?.find(s => s.id === selectedSubCategory);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach(p => p.sizes.forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [allProducts]);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    allProducts.forEach(p => p.colors.forEach(c => map.set(c.hex, c.name)));
    return Array.from(map.entries()).map(([hex, name]) => ({ hex, name }));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.subCategoryId === selectedSubCategory);
    }

    if (saleParam) filtered = filtered.filter(p => p.isSale);
    if (newParam) filtered = filtered.filter(p => p.isNew);

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => p.colors.some(c => selectedColors.includes(c.name)));
    }

    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1] * 1000
    );

    if (inStockOnly) filtered = filtered.filter(p => p.stock > 0);

    switch (sortBy) {
      case "price-asc": filtered.sort((a, b) => a.price - b.price); break;
      case "price-desc": filtered.sort((a, b) => b.price - a.price); break;
      case "popular": filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [allProducts, search, selectedCategory, selectedSubCategory, selectedSizes, selectedColors, priceRange, inStockOnly, sortBy, saleParam, newParam]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 200]);
    setInStockOnly(false);
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubCategory("");
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedSubCategory,
    selectedSizes.length > 0,
    selectedColors.length > 0,
    priceRange[0] > 0 || priceRange[1] < 200,
    inStockOnly,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Catégories
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1">
          <button
            onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); }}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
          >
            Toutes les catégories
          </button>

          {categories.map(cat => (
            <div key={cat.id}>
              <button
                onClick={() => handleSelectCategory(selectedCategory === cat.id ? "" : cat.id)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                }`}
              >
                <span>{cat.name}</span>
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${selectedCategory === cat.id ? "rotate-90" : ""}`} />
                )}
              </button>

              {/* Subcategories — shown when category is selected */}
              {selectedCategory === cat.id && cat.subCategories && cat.subCategories.length > 0 && (
                <div className="ml-3 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                  <button
                    onClick={() => setSelectedSubCategory("")}
                    className={`block w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                      !selectedSubCategory ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Tout afficher
                  </button>
                  {cat.subCategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubCategory(selectedSubCategory === sub.id ? "" : sub.id)}
                      className={`block w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                        selectedSubCategory === sub.id
                          ? "text-primary font-medium bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Prix (GNF)
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-1">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{(priceRange[0] * 1000).toLocaleString()} GNF</span>
            <span>{(priceRange[1] * 1000).toLocaleString()} GNF</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Tailles
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(size => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSizes(prev =>
                    prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                  )
                }
                className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  selectedSizes.includes(size)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Couleurs
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <button
                key={color.name}
                onClick={() =>
                  setSelectedColors(prev =>
                    prev.includes(color.name) ? prev.filter(c => c !== color.name) : [...prev, color.name]
                  )
                }
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColors.includes(color.name)
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-border"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <label htmlFor="stock" className="text-sm cursor-pointer">
          Uniquement en stock
        </label>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Effacer les filtres ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b border-border">
        <div className="container-custom px-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Accueil
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className={activeCategory ? "text-muted-foreground hover:text-foreground cursor-pointer" : "font-medium"}
              onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); }}>
              {saleParam ? "Promotions" : newParam ? "Nouveautés" : "Catalogue"}
            </span>
            {activeCategory && (
              <>
                <span className="text-muted-foreground">/</span>
                <span
                  className={activeSubCategory ? "text-muted-foreground hover:text-foreground cursor-pointer" : "font-medium"}
                  onClick={() => setSelectedSubCategory("")}
                >
                  {activeCategory.name}
                </span>
              </>
            )}
            {activeSubCategory && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{activeSubCategory.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <h2 className="font-display text-xl font-semibold mb-6">Filtres</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {activeSubCategory?.name ?? activeCategory?.name ?? (saleParam ? "Promotions" : newParam ? "Nouveautés" : "Catalogue")}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative flex-1 min-w-[120px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px] sm:w-[160px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récents</SelectItem>
                    <SelectItem value="popular">Populaires</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden relative shrink-0">
                      <SlidersHorizontal className="h-4 w-4" />
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[min(320px,85vw)] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filter Tags */}
            <AnimatePresence>
              {(selectedCategory || selectedSubCategory || selectedSizes.length > 0 || selectedColors.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {activeCategory?.name}
                      <button onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); }}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSubCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {activeSubCategory?.name}
                      <button onClick={() => setSelectedSubCategory("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSizes.map(size => (
                    <span key={size} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Taille: {size}
                      <button onClick={() => setSelectedSizes(prev => prev.filter(s => s !== size))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedColors.map(color => (
                    <span key={color} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {color}
                      <button onClick={() => setSelectedColors(prev => prev.filter(c => c !== color))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">Aucun produit trouvé</p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalogue;
