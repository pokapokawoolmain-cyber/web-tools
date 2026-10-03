import { AppMascot } from "@/components/mochico/MascotColorContext";
import { StateMessage } from "./_components/StateMessage";

export default function GoodsNotFound() {
  return (
    <StateMessage plainIcon icon={<AppMascot size={64} state="peek" />} title="ページが見つかりません" action={{ href: "/mochico/events", label: "マイイベントへ" }}>
      イベントが削除されたか、URLが間違っている可能性があります。
    </StateMessage>
  );
}
