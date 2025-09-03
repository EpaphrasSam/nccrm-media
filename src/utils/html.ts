export function isHtmlLike(val: unknown): boolean {
  if (typeof val !== "string") return false;
  const s = val.trim();
  return (
    s.startsWith("<") ||
    s.toLowerCase().includes("<!doctype html") ||
    s.toLowerCase().includes("<html") ||
    /<\/?[a-z][\s\S]*>/i.test(s)
  );
}
