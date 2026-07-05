import { permanentRedirect } from "next/navigation";

// 更新履歴は /release-notes に統合。旧URLは恒久リダイレクトする。
export default function UpdatesPage() {
  permanentRedirect("/release-notes");
}
