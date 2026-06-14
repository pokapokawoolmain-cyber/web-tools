"use client";
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

const STORAGE_KEY = "subsidy_favorites";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function saveFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => { setFavorites(getFavorites()); }, []);

  const toggle = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavorites(next);
      return next;
    });
  };

  return { favorites, toggle };
}

export function FavoriteButton({ id, size = "md" }: { id: string; size?: "sm" | "md" }) {
  const { favorites, toggle } = useFavorites();
  const isFav = favorites.includes(id);
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const pad = size === "sm" ? "p-1" : "p-1.5";

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(id); }}
      aria-label={isFav ? "お気に入りから削除" : "お気に入りに追加"}
      title={isFav ? "お気に入りから削除" : "お気に入りに追加"}
      className={`${pad} rounded-lg transition-all ${
        isFav
          ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
          : "text-slate-300 hover:text-amber-400 hover:bg-amber-50"
      }`}
    >
      <Bookmark className={`${sz} ${isFav ? "fill-amber-400" : ""}`} />
    </button>
  );
}
