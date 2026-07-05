"use client";

import { EncodeDecodeTool } from "@/components/tools/EncodeDecodeTool";
import { base64Encode, base64Decode } from "@/lib/dev-encode";

export function Base64Tool() {
  return (
    <EncodeDecodeTool
      encode={base64Encode}
      decode={base64Decode}
      sample="ToolBox 開発者ツール 🔤"
      variants={[
        { value: "standard", label: "標準" },
        { value: "urlsafe", label: "URLセーフ（-_・パディングなし）" },
      ]}
      encodeLabel="Base64にエンコード"
      decodeLabel="テキストにデコード"
    />
  );
}
