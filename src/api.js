export const api = async (path, { method = 'GET', body, admin } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (admin) headers.Authorization = `Bearer ${localStorage.getItem('aneli_token')}`;
  const r = await fetch(`/api${path}`, { method, headers, body: body && JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && admin) { localStorage.removeItem('aneli_token'); location.reload(); }
  if (!r.ok) throw new Error(data.error || 'Request failed');
  return data;
};
export const money = (n) => `€${Number(n || 0).toFixed(2)}`;
