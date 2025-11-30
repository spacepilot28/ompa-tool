// UTF-8 sicherer Encode: JSON -> base64
export function encodeReportPayload(payload: unknown): string {
  const json = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(json);

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

// UTF-8 sicherer Decode: base64 -> JSON
export function decodeReportPayload<T = unknown>(encoded: string): T {
  const binary = atob(encoded);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");
  const json = decoder.decode(bytes);
  return JSON.parse(json) as T;
}
