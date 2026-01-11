import type { BatchItem } from "../types";

export function parseCsv(text: string): BatchItem[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const header = lines[0].split(",").map((s) => s.trim().toLowerCase());
  const idxUser = header.indexOf("userid");
  const idxDelta = header.indexOf("delta");
  const idxReason = header.indexOf("reason");
  const idxRef = header.indexOf("externalref");

  const out: BatchItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const userId = cols[idxUser]?.trim();
    const delta = cols[idxDelta]?.trim();
    const reason = cols[idxReason]?.trim();
    const externalRef = idxRef >= 0 ? cols[idxRef]?.trim() : undefined;

    if (userId && delta && reason) {
      out.push({ userId, delta, reason, externalRef });
    }
  }
  return out;
}

export function parseJson(text: string): BatchItem[] {
  const arr = JSON.parse(text);
  if (!Array.isArray(arr)) {
    throw new Error("JSON root must be an array");
  }
  return arr as BatchItem[];
}
