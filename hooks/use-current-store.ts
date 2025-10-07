import { useEffect, useState } from "react";
import { getCurrentUserStore } from "@/lib/actions/store";
import type { Store } from "@/lib/actions/store";

export function useCurrentStore(autoFetch: boolean = true) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoFetch) return;

    const fetchStore = async () => {
      try {
        setLoading(true);
        const currentStore = await getCurrentUserStore();
        setStore(currentStore);
        setError(null);
      } catch (err) {
        setError("Failed to fetch store information");
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [autoFetch]);

  return {
    store,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      try {
        const currentStore = await getCurrentUserStore();
        setStore(currentStore);
        setError(null);
      } catch (err) {
        setError("Failed to fetch store information");
        setStore(null);
      } finally {
        setLoading(false);
      }
    },
  };
}
