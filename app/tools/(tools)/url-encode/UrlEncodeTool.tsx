"use client";

import { EncodeDecodeTool } from "@/components/tools/EncodeDecodeTool";
import { urlEncode, urlDecode } from "@/lib/dev-encode";

export function UrlEncodeTool() {
  return (
    <EncodeDecodeTool
      encode={urlEncode}
      decode={urlDecode}
      sample="https://example.com/検索?q=開発 ツール&tag=a/b"
      variants={[
        { value: "full", label: "全記号（encodeURIComponent）" },
        { value: "uri", label: "URL構造は保持（encodeURI）" },
      ]}
      encodeLabel="URLエンコード"
      decodeLabel="URLデコード"
    />
  );
}
