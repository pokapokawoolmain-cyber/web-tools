"use client";
import { useState, useCallback, useRef } from "react";
import { Upload, Lock, Unlock, Loader2, CheckCircle2, Eye, EyeOff, X, AlertTriangle } from "lucide-react";

type Tab = "protect" | "unlock";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { level: 1, label: "弱い", color: "bg-red-400" },
    { level: 2, label: "普通", color: "bg-orange-400" },
    { level: 3, label: "強い", color: "bg-yellow-400" },
    { level: 4, label: "非常に強い", color: "bg-green-500" },
  ] as const;
  return levels[Math.min(score, 3)] as { level: 0 | 1 | 2 | 3 | 4; label: string; color: string };
}

const MAGIC = "TBPDF002";
const ENC = new TextEncoder();
const DEC = new TextDecoder();

function toU8(a: Uint8Array): Uint8Array<ArrayBuffer> {
  return a.buffer instanceof ArrayBuffer ? (a as Uint8Array<ArrayBuffer>) : new Uint8Array(a);
}

async function deriveKey(password: string, salt: Uint8Array, usage: KeyUsage[]): Promise<CryptoKey> {
  const raw = await crypto.subtle.importKey("raw", ENC.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: toU8(salt), iterations: 120000, hash: "SHA-256" },
    raw,
    { name: "AES-GCM", length: 256 },
    false,
    usage
  );
}

async function encryptPdf(pdfBytes: Uint8Array, password: string): Promise<Uint8Array<ArrayBuffer>> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ["encrypt"]);
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: toU8(iv) }, key, toU8(pdfBytes)));
  // Layout: magic(8) + salt(16) + iv(12) + cipher(N)
  const out = new Uint8Array(36 + cipher.length);
  out.set(ENC.encode(MAGIC), 0);
  out.set(salt, 8);
  out.set(iv, 24);
  out.set(cipher, 36);
  return toU8(out);
}

async function decryptPdf(encBytes: Uint8Array, password: string): Promise<Uint8Array<ArrayBuffer>> {
  const magic = DEC.decode(encBytes.slice(0, 8));
  if (magic !== MAGIC) throw new Error("INVALID_FORMAT");
  const salt = encBytes.slice(8, 24);
  const iv = encBytes.slice(24, 36);
  const cipher = encBytes.slice(36);
  const key = await deriveKey(password, salt, ["decrypt"]);
  try {
    return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: toU8(iv) }, key, toU8(cipher))) as Uint8Array<ArrayBuffer>;
  } catch {
    throw new Error("WRONG_PASSWORD");
  }
}

export function PdfPassword() {
  const [tab, setTab] = useState<Tab>("protect");

  // Protect state
  const [protectFile, setProtectFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [protecting, setProtecting] = useState(false);
  const [protectDone, setProtectDone] = useState(false);
  const [protectError, setProtectError] = useState<string | null>(null);
  const [protectDragOver, setProtectDragOver] = useState(false);
  const protectInputRef = useRef<HTMLInputElement>(null);

  // Unlock state
  const [unlockFile, setUnlockFile] = useState<File | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [showUnlockPw, setShowUnlockPw] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockDone, setUnlockDone] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockDragOver, setUnlockDragOver] = useState(false);
  const unlockInputRef = useRef<HTMLInputElement>(null);

  const loadProtectFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setProtectError("PDFファイルを選択してください"); return;
    }
    setProtectError(null); setProtectDone(false); setProtectFile(f);
  }, []);

  const loadUnlockFile = useCallback((f: File) => {
    setUnlockError(null); setUnlockDone(false); setUnlockFile(f);
  }, []);

  const strength = getPasswordStrength(password);

  const handleProtect = async () => {
    if (!protectFile) { setProtectError("PDFファイルを選択してください"); return; }
    if (!password) { setProtectError("パスワードを入力してください"); return; }
    if (password !== confirmPassword) { setProtectError("パスワードが一致しません"); return; }
    if (password.length < 4) { setProtectError("パスワードは4文字以上で設定してください"); return; }
    setProtecting(true); setProtectError(null);
    try {
      const bytes = new Uint8Array(await protectFile.arrayBuffer());
      const encrypted = await encryptPdf(bytes, password);
      const blob = new Blob([encrypted], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = protectFile.name.replace(/\.pdf$/i, "") + "_protected.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setProtectDone(true);
    } catch {
      setProtectError("暗号化処理に失敗しました。");
    } finally {
      setProtecting(false);
    }
  };

  const handleUnlock = async () => {
    if (!unlockFile) { setUnlockError("ファイルを選択してください"); return; }
    if (!unlockPassword) { setUnlockError("パスワードを入力してください"); return; }
    setUnlocking(true); setUnlockError(null);
    try {
      const bytes = new Uint8Array(await unlockFile.arrayBuffer());
      const decrypted = await decryptPdf(bytes, unlockPassword);
      const blob = new Blob([decrypted], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = unlockFile.name.replace(/_protected\.pdf$/i, "").replace(/\.pdf$/i, "") + "_unlocked.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setUnlockDone(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "INVALID_FORMAT") {
        setUnlockError("このファイルはToolBox形式で保護されていません。このツールで保護したファイルのみ解除できます。");
      } else if (msg === "WRONG_PASSWORD") {
        setUnlockError("パスワードが違います。正しいパスワードを入力してください。");
      } else {
        setUnlockError("解除に失敗しました。");
      }
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/40 mb-4">
            <Lock className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">PDFパスワード設定ツール</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">AES-256でPDFを暗号化・解除。ブラウザ完結でサーバー保存なし。</p>
        </div>

        {/* Important notice */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 重要な注意事項</p>
              <p className="text-[13px] text-amber-700 dark:text-amber-400 leading-relaxed">
                このツールは<strong>AES-256-GCM</strong>（軍用規格）でPDFを暗号化します。<br />
                保護したファイルは<strong>Adobe AcrobatなどのPDFビューアでは開けません</strong>。このページの「解除する」タブで復号してください。<br />
                ファイルを共有する際は、受け取った方もこのページで解除する必要があります。<br />
                <span className="font-semibold">Adobe Acrobat対応の標準PDF保護にはLibreOffice（無料）をご使用ください。</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800 mb-6">
          {(["protect", "unlock"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-semibold transition-all
                ${tab === t ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700"}`}
            >
              {t === "protect" ? <><Lock className="w-4 h-4" />保護する</> : <><Unlock className="w-4 h-4" />解除する</>}
            </button>
          ))}
        </div>

        {/* ── PROTECT TAB ── */}
        {tab === "protect" && (
          <div className="space-y-4">
            {/* Drop zone */}
            {!protectFile ? (
              <div
                onDrop={(e) => { e.preventDefault(); setProtectDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadProtectFile(f); }}
                onDragOver={(e) => { e.preventDefault(); setProtectDragOver(true); }}
                onDragLeave={() => setProtectDragOver(false)}
                onClick={() => protectInputRef.current?.click()}
                className={`rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center
                  ${protectDragOver ? "border-violet-400 bg-violet-50 dark:bg-violet-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-violet-300"}`}
              >
                <input ref={protectInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) { loadProtectFile(e.target.files[0]); e.target.value = ""; } }} />
                <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">PDFをドロップ、またはタップして選択</p>
                <p className="text-[13px] text-slate-400 mt-1">PDF形式のみ対応</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-2xl px-4 py-3">
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">{protectFile.name}</p>
                  <p className="text-[12px] text-slate-400">{formatSize(protectFile.size)}</p>
                </div>
                <button onClick={() => { setProtectFile(null); setProtectDone(false); }} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Password inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 block">パスワード</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[15px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= strength.level ? strength.color : "bg-slate-200 dark:bg-zinc-700"}`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-medium ${strength.level <= 1 ? "text-red-500" : strength.level === 2 ? "text-orange-500" : strength.level === 3 ? "text-yellow-600" : "text-green-600"}`}>
                      パスワード強度: {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 block">パスワード確認</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="パスワードを再入力"
                  className={`w-full px-4 py-3 rounded-2xl border bg-white dark:bg-zinc-900 text-[15px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-colors
                    ${confirmPassword && password !== confirmPassword ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-zinc-700"}`}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[12px] text-red-500 mt-1">パスワードが一致しません</p>
                )}
              </div>
            </div>

            {protectError && <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{protectError}</div>}
            {protectDone && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">暗号化完了！解除するには「解除する」タブを使ってください。</span>
              </div>
            )}

            <button
              onClick={handleProtect}
              disabled={!protectFile || !password || password !== confirmPassword || protecting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
            >
              {protecting ? <><Loader2 className="w-5 h-5 animate-spin" />暗号化中...</> : <><Lock className="w-5 h-5" />PDFを暗号化してダウンロード</>}
            </button>
          </div>
        )}

        {/* ── UNLOCK TAB ── */}
        {tab === "unlock" && (
          <div className="space-y-4">
            {!unlockFile ? (
              <div
                onDrop={(e) => { e.preventDefault(); setUnlockDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadUnlockFile(f); }}
                onDragOver={(e) => { e.preventDefault(); setUnlockDragOver(true); }}
                onDragLeave={() => setUnlockDragOver(false)}
                onClick={() => unlockInputRef.current?.click()}
                className={`rounded-3xl border-2 border-dashed transition-all cursor-pointer p-10 text-center
                  ${unlockDragOver ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:border-emerald-300"}`}
              >
                <input ref={unlockInputRef} type="file" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) { loadUnlockFile(e.target.files[0]); e.target.value = ""; } }} />
                <Upload className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">保護ファイルをドロップ、またはタップして選択</p>
                <p className="text-[13px] text-slate-400 mt-1">このツールで保護したファイルのみ解除可能</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl px-4 py-3">
                <span className="text-lg">🔒</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">{unlockFile.name}</p>
                  <p className="text-[12px] text-slate-400">{formatSize(unlockFile.size)}</p>
                </div>
                <button onClick={() => { setUnlockFile(null); setUnlockDone(false); }} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            )}

            <div>
              <label className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 block">パスワード</label>
              <div className="relative">
                <input
                  type={showUnlockPw ? "text" : "password"}
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="設定したパスワードを入力"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[15px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button onClick={() => setShowUnlockPw(!showUnlockPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showUnlockPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {unlockError && <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-[14px] text-red-600 dark:text-red-400">{unlockError}</div>}
            {unlockDone && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-[14px] text-green-700 dark:text-green-400 font-medium">解除完了！PDFをダウンロードしました。</span>
              </div>
            )}

            <button
              onClick={handleUnlock}
              disabled={!unlockFile || !unlockPassword || unlocking}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-semibold text-[15px] transition-all shadow-sm disabled:shadow-none"
            >
              {unlocking ? <><Loader2 className="w-5 h-5 animate-spin" />解除中...</> : <><Unlock className="w-5 h-5" />解除してダウンロード</>}
            </button>
          </div>
        )}

        {/* Usage */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">使い方</h2>
          <ol className="space-y-3 text-[14px] text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>「保護する」タブでPDFをアップロード</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>パスワードを入力して「PDFを暗号化してダウンロード」</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>受け取った方は「解除する」タブでファイルとパスワードを入力して復号</li>
          </ol>
          <p className="mt-4 text-[12px] text-slate-400 dark:text-zinc-500">すべての処理はブラウザ内で完結。ファイルもパスワードもサーバーに送信されません。</p>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "PDFにパスワードを設定できますか？", a: "はい。AES-256-GCM（軍用規格の暗号化）でPDFを保護します。ただし、保護されたファイルはAdobe AcrobatなどのPDFビューアでは開けません。このページの「解除する」タブで復号が必要です。" },
              { q: "Adobe Acrobatで開ける標準PDF保護に対応していますか？", a: "対応していません。ブラウザの技術的制限により、Adobe互換の標準PDF暗号化（RC4/AES-256）はブラウザのみでは実装できません。標準保護にはLibreOffice（無料）またはAdobe Acrobatをご利用ください。" },
              { q: "パスワードはサーバーに送信されますか？", a: "いいえ。暗号化・復号はすべてブラウザ内で行われます。パスワードもファイルも外部サーバーに送信されません。" },
              { q: "パスワードを忘れた場合は？", a: "パスワードを忘れた場合、復号することはできません。設定したパスワードは必ず記録しておいてください。" },
            ].map((item) => (
              <div key={item.q} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-[14px] font-semibold text-slate-800 dark:text-white mb-1.5">{item.q}</p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
