import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/goods/data";
import { safeNextPath } from "@/lib/goods/validation";
import { GOODS_GOOGLE_ENABLED } from "@/lib/goods/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "ログイン" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; signedout?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNextPath(sp.next);
  const { user } = await getSessionUser();
  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ログイン</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        取得状況はアカウントに保存されるので、機種変更やブラウザのデータ削除でも消えません。はじめての方も同じ手順で登録できます。
      </p>
      {next.startsWith("/mochico/s/") && (
        <p role="status" className="mt-5 rounded-xl bg-pink-50 px-4 py-3 text-sm text-pink-800 dark:bg-pink-950/40 dark:text-pink-200">
          ログインすると、共有されたグッズリストを自分の管理に追加できます。ログイン後、元のリストに戻ります。
        </p>
      )}
      {sp.deleted && (
        <p role="status" className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-zinc-900 dark:text-slate-300">
          アカウントを削除しました。ご利用ありがとうございました。
        </p>
      )}
      {sp.signedout && (
        <p role="status" className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-zinc-900 dark:text-slate-300">
          ログアウトしました。
        </p>
      )}
      {sp.error === "link" && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          ログインリンクが無効か期限切れです。もう一度コードを送信してください。
        </p>
      )}
      <LoginForm next={next} googleEnabled={GOODS_GOOGLE_ENABLED} />
      <p className="mt-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        ログインすると、
        <Link href="/mochico/terms" className="underline underline-offset-2">
          利用規約
        </Link>
        と
        <Link href="/mochico/privacy" className="underline underline-offset-2">
          プライバシーポリシー
        </Link>
        に同意したものとみなします。
      </p>
    </div>
  );
}
