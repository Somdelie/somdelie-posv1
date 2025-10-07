import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { fetchCurrentUserStore } from "@/redux-toolkit/fetures/store/storeThunk";

export function useCurrentStore(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const { selectedStore, selectedStoreLoading } = useAppSelector(
    (s) => s.store
  );
  const storeId = useAppSelector(
    (s) => s.auth.user?.user?.storeId || (s.auth.user as any)?.storeId
  );

  useEffect(() => {
    if (autoFetch && storeId && !selectedStore && !selectedStoreLoading) {
      dispatch(fetchCurrentUserStore());
    }
  }, [autoFetch, storeId, selectedStore, selectedStoreLoading, dispatch]);

  return { store: selectedStore, loading: selectedStoreLoading };
}
