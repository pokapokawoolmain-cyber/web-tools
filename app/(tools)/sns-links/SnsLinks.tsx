"use client";

import { useState, useEffect } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { RelatedTools } from "@/components/tools/RelatedTools";

type ProfileData = {
  name: string;
  bio: string;
  x: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  note: string;
  website: string;
};

const defaultData: ProfileData = {
  name: "",
  bio: "",
  x: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  note: "",
  website: "",
};

const SNS_LINKS = [
  { key: "x" as const, label: "X", icon: "🐦", prefix: "https://x.com/", placeholder: "@username" },
  { key: "instagram" as const, label: "Instagram", icon: "📷", prefix: "https://instagram.com/", placeholder: "@username" },
  { key: "tiktok" as const, label: "TikTok", icon: "🎵", prefix: "https://tiktok.com/@", placeholder: "@username" },
  { key: "youtube" as const, label: "YouTube", icon: "📺", prefix: "", placeholder: "https://youtube.com/..." },
  { key: "note" as const, label: "note", icon: "📝", prefix: "https://note.com/", placeholder: "@username" },
  { key: "website" as const, label: "Webサイト", icon: "🌐", prefix: "", placeholder: "https://example.com" },
];

function encodeData(data: ProfileData): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decodeData(hash: string): ProfileData | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(hash))));
  } catch {
    return null;
  }
}

function getLink(item: typeof SNS_LINKS[number], value: string): string {
  if (!value) return "";
  if (item.prefix && !value.startsWith("http")) {
    const handle = value.startsWith("@") ? value.slice(1) : value;
    return `${item.prefix}${handle}`;
  }
  return value;
}

export function SnsLinks() {
  const [data, setData] = useState<ProfileData>(defaultData);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewData, setPreviewData] = useState<ProfileData | null>(null);

  // Read hash on mount for share mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decodeData(hash);
      if (decoded) {
        setPreviewData(decoded);
      }
    }
  }, []);

  const update = (key: keyof ProfileData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
    setShowPreview(false);
  };

  const handleCopyUrl = async () => {
    const encoded = encodeData(data);
    const url = `${window.location.origin}/sns-links#${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayData = previewData ?? (showPreview ? data : null);

  if (previewData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
          <ProfilePreview data={previewData} />
          <button
            onClick={() => {
              setPreviewData(null);
              window.history.replaceState(null, "", window.location.pathname);
            }}
            className="w-full py-[16px] text-[17px] font-semibold text-blue-500 bg-white dark:bg-zinc-900 rounded-2xl active:opacity-80 transition-opacity"
          >
            編集モードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24 space-y-6">
        {/* Title */}
        <div className="px-1">
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">SNSリンクまとめ</h1>
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">プロフィールと全SNSをひとつのURLでシェア</p>
        </div>

        {/* Profile */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">プロフィール</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            <div className="flex items-center px-5 py-[14px] gap-3">
              <span className="text-[15px] text-slate-900 dark:text-white flex-1">名前</span>
              <input
                type="text"
                value={data.name}
                onChange={e => update("name", e.target.value)}
                placeholder="山田 太郎"
                className="text-right text-[15px] text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent outline-none w-36"
              />
            </div>
            <div className="flex items-start px-5 py-[14px] gap-3">
              <span className="text-[15px] text-slate-900 dark:text-white flex-1 pt-0.5">自己紹介</span>
              <textarea
                value={data.bio}
                onChange={e => update("bio", e.target.value)}
                placeholder="デザイナー・クリエイター"
                rows={3}
                className="text-right text-[15px] text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent outline-none w-44 resize-none"
              />
            </div>
          </div>
        </section>

        {/* SNS Links */}
        <section>
          <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">SNSアカウント</p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            {SNS_LINKS.map(item => (
              <div key={item.key} className="flex items-center px-5 py-[14px] gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-[15px] text-slate-900 dark:text-white flex-1">{item.label}</span>
                <input
                  type="text"
                  value={data[item.key]}
                  onChange={e => update(item.key, e.target.value)}
                  placeholder={item.placeholder}
                  className="text-right text-[15px] text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent outline-none w-36"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <button
          onClick={() => setShowPreview(true)}
          disabled={!data.name}
          className="w-full py-[16px] text-[17px] font-semibold text-white bg-blue-500 rounded-2xl active:opacity-80 transition-opacity disabled:opacity-40"
        >
          プレビューを表示
        </button>

        {showPreview && displayData && (
          <>
            <ProfilePreview data={displayData} />
            <button
              onClick={handleCopyUrl}
              disabled={!data.name}
              className="w-full py-[16px] text-[17px] font-semibold text-white bg-emerald-500 rounded-2xl active:opacity-80 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "コピーしました！" : "URLをコピー"}
            </button>
          </>
        )}

        {/* Related Tools */}
        <RelatedTools currentId="sns-links" category="text" />
      </div>
    </div>
  );
}

function ProfilePreview({ data }: { data: ProfileData }) {
  const activeLinks = SNS_LINKS.filter(item => data[item.key]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl px-6 py-8 space-y-6">
      {/* Name & Bio */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-blue-500">
          {data.name.slice(0, 1) || "?"}
        </div>
        <p className="text-[22px] font-bold text-slate-900 dark:text-white">{data.name || "名前未設定"}</p>
        {data.bio && (
          <p className="text-[15px] text-slate-500 dark:text-zinc-400 whitespace-pre-wrap">{data.bio}</p>
        )}
      </div>

      {/* Links */}
      {activeLinks.length > 0 && (
        <div className="space-y-3">
          {activeLinks.map(item => {
            const href = getLink(item, data[item.key]);
            return (
              <a
                key={item.key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:opacity-80 transition-opacity"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[15px] font-medium text-slate-900 dark:text-white flex-1">{item.label}</span>
                <ExternalLink className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
