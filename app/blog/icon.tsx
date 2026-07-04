import { BookOpen } from "lucide-react";
import { sectionFavicon, iconSize, iconContentType } from "@/lib/favicon";

export const size = iconSize;
export const contentType = iconContentType;

export default function Icon() {
  return sectionFavicon(BookOpen, "#3b82f6");
}
