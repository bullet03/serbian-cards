import type { AppData } from './types';

const LOCAL_STORAGE_KEY = 'serbian-cards-data';

export function loadFromLocalStorage(): AppData | undefined {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return undefined;
  }
}

export function saveToLocalStorage(data: AppData): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}
