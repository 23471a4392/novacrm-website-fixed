export const moduleKey = "contacts";
export const moduleTitle = "Contacts";
export function filterByStatus(list, status) {
  if (!status || status === "All") return list;
  return list.filter(c => (c.status||"") === status);
}
export function searchContacts(list, q) {
  const s = String(q||"").toLowerCase();
  if (!s) return list;
  return list.filter(c => JSON.stringify(c).toLowerCase().includes(s));
}
