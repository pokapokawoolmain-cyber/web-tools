// Mochico 本体の入口（/mochico/app）
//   ログイン済み → マイイベント / 未ログイン → ログイン（ログイン後はマイイベントへ）
//   サービス紹介は公開 LP（/mochico）が担う。
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/goods/data";

export default async function MochicoAppEntry() {
  const { user } = await getSessionUser();
  redirect(user ? "/mochico/events" : `/mochico/login?next=${encodeURIComponent("/mochico/events")}`);
}
