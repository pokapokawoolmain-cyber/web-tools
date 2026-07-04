import { toolFavicon, iconSize, iconContentType } from "@/lib/favicon";

export const size = iconSize;
export const contentType = iconContentType;

export default function Icon() {
  return toolFavicon("pdf-split");
}
