import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/goods/data";
import { card } from "@/lib/goods/ui";
import { SettingsForm } from "./SettingsForm";
import { DeleteAccount } from "./DeleteAccount";
import { HomeScreenSettings } from "./HomeScreenSettings";
import { MascotColorSettings } from "./MascotColorSettings";

export const metadata: Metadata = { title: "設定" };

export default async function SettingsPage() {
  const { supabase, user } = await requireUser("/mochico/settings");
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">設定</h1>
      <section className={`${card} p-5`}>
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">ログイン中のアカウント</h2>
        <p className="mt-1 break-all text-base text-slate-900 dark:text-white">{user.email}</p>
      </section>
      <SettingsForm initialName={profile?.display_name ?? ""} userId={user.id} />
      <MascotColorSettings userId={user.id} />
      <HomeScreenSettings userId={user.id} />
      <DeleteAccount />
      <nav aria-label="規約とポリシー" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/mochico/terms" className="underline underline-offset-2">
          利用規約
        </Link>
        <Link href="/mochico/privacy" className="underline underline-offset-2">
          プライバシーポリシー
        </Link>
        <Link href="/mochico" className="underline underline-offset-2">
          Mochicoについて
        </Link>
      </nav>
    </div>
  );
}
