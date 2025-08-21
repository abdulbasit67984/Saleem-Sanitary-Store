// src/utils/quotationStorage.js
const KEY = "quotations";
const LIMIT = 12;

export function getQuotations() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function setQuotations(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addQuotation(q) {
  const list = getQuotations();
  // enforce limit FIFO
  if (list.length >= LIMIT) list.shift();
  list.push(q);
  setQuotations(list);
  return q;
}

export function deleteQuotation(id) {
  const list = getQuotations().filter(q => String(q.id) !== String(id));
  setQuotations(list);
  return list;
}

export function deleteQuotations(ids = []) {
  const setIds = new Set(ids.map(String));
  const list = getQuotations().filter(q => !setIds.has(String(q.id)));
  setQuotations(list);
  return list;
}

export function clearQuotations() {
  localStorage.removeItem(KEY);
}

export function getQuotationById(id) {
  return getQuotations().find(q => String(q.id) === String(id)) || null;
}
