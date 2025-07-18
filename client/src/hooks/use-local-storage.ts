import { useState, useEffect } from "react";
import { getFromStorage, setToStorage } from "@/lib/storage";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    return getFromStorage(key, defaultValue);
  });

  useEffect(() => {
    setToStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
