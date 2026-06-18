import { useEffect } from "react";
import { useDropStore } from "../store/dropStore";

export function useDrops() {
  const { drops, loading, error, fetchDrops } = useDropStore();

  useEffect(() => {
    fetchDrops();
  }, []);

  return { drops, loading, error, refetch: fetchDrops };
}
