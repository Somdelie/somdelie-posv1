"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import {
  Plus,
  PencilLine,
  Loader2,
  Image as ImageIcon,
  Tag,
  Package,
  DollarSign,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Category, getStoreCategories } from "@/lib/actions/categories";
import {
  Product,
  createProduct,
  getStoreProducts,
  updateProduct,
} from "@/lib/actions/products";
import ProductImageUpload from "@/components/store/ProductImageUpload";

export default function StoreProductsClient({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    brand: "",
    image: "",
    categoryId: "",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  async function load() {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      getStoreProducts(storeId),
      getStoreCategories(storeId),
    ]);
    if (prodRes.success) setProducts(prodRes.products || []);
    else toast.error(prodRes.error || "Failed to load products");

    if (catRes.success) setCategories(catRes.categories || []);
    else toast.error(catRes.error || "Failed to load categories");
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [storeId]);

  function resetForm() {
    setForm({
      name: "",
      sku: "",
      description: "",
      mrp: "",
      sellingPrice: "",
      brand: "",
      image: "",
      categoryId: "",
    });
  }

  async function onCreate() {
    const { name, sku, mrp, sellingPrice, categoryId } = form;
    if (!name.trim() || !sku.trim() || !mrp || !sellingPrice || !categoryId) {
      toast.error("Name, SKU, MRP, Selling Price and Category are required");
      return;
    }
    try {
      setCreating(true);
      const res = await createProduct(storeId, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description?.trim() || undefined,
        mrp: parseFloat(form.mrp as any),
        sellingPrice: parseFloat(form.sellingPrice as any),
        brand: form.brand?.trim() || undefined,
        image: form.image?.trim() || undefined,
        categoryId: form.categoryId,
      });
      if (res.success && res.product) {
        toast.success("Product created");
        setProducts((prev) => [res.product!, ...prev]);
        setOpenCreate(false);
        resetForm();
      } else toast.error(res.error || "Failed to create product");
    } finally {
      setCreating(false);
    }
  }

  async function onOpenEdit(p: Product) {
    setOpenEditId(p.id);
    setForm({
      name: p.name || "",
      sku: p.sku || "",
      description: p.description || "",
      mrp: String(p.mrp ?? ""),
      sellingPrice: String(p.sellingPrice ?? ""),
      brand: p.brand || "",
      image: p.image || "",
      categoryId: p.categoryId || "",
    });
  }

  async function onUpdate(id: string) {
    const { name, sku, mrp, sellingPrice, categoryId } = form;
    if (!name.trim() || !sku.trim() || !mrp || !sellingPrice || !categoryId) {
      toast.error("Name, SKU, MRP, Selling Price and Category are required");
      return;
    }
    try {
      setSavingId(id);
      const res = await updateProduct(id, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description?.trim() || undefined,
        mrp: parseFloat(form.mrp as any),
        sellingPrice: parseFloat(form.sellingPrice as any),
        brand: form.brand?.trim() || undefined,
        image: form.image?.trim() || undefined,
        categoryId: form.categoryId,
      });
      if (res.success && res.product) {
        toast.success("Product updated");
        setProducts((prev) =>
          prev.map((x) => (x.id === id ? res.product! : x))
        );
        setOpenEditId(null);
        resetForm();
      } else toast.error(res.error || "Failed to update product");
    } finally {
      setSavingId(null);
    }
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.sellingPrice, 0);
  const avgPrice = products.length > 0 ? totalRevenue / products.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Store Products
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your product inventory and pricing
            </p>
          </div>

          <Dialog
            open={openCreate}
            onOpenChange={(o) => {
              setOpenCreate(o);
              if (!o) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="shadow-sm">
                <Plus size={18} />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create Product
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., iPhone 14 Pro"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SKU <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g., IPHONE-14-PRO"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Brand
                  </label>
                  <Input
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    placeholder="e.g., Apple"
                    className="h-10"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    MRP <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    placeholder="0.00"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Selling Price <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    value={form.sellingPrice}
                    onChange={(e) =>
                      setForm({ ...form, sellingPrice: e.target.value })
                    }
                    placeholder="0.00"
                    className="h-10"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(v) => setForm({ ...form, categoryId: v })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Image Upload
                  </label>
                  <ProductImageUpload
                    onUpload={(url) => setForm({ ...form, image: url })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <Input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="h-10"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenCreate(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button onClick={onCreate} disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Package
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Total Products
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {loading ? "..." : products.length}
              </p>
            </CardContent>
          </Card>

          <Card className="p-0 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Avg. Price
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {loading ? "..." : `R${avgPrice.toFixed(2)}`}
              </p>
            </CardContent>
          </Card>

          <Card className="p-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Tag
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Categories
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {loading ? "..." : categories.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search products by name, SKU, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <ShoppingBag className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search ? "No products found" : "No products yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {search
                ? "Try adjusting your search terms"
                : "Get started by creating your first product"}
            </p>
            {!search && (
              <Button onClick={() => setOpenCreate(true)}>
                <Plus size={18} />
                Create Product
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => {
              const discount =
                p.mrp > p.sellingPrice
                  ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)
                  : 0;

              return (
                <Card
                  key={p.id}
                  className="group hover:shadow-xl hover:border-primary/30 transition-all duration-200 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon
                          className="text-muted-foreground"
                          size={48}
                        />
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
                        {p.name}
                      </h3>
                      {p.brand && (
                        <p className="text-xs text-muted-foreground font-medium">
                          {p.brand}
                        </p>
                      )}
                    </div>

                    {p.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {p.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <div className="px-2 py-1 bg-blue-500/10 rounded text-xs font-mono text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <Tag size={12} />
                        {p.sku}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Price
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            R{p.sellingPrice}
                          </span>
                          {p.mrp !== p.sellingPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              R{p.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Dialog
                      open={openEditId === p.id}
                      onOpenChange={(o) => {
                        if (o) onOpenEdit(p);
                        else setOpenEditId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        >
                          <PencilLine size={16} />
                          Edit Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">
                            Edit Product
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Product Name{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={form.name}
                              onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                              }
                              className="h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              SKU <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={form.sku}
                              onChange={(e) =>
                                setForm({ ...form, sku: e.target.value })
                              }
                              className="h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Brand
                            </label>
                            <Input
                              value={form.brand}
                              onChange={(e) =>
                                setForm({ ...form, brand: e.target.value })
                              }
                              className="h-10"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Description
                            </label>
                            <Textarea
                              value={form.description}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              MRP <span className="text-destructive">*</span>
                            </label>
                            <Input
                              type="number"
                              value={form.mrp}
                              onChange={(e) =>
                                setForm({ ...form, mrp: e.target.value })
                              }
                              className="h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Selling Price{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <Input
                              type="number"
                              value={form.sellingPrice}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  sellingPrice: e.target.value,
                                })
                              }
                              className="h-10"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Category{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <Select
                              value={form.categoryId}
                              onValueChange={(v) =>
                                setForm({ ...form, categoryId: v })
                              }
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Choose category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Image URL
                            </label>
                            <Input
                              value={form.image}
                              onChange={(e) =>
                                setForm({ ...form, image: e.target.value })
                              }
                              className="h-10"
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setOpenEditId(null)}
                            disabled={savingId === p.id}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => onUpdate(p.id)}
                            disabled={savingId === p.id}
                          >
                            {savingId === p.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
