// ============================================================
// 共有カタログの閲覧ページ（URL にトークンを含まない）
//   トークンは /mochico/s/<token> で HttpOnly Cookie に移されている。ここでサーバー側検証。
//   表示するのはカタログ（イベント・グッズ）だけ。作成者や他ユーザーの所持状態は出さない。
// ============================================================
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Clock, Link2Off, SearchX, WifiOff } from "lucide-react";
import { SHARE_COOKIE, getSharedCatalog, isShareTokenFormat } from "@/lib/goods/share";
import { getSessionUser } from "@/lib/goods/data";
import { StateMessage } from "../../_components/StateMessage";
import { ShareCatalogView, type ShareRelation } from "../../_components/ShareCatalogView";

export const metadata: Metadata = {
  title: "共有されたグッズリスト",
  referrer: "no-referrer",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function ShareViewPage({ searchParams }: { searchParams: Promise<{ join?: string }> }) {
  const { join } = await searchParams;
  const token = (await cookies()).get(SHARE_COOKIE)?.value;

  if (!isShareTokenFormat(token)) {
    return (
      <StateMessage icon={<SearchX className="h-7 w-7" />} title="この共有リンクは利用できません" action={{ href: "/mochico", label: "Mochicoについて見る" }}>
        リンクが正しくないか、時間が経って読み込めなくなりました。共有されたURLをもう一度開いてください。
      </StateMessage>
    );
  }

  const catalog = await getSharedCatalog(token);
  if (catalog.status !== "ok") return <ShareUnavailable status={catalog.status} />;

  const { supabase, user } = await getSessionUser();
  let relation: ShareRelation = { kind: "anonymous" };
  if (user) {
    const { data } = await supabase.rpc("goods_share_relation", { p_token: token });
    const rel = data as { status: string; relation?: "owner" | "member" | "none"; event_id?: string } | null;
    if (rel?.relation === "owner" || rel?.relation === "member") relation = { kind: rel.relation, eventId: rel.event_id! };
    else relation = { kind: "none" };
  }

  return <ShareCatalogView catalog={catalog} relation={relation} autoJoin={join === "1" && relation.kind === "none"} />;
}

function ShareUnavailable({ status }: { status: string }) {
  if (status === "expired") {
    return (
      <StateMessage icon={<Clock className="h-7 w-7" />} title="この共有リンクは期限切れです" tone="warning" action={{ href: "/mochico", label: "Mochicoについて見る" }}>
        共有した人に、新しいリンクを送ってもらってください。
      </StateMessage>
    );
  }
  if (status === "revoked") {
    return (
      <StateMessage icon={<Link2Off className="h-7 w-7" />} title="この共有リンクは共有が終了しています" tone="warning" action={{ href: "/mochico", label: "Mochicoについて見る" }}>
        共有した人がリンクを停止しました。すでに自分の管理に追加している場合は、マイイベントからそのまま使えます。
      </StateMessage>
    );
  }
  if (status === "error") {
    return (
      <StateMessage icon={<WifiOff className="h-7 w-7" />} title="読み込みに失敗しました" tone="danger" action={{ href: "/mochico/s/view", label: "もう一度読み込む" }}>
        通信状況を確認して、もう一度お試しください。
      </StateMessage>
    );
  }
  // invalid / unavailable（イベント削除など）は同じ表示にして内部状態を出しすぎない
  return (
    <StateMessage icon={<SearchX className="h-7 w-7" />} title="この共有リンクは利用できません" action={{ href: "/mochico", label: "Mochicoについて見る" }}>
      リンクが正しくないか、イベントが公開されていません。
    </StateMessage>
  );
}
