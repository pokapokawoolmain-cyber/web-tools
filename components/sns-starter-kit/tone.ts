import type { CSSProperties } from "react";
import type { CommunityPalette } from "@/lib/sns-starter-kit/content";

/** コミュニティ固有色を CSS 変数として渡す（どこに色を使うかは lp.module.css 側で限定する）。 */
export function toneVars(p: CommunityPalette): CSSProperties {
  return { "--tone": p.tone, "--tone-ink": p.ink, "--tone-soft": p.soft } as CSSProperties;
}
