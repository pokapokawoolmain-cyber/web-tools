---
title: "Web Crypto API（AES-256-GCM）でブラウザだけでファイルを暗号化する【Next.js】"
emoji: "🔐"
type: "tech"
topics: ["nextjs", "typescript", "react", "crypto", "webapi"]
published: true
---

## はじめに

ファイルの暗号化というと、サーバーサイドで OpenSSL を動かすイメージがあります。しかし **Web Crypto API**（ブラウザ標準）を使えば、**サーバーへの送信なしにAES-256-GCMでファイルを暗号化・復号**できます。

- インストール不要（ブラウザ標準API）
- PBKDF2 でパスワードからAES-256キーを導出
- AES-GCM（認証付き暗号）で暗号化・改ざん検出
- ファイルはサーバーに一切送信されない

実際に動くツール → [PDFパスワード設定ツール - ToolBoxJP](https://www.toolboxjp.com/tools/pdf-password)

---

## Web Crypto APIとは

`window.crypto.subtle` から使えるブラウザ標準の暗号化API。IE以外のすべてのモダンブラウザで対応しており、外部ライブラリ不要です。

```ts
// インストール不要で使える
const key = await crypto.subtle.generateKey(...);
const encrypted = await crypto.subtle.encrypt(...);
```

---

## 暗号化の設計

今回の実装では以下の構成を採用します。

```
パスワード（string）
    ↓ PBKDF2（120,000イテレーション、SHA-256）
AES-256-GCM キー（256bit）
    ↓
暗号化（IV: 12バイト、ランダム生成）
    ↓
出力バイナリ: MAGIC(8) + SALT(16) + IV(12) + 暗号文(N)
```

**各パラメータの役割：**
- **MAGIC**: ファイルフォーマット識別子（間違ったファイルを復号しようとしたときのエラー判定）
- **SALT**: PBKDF2のソルト（同じパスワードでも毎回異なるキーを生成）
- **IV**: AES-GCMの初期ベクター（同じキー+同じIVで暗号化しないためランダム生成）

---

## 実装

### 1. パスワードからAES-256キーを導出（PBKDF2）

```ts
const ENC = new TextEncoder();

async function deriveKey(
  password: string,
  salt: Uint8Array,
  usage: KeyUsage[]  // ["encrypt"] or ["decrypt"]
): Promise<CryptoKey> {
  // パスワード文字列をCryptoKeyとしてインポート
  const rawKey = await crypto.subtle.importKey(
    "raw",
    ENC.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // PBKDF2でAES-256キーを導出
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 120000,  // NIST推奨: 600,000+（速度とのトレードオフ）
      hash: "SHA-256",
    },
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,       // extractable: false（キーを外部に取り出せないようにする）
    usage
  );
}
```

**イテレーション数について：**
NIST SP 800-132 では 600,000以上を推奨していますが、ブラウザでの処理時間（数百ms〜数秒）とのトレードオフです。今回は120,000を採用していますが、セキュリティ要件に応じて増やせます。

### 2. ファイルの暗号化

```ts
const MAGIC = "TBPDF002";  // フォーマット識別子

async function encryptFile(
  fileBytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  // ランダムなSALTとIVを生成
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));  // AES-GCMは96bit推奨

  const key = await deriveKey(password, salt, ["encrypt"]);

  // AES-GCM暗号化
  const cipher = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileBytes
    )
  );

  // バイナリレイアウト: MAGIC(8) + SALT(16) + IV(12) + 暗号文(N)
  const out = new Uint8Array(8 + 16 + 12 + cipher.length);
  out.set(new TextEncoder().encode(MAGIC), 0);  // 0〜7
  out.set(salt, 8);                              // 8〜23
  out.set(iv, 24);                               // 24〜35
  out.set(cipher, 36);                           // 36〜
  return out;
}
```

### 3. ファイルの復号

```ts
async function decryptFile(
  encBytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  // MAGICの検証（間違ったファイルの早期検出）
  const magic = new TextDecoder().decode(encBytes.slice(0, 8));
  if (magic !== MAGIC) {
    throw new Error("INVALID_FORMAT");  // このツールで暗号化していないファイル
  }

  // バイナリからSALT・IV・暗号文を取り出す
  const salt = encBytes.slice(8, 24);
  const iv = encBytes.slice(24, 36);
  const cipher = encBytes.slice(36);

  const key = await deriveKey(password, salt, ["decrypt"]);

  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher
    );
    return new Uint8Array(plain);
  } catch {
    // AES-GCMは認証付き暗号なので、パスワード誤りや改ざんは例外で検出できる
    throw new Error("WRONG_PASSWORD");
  }
}
```

**AES-GCMの強みはここ：**
AES-GCMは「認証付き暗号（AEAD）」なので、復号時に**データの改ざんも検出**します。パスワードが間違っていても、データが改ざんされていても、`decrypt` は必ず例外をスローします。

### 4. Reactコンポーネントでの使い方

```tsx
"use client";
import { useState } from "react";

export function PdfEncryptor() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");

  const handleEncrypt = async () => {
    if (!file || !password) return;
    setStatus("processing");

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const encrypted = await encryptFile(bytes, password);

      // Blobとしてダウンロード
      const blob = new Blob([encrypted], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "_protected.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const handleDecrypt = async () => {
    if (!file || !password) return;
    setStatus("processing");

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const decrypted = await decryptFile(bytes, password);

      const blob = new Blob([decrypted], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decrypted.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setStatus("done");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "INVALID_FORMAT") {
        alert("このツールで暗号化したファイルではありません");
      } else if (msg === "WRONG_PASSWORD") {
        alert("パスワードが間違っています");
      }
      setStatus("error");
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
      <button onClick={handleEncrypt} disabled={status === "processing"}>暗号化</button>
      <button onClick={handleDecrypt} disabled={status === "processing"}>復号</button>
    </div>
  );
}
```

---

## パスワード強度チェック

```ts
function getPasswordStrength(pw: string): "weak" | "medium" | "strong" | "very-strong" {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;  // 大文字小文字混在
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;  // 数字+記号

  const labels = ["weak", "medium", "strong", "very-strong"] as const;
  return labels[Math.min(score, 3)];
}
```

---

## 制限事項

**Adobe Acrobatでは開けない**

Web Crypto APIで実装した暗号化は、PDFの標準暗号化仕様（ISO 32000）に準拠していません。Adobe AcrobatなどのPDFビューアで直接開くことはできないため、**このツールで復号した後にPDFとして利用**する必要があります。

標準PDF暗号化（Adobe互換）はブラウザAPIでは実装困難です（RC4/AES-256のカスタムフォーマットが必要なため）。

---

## セキュリティまとめ

| 項目 | 実装 |
|---|---|
| 暗号化アルゴリズム | AES-256-GCM（AEAD） |
| キー導出 | PBKDF2 + SHA-256（120,000イテレーション） |
| ソルト | 16バイト（ランダム生成） |
| IV | 12バイト（ランダム生成） |
| 改ざん検出 | AES-GCMの認証タグで自動検出 |
| ファイル送信 | なし（ブラウザ完結） |

---

## まとめ

Web Crypto APIはインストール不要でAES-256-GCMが使えるブラウザ標準APIです。

```
パスワード → PBKDF2 → AES-256キー → AES-GCM暗号化 → Blobダウンロード
```

サーバーレス・インストール不要でファイルを暗号化できるため、社内文書や個人情報を含むPDFの保護ユースケースに適しています。

実際のデモは [ToolBoxJP のPDFパスワード設定ツール](https://www.toolboxjp.com/tools/pdf-password) で確認できます。

---

## 参考

- [Web Crypto API - MDN](https://developer.mozilla.org/ja/docs/Web/API/Web_Crypto_API)
- [SubtleCrypto.encrypt() - MDN](https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/encrypt)
- [PBKDF2 - MDN](https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/deriveKey)
- [NIST SP 800-132 (PDF)](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)
