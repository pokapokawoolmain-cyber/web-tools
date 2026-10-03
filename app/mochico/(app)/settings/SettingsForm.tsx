"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { goodsBrowserClient } from "@/lib/goods/supabase/browser";
import { clearGoodsCache } from "@/lib/goods/cache/idb";
import { LIMITS, friendlyDbError } from "@/lib/goods/validation";
import { btn, card, field } from "@/lib/goods/ui";
import { useToast } from "../_components/Toast";

export function SettingsForm({ initialName, userId }: { initialName: string; userId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const v = name.trim();
    const { error } = await goodsBrowserClient()
      .from("profiles")
      .update({ display_name: v || null })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      toast.show(friendlyDbError(error), { tone: "error" });
      return;
    }
    toast.show("表示名を保存しました");
    router.refresh();
  }

  async function signOut(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // await 後は e.currentTarget が null になるため先に保持する
    const form = e.currentTarget;
    setSigningOut(true);
    // 共有端末に他人のコレクションを残さないよう、端末内キャッシュを先に消す
    await clearGoodsCache();
    form.submit();
  }

  return (
    <>
      <form onSubmit={save} className={`${card} mt-4 space-y-3 p-5`}>
        <label htmlFor="display-name" className={field.label}>
          表示名
        </label>
        <input
          id="display-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.displayName}
          className={field.input}
          placeholder="例: ハル"
          autoComplete="nickname"
        />
        <p className={field.hint}>今後の共有機能で、イベントの作成者名として表示されます。取得状況は表示されません。</p>
        <button type="submit" disabled={saving} className={btn.primary}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          保存する
        </button>
      </form>

      <form action="/mochico/auth/signout" method="post" onSubmit={signOut} className="mt-6">
        <button type="submit" disabled={signingOut} className={`${btn.secondary} w-full`}>
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
          ログアウト
        </button>
      </form>
    </>
  );
}
