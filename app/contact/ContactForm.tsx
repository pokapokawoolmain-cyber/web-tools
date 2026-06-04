"use client";
import { useState } from "react";
import Link from "next/link";
import { Send, Check } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScXNR7OQ7hETFW3VoFnqiJbVUV9WI7pjJ-GkUnxIaFIFuvhCw/formResponse";
  const ENTRY_NAME = "entry.1234567890";
  const ENTRY_EMAIL = "entry.0987654321";
  const ENTRY_CATEGORY = "entry.1111111111";
  const ENTRY_MESSAGE = "entry.2222222222";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);

    // Google Formへのサイレント送信（no-corsのためエラーは無視）
    const formData = new FormData();
    formData.append(ENTRY_NAME, name);
    formData.append(ENTRY_EMAIL, email);
    formData.append(ENTRY_CATEGORY, category);
    formData.append(ENTRY_MESSAGE, message);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
    } catch {
      // no-corsなのでエラーは無視
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ヘッダー */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="パンくずリスト" className="mb-4 text-sm text-slate-500">
            <ol className="flex items-center gap-1">
              <li><Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">ToolBox</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 dark:text-slate-300">お問い合わせ</li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            お問い合わせ
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed">
            ToolBoxへのご質問・ご要望・バグ報告・掲載ツールのご提案など、お気軽にお送りください。
            通常2〜5営業日以内にご返信いたします。
          </p>
        </div>
      </div>

      {/* フォーム */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {submitted ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">送信が完了しました</h2>
            <p className="text-[14px] text-slate-500 dark:text-zinc-400">
              お問い合わせありがとうございます。<br />
              内容を確認の上、ご返信いたします（2〜5営業日程度）。
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-[14px] font-medium hover:bg-blue-700 transition-colors"
            >
              トップページへ戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 注意書き */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 text-[13px] text-amber-700 dark:text-amber-400">
              ⚠️ 個人情報のご相談・法的なアドバイスには対応できません。税務・法務の個別相談は専門家にお問い合わせください。
            </div>

            {/* お名前 */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                お名前 <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="山田 太郎"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                メールアドレス <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
              />
            </div>

            {/* お問い合わせ種別 */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                お問い合わせ種別
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
              >
                <option value="">選択してください（任意）</option>
                <option value="bug">バグ報告・不具合</option>
                <option value="feature">新機能・新ツールのご要望</option>
                <option value="question">ツールの使い方に関する質問</option>
                <option value="content">記事内容に関するご意見</option>
                <option value="other">その他</option>
              </select>
            </div>

            {/* お問い合わせ内容 */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                お問い合わせ内容 <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="ご質問・ご要望の内容をできるだけ詳しくお書きください。バグ報告の場合は、使用しているブラウザ・デバイスの情報も添えていただけると助かります。"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 resize-none"
              />
              <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">{message.length} 文字</p>
            </div>

            {/* プライバシーポリシー同意 */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                required
                className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="privacy" className="text-[13px] text-slate-600 dark:text-zinc-400 cursor-pointer">
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">プライバシーポリシー</Link>
                に同意の上、送信します
              </label>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading || !name || !email || !message}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-zinc-700 text-white font-semibold text-[15px] transition-colors"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "送信中..." : "送信する"}
            </button>

            <p className="text-[12px] text-slate-400 dark:text-zinc-500 text-center">
              ご返信は入力いただいたメールアドレスに送らせていただきます。
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
