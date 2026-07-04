import { Sparkles } from "lucide-react";
import { sectionFavicon, iconSize, iconContentType } from "@/lib/favicon";

export const size = iconSize;
export const contentType = iconContentType;

export default function Icon() {
  return sectionFavicon(Sparkles, "#22d3ee");
}
