import { Wallet } from "lucide-react";
import { sectionFavicon, iconSize, iconContentType } from "@/lib/favicon";

export const size = iconSize;
export const contentType = iconContentType;

export default function Icon() {
  return sectionFavicon(Wallet, "#34d399");
}
