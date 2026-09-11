/** Tiny class-name joiner. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Copy text to clipboard with a small fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Format an ISO-ish local timestamp for the details header. */
export function formatTimestamp(ts: string | number): string {
  return new Date(ts).toLocaleString("en-US", {
    hour12: false,
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Method â†’ color token. Kept as a class suffix. */
export function methodClass(method: string): string {
  return `method--${method.toLowerCase()}`;
}

/** Status â†’ tone token. */
export function statusTone(status: number): "success" | "error" | "redirect" | "pending" {
  if (status >= 500 || status >= 400) return "error";
  if (status >= 300) return "redirect";
  if (status >= 200) return "success";
  return "pending";
}
