// サーバー側（Server Component / middleware）から Supabase への通信にタイムアウトを付ける。
// DB・Auth が応答しないときにスケルトンのまま待たせず、エラー画面へ切り替えるため。
const SERVER_FETCH_TIMEOUT_MS = 10_000;

export const fetchWithTimeout: typeof fetch = async (input, init) => {
  const timeout = AbortSignal.timeout(SERVER_FETCH_TIMEOUT_MS);
  // ライブラリ側が渡す signal も生かしたまま、タイムアウトを重ねる
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  try {
    return await fetch(input, { ...init, signal });
  } catch (e) {
    // postgrest-js は AbortError 以外の失敗を自動リトライする（最大3回）。
    // タイムアウト（TimeoutError）までリトライすると 40 秒以上待たせるため、中断として扱う。
    if (e instanceof Error && e.name === "TimeoutError") {
      throw new DOMException("Supabase request timed out", "AbortError");
    }
    throw e;
  }
};
