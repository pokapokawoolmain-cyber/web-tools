import { Lock } from "lucide-react";
import { StateMessage } from "./StateMessage";

/** Unauthorized: ログイン済みだが権限がない（編集はオーナーのみ） */
export function Forbidden({ backHref }: { backHref: string }) {
  return (
    <StateMessage icon={<Lock className="h-7 w-7" />} title="編集する権限がありません" tone="warning" action={{ href: backHref, label: "イベントに戻る" }}>
      イベントとグッズの編集は、作成したユーザーだけが行えます。
    </StateMessage>
  );
}
