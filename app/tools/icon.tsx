import { LayoutGrid } from "lucide-react";
import { sectionFavicon, iconSize, iconContentType } from "@/lib/favicon";

export const size = iconSize;
export const contentType = iconContentType;

export default function Icon() {
  return sectionFavicon(LayoutGrid, "#3b82f6");
}
