// ========================================
// 電子印鑑のlocalStorage永続化ユーティリティ
// ========================================

export type SavedSeal = {
  id: string;
  dataUrl: string;
  name?: string;
  createdAt: string;
};

export const SEALS_KEY = "saved-seals";
const MAX_SEALS = 20;

export function getSavedSeals(): SavedSeal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedSeal[];
  } catch {
    return [];
  }
}

export function saveSeal(dataUrl: string, name?: string): SavedSeal {
  const seal: SavedSeal = {
    id: `seal-${Date.now()}`,
    dataUrl,
    name,
    createdAt: new Date().toISOString(),
  };
  const seals = getSavedSeals();
  seals.unshift(seal);
  localStorage.setItem(SEALS_KEY, JSON.stringify(seals.slice(0, MAX_SEALS)));
  return seal;
}

export function deleteSeal(id: string): void {
  const seals = getSavedSeals().filter((s) => s.id !== id);
  localStorage.setItem(SEALS_KEY, JSON.stringify(seals));
}
