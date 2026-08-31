/** NovaCRM display formatters. */
export function formatCurrency(n, currency="USD") {
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return new Intl.NumberFormat("en-US", { style:"currency", currency, maximumFractionDigits:0 }).format(num);
}
export function formatDate(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }); }
  catch { return String(iso); }
}
export function formatStage(stage) {
  const map = { Lead:"neutral", Qualified:"info", Proposal:"info", Negotiation:"warning", Won:"success", Lost:"danger" };
  return map[stage] || "default";
}
export function truncate(s, max=48) {
  const t = String(s||"");
  return t.length <= max ? t : t.slice(0, max-1) + "…";
}
