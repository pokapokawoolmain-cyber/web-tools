// ============================================================
// /goods の公開環境変数
//
// ここに置くのは「ブラウザに出てよい値」だけ。
// service role key はこのモジュールにも、クライアントから import される
// どのモジュールにも書かない（Phase 1 のアプリ本体は service role を使わない）。
// ============================================================
export function goodsSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_GOODS_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_GOODS_SUPABASE_URL / NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY が未設定です。");
  }
  return { url, anonKey };
}

/** 設定済みか（未設定の環境では /goods を「準備中」として表示し、例外で落とさない） */
export function isGoodsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOODS_SUPABASE_URL && process.env.NEXT_PUBLIC_GOODS_SUPABASE_ANON_KEY);
}

/** Google ログインボタンを出すか（プロバイダ設定が済んだ環境でのみ true にする） */
export const GOODS_GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOODS_GOOGLE_ENABLED === "true";

export const GOODS_BUCKET = "goods-images";
