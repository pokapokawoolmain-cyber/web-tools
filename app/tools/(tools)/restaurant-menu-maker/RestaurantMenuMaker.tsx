"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Printer } from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  allergens: string;
  isTakeout: boolean;
  isRecommended: boolean;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

type Theme = "simple" | "cafe" | "izakaya";

const THEMES: Record<
  Theme,
  {
    label: string;
    printBg: string;
    printHeader: string;
    printHeaderText: string;
    printCategoryBg: string;
    printCategoryText: string;
    printItemBorder: string;
    fontFamily: string;
  }
> = {
  simple: {
    label: "シンプル",
    printBg: "#ffffff",
    printHeader: "#1e293b",
    printHeaderText: "#ffffff",
    printCategoryBg: "#f1f5f9",
    printCategoryText: "#334155",
    printItemBorder: "#e2e8f0",
    fontFamily: '"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif',
  },
  cafe: {
    label: "カフェ風",
    printBg: "#fdf8f0",
    printHeader: "#92400e",
    printHeaderText: "#fdf8f0",
    printCategoryBg: "#fef3c7",
    printCategoryText: "#78350f",
    printItemBorder: "#fcd34d",
    fontFamily: '"Hiragino Mincho ProN","Georgia",serif',
  },
  izakaya: {
    label: "居酒屋風",
    printBg: "#ffffff",
    printHeader: "#1e3a5f",
    printHeaderText: "#f59e0b",
    printCategoryBg: "#1e3a5f",
    printCategoryText: "#f59e0b",
    printItemBorder: "#93c5fd",
    fontFamily: '"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif',
  },
};

const STORAGE_KEY = "restaurant-menu-maker-v1";

function newItem(): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: "",
    description: "",
    allergens: "",
    isTakeout: false,
    isRecommended: false,
  };
}

function defaultCategories(): MenuCategory[] {
  return [
    {
      id: crypto.randomUUID(),
      name: "フード",
      items: [
        { id: crypto.randomUUID(), name: "本日の定食", price: "850", description: "日替わりメインに小鉢・味噌汁・ご飯付き", allergens: "小麦・卵を含む", isTakeout: false, isRecommended: true },
        { id: crypto.randomUUID(), name: "唐揚げ定食", price: "780", description: "国産鶏もも肉を使用したジューシーな唐揚げ", allergens: "小麦・大豆を含む", isTakeout: true, isRecommended: false },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "ドリンク",
      items: [
        { id: crypto.randomUUID(), name: "コーヒー", price: "350", description: "自家焙煎ブレンド", allergens: "", isTakeout: true, isRecommended: false },
        { id: crypto.randomUUID(), name: "生ビール", price: "480", description: "サッポロ黒ラベル", allergens: "小麦を含む", isTakeout: false, isRecommended: true },
      ],
    },
  ];
}

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500";

export function RestaurantMenuMaker() {
  const [categories, setCategories] = useState<MenuCategory[]>(defaultCategories);
  const [theme, setTheme] = useState<Theme>("simple");
  const [storeName, setStoreName] = useState("");
  const [storeNote, setStoreNote] = useState("表示価格はすべて税込です。");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.storeName !== undefined) setStoreName(parsed.storeName);
        if (parsed.storeNote !== undefined) setStoreNote(parsed.storeNote);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, theme, storeName, storeNote }));
    } catch {
      // ignore
    }
  }, [categories, theme, storeName, storeNote]);

  // --- Category operations ---
  const addCategory = useCallback(() => {
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "新しいカテゴリ", items: [newItem()] },
    ]);
  }, []);

  const removeCategory = useCallback((catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  }, []);

  const updateCategoryName = useCallback((catId: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, name } : c))
    );
  }, []);

  // --- Item operations ---
  const addItem = useCallback((catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, newItem()] } : c))
    );
  }, []);

  const removeItem = useCallback((catId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      )
    );
  }, []);

  const updateItem = useCallback(
    (catId: string, itemId: string, field: keyof MenuItem, value: string | boolean) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === itemId ? { ...i, [field]: value } : i
                ),
              }
            : c
        )
      );
    },
    []
  );

  const t = THEMES[theme];

  const printDom = (
    <div
      id="menu-print-root"
      style={{ display: "none", backgroundColor: t.printBg, padding: "0", margin: "0" }}
    >
      {/* Header: store name */}
      <div
        style={{
          backgroundColor: t.printHeader,
          color: t.printHeaderText,
          padding: "20px 24px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: t.fontFamily,
          }}
        >
          {storeName || "メニュー"}
        </div>
      </div>

      {/* Categories and items */}
      {categories
        .filter((c) => c.items.some((i) => i.name))
        .map((cat) => (
          <div key={cat.id} style={{ marginBottom: "16px", padding: "0 16px" }}>
            <div
              style={{
                backgroundColor: t.printCategoryBg,
                color: t.printCategoryText,
                padding: "6px 12px",
                fontWeight: "bold",
                fontSize: "15px",
                marginBottom: "8px",
                fontFamily: t.fontFamily,
              }}
            >
              {cat.name}
            </div>
            {cat.items
              .filter((i) => i.name)
              .map((item) => (
                <div
                  key={item.id}
                  style={{
                    borderBottom: `1px solid ${t.printItemBorder}`,
                    padding: "8px 4px",
                    display: "flex",
                    gap: "8px",
                    fontFamily: t.fontFamily,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "2px",
                        flexWrap: "wrap",
                      }}
                    >
                      {item.isRecommended && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#dc2626",
                            border: "1px solid #dc2626",
                            padding: "0 4px",
                            borderRadius: "2px",
                          }}
                        >
                          おすすめ
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {item.name}
                      </span>
                      {item.isTakeout && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#059669",
                            border: "1px solid #059669",
                            padding: "0 4px",
                            borderRadius: "2px",
                          }}
                        >
                          テイクアウト可
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          marginBottom: "2px",
                          lineHeight: "1.4",
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                    {item.allergens && (
                      <div style={{ fontSize: "10px", color: "#9f1239" }}>
                        ⚠️ {item.allergens}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                      fontSize: "15px",
                      color: "#1e293b",
                      alignSelf: "flex-start",
                    }}
                  >
                    {item.price
                      ? `¥${parseInt(item.price).toLocaleString()}`
                      : ""}
                  </div>
                </div>
              ))}
          </div>
        ))}

      {/* Footer note */}
      {storeNote && (
        <div
          style={{
            padding: "12px 16px",
            fontSize: "11px",
            color: "#94a3b8",
            borderTop: `1px solid ${t.printItemBorder}`,
            marginTop: "8px",
          }}
        >
          {storeNote}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm 10mm; }
          body > *:not(#menu-print-root) { display: none !important; }
          #menu-print-root {
            display: block !important;
            font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
          }
        }
      `}</style>

      {mounted && createPortal(printDom, document.body)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Store name & theme */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-3">基本設定</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">
                  店舗名
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="例：café yoru."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                  テーマ
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(THEMES) as Theme[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        theme === key
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-600 hover:border-orange-400"
                      }`}
                    >
                      {THEMES[key].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 mb-4"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="カテゴリ名"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                />
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                  title="カテゴリを削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Menu items */}
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-100 dark:border-zinc-700 rounded-xl p-3 bg-slate-50 dark:bg-zinc-800/50"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                          メニュー名 <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="例：ナポリタン"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(cat.id, item.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                          価格（税込）
                        </label>
                        <input
                          type="number"
                          className={inputClass}
                          placeholder="例：800"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(cat.id, item.id, "price", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                        説明文
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="例：国産小麦を使ったもちもちパスタ"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(cat.id, item.id, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                        アレルギー情報
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="例：小麦・卵・乳を含む"
                        value={item.allergens}
                        onChange={(e) =>
                          updateItem(cat.id, item.id, "allergens", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                            checked={item.isTakeout}
                            onChange={(e) =>
                              updateItem(cat.id, item.id, "isTakeout", e.target.checked)
                            }
                          />
                          テイクアウト可
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                            checked={item.isRecommended}
                            onChange={(e) =>
                              updateItem(
                                cat.id,
                                item.id,
                                "isRecommended",
                                e.target.checked
                              )
                            }
                          />
                          おすすめ
                        </label>
                      </div>
                      <button
                        onClick={() => removeItem(cat.id, item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item button */}
              <button
                onClick={() => addItem(cat.id)}
                className="mt-3 flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <Plus size={15} />
                メニューを追加
              </button>
            </div>
          ))}

          {/* Add category button */}
          <button
            onClick={addCategory}
            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-zinc-600 rounded-2xl text-sm text-slate-500 dark:text-zinc-400 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={16} />
            カテゴリを追加
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Note */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">
              メニュー下部の注記
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
              placeholder="例：表示価格はすべて税込です。"
              value={storeNote}
              onChange={(e) => setStoreNote(e.target.value)}
            />
          </div>

          {/* Print button */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <button
              onClick={() => window.print()}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 transition-colors"
            >
              <Printer size={20} />
              印刷・PDF保存
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 text-center">
              印刷ダイアログで「PDFに保存」を選ぶとPDFファイルで保存できます
            </p>
          </div>

          {/* Tips */}
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/50 p-5">
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2">
              使い方のヒント
            </p>
            <ul className="text-xs text-orange-700 dark:text-orange-400 space-y-2">
              <li>・カテゴリ名は「フード」「ドリンク」「デザート」など自由に変更できます</li>
              <li>・おすすめチェックを入れると印刷時に「おすすめ」バッジが表示されます</li>
              <li>・価格が空のメニューは印刷時に金額欄が非表示になります</li>
              <li>・名前が空のメニューは印刷時にスキップされます</li>
              <li>・内容はブラウザに自動保存されます</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
