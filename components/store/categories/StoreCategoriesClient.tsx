"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import {
  Plus,
  PencilLine,
  Loader2,
  FolderOpen,
  Tag,
  Search,
} from "lucide-react";
import {
  Category,
  createCategory,
  getStoreCategories,
  updateCategory,
} from "@/lib/actions/categories";

export default function StoreCategoriesClient({
  storeId,
}: {
  storeId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  async function load() {
    setLoading(true);
    const res = await getStoreCategories(storeId);
    if (res.success) setCategories(res.categories || []);
    else toast.error(res.error || "Failed to load categories");
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [storeId]);

  async function onCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }
    try {
      setCreating(true);
      const res = await createCategory(storeId, { name: trimmed });
      if (res.success && res.category) {
        toast.success("Category created");
        setOpenCreate(false);
        setName("");
        setCategories((prev) => [res.category!, ...prev]);
      } else toast.error(res.error || "Failed to create category");
    } finally {
      setCreating(false);
    }
  }

  async function onUpdate(id: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }
    try {
      setSavingId(id);
      const res = await updateCategory(id, { name: trimmed });
      if (res.success && res.category) {
        toast.success("Category updated");
        setOpenEditId(null);
        setName("");
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? res.category! : c))
        );
      } else toast.error(res.error || "Failed to update category");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Store Categories
            </h1>
            <p className="text-muted-foreground text-sm">
              Organize your products with custom categories
            </p>
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="shadow-sm">
                <Plus size={18} />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create Category
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Category Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Electronics, Clothing..."
                    className="h-10"
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenCreate(false);
                    setName("");
                  }}
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
                    "Create Category"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="p-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FolderOpen
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Total Categories
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {loading ? "..." : categories.length}
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
                  Active Categories
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {loading ? "..." : filtered.length}
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
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>

        {/* Categories List */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderOpen size={20} className="text-primary" />
              Categories
              {!loading && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({filtered.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FolderOpen className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {search ? "No categories found" : "No categories yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {search
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first category"}
                </p>
                {!search && (
                  <Button onClick={() => setOpenCreate(true)}>
                    <Plus size={18} />
                    Create Category
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    className="group p-5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Tag className="text-primary" size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate capitalize text-base mb-1">
                            {c.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate font-mono">
                            ID: {c.id}
                          </p>
                        </div>
                      </div>

                      <Dialog
                        open={openEditId === c.id}
                        onOpenChange={(o) => {
                          if (o) {
                            setOpenEditId(c.id);
                            setName(c.name);
                          } else {
                            setOpenEditId(null);
                            setName("");
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          >
                            <PencilLine size={16} />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                              Edit Category
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Category Name{" "}
                                <span className="text-destructive">*</span>
                              </label>
                              <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Electronics, Clothing..."
                                className="h-10"
                                autoFocus
                              />
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">
                                  Category ID:
                                </span>{" "}
                                <span className="font-mono">{c.id}</span>
                              </p>
                            </div>
                          </div>
                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setOpenEditId(null);
                                setName("");
                              }}
                              disabled={savingId === c.id}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => onUpdate(c.id)}
                              disabled={savingId === c.id}
                            >
                              {savingId === c.id ? (
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
