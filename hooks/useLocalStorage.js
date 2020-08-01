import { useState, useEffect } from "react";

function getSavedValue(key, initialValue) {
  if (process.browser) {
    if (!window) return initialValue;
  const savedValue =  JSON.parse(window.localStorage.getItem(key));
  if (savedValue) return savedValue;
  if (initialValue instanceof Function) return initialValue();
  return initialValue;
  }
  return initialValue;
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}