import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = generateMeta({
  title: "お問い合わせ｜ToolBox",
  description: "ToolBoxへのご質問・バグ報告・ツールのご要望などはこちらからお送りください。通常2〜5営業日以内にご返信いたします。",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}
