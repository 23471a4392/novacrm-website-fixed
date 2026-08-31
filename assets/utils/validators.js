/** NovaCRM form validators. */
export function required(v) { return v != null && String(v).trim().length > 0; }
export function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||"").trim()); }
export function isPhone(v) {
  const d = String(v||"").replace(/\D/g,"");
  return d.length >= 7 && d.length <= 15;
}
export function validateContact(p) {
  const e = {};
  if (!required(p.name)) e.name = "Name is required";
  if (p.email && !isEmail(p.email)) e.email = "Invalid email";
  if (p.phone && !isPhone(p.phone)) e.phone = "Invalid phone";
  return e;
}
export function validateDeal(p) {
  const e = {};
  if (!required(p.title)) e.title = "Title is required";
  if (p.value != null && Number(p.value) < 0) e.value = "Value must be >= 0";
  return e;
}
export function validateTask(p) {
  const e = {};
  if (!required(p.title)) e.title = "Title is required";
  return e;
}
