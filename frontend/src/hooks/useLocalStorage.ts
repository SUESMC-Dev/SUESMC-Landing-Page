// @ts-strict-ignore
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type UseLocalStorage<T> = [T, Dispatch<SetStateAction<T>>];
export default function useLocalStorage<T>(
  key: string,
  initialValue: SetStateAction<T>,
): UseLocalStorage<T> {
  const isBrowser = typeof window !== "undefined";
    
  const saveToLocalStorage = (valueToStore: T) => {
    if (!isBrowser) return;
    try {
      if (typeof valueToStore === "string") {
        localStorage.setItem(key, valueToStore);
      } else if (typeof valueToStore === "undefined") {
        localStorage.setItem(key, "");
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      console.warn(`Could not save ${key} to localStorage`);
    }
  };

  function getValue(value: T, initOrCb: SetStateAction<T>): T {
    if (initOrCb instanceof Function) {
      const newValue = initOrCb(value);
      // saveToLocalStorage(newValue);
      return newValue;
    }

    return value ?? initOrCb;
  }
  const readValue = (): T => {
    if (!isBrowser) {
      return getValue(null, initialValue);
    }

    const item = localStorage.getItem(key);
    if (item === null) {
      return getValue(null, initialValue);
    }

    try {
      const parsed = JSON.parse(item);
      if (!parsed) {
        throw new Error("Empty value");
      }

      return getValue(parsed, initialValue);
    } catch {
      return getValue(item as unknown as T, initialValue);
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  useEffect(() => {
    if (!isBrowser) return;
    setStoredValue(readValue());
  }, [key]);

  const setValue = (value: SetStateAction<T>) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    saveToLocalStorage(valueToStore);
  };

  return [storedValue, setValue];
}
