export const api = async (path, { method = "GET", body, admin } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (admin)
    headers.Authorization = `Bearer ${localStorage.getItem("aneli_token")}`;
  const url = `/api${path}`;
  let r;
  try {
    r = await fetch(url, {
      method,
      headers,
      body: body && JSON.stringify(body),
    });
  } catch (e) {
    console.error(`[api] ${method} ${url} could not reach the server`, e);
    throw new Error("Cannot reach the server. Is the API running?");
  }
  const text = await r.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {}
  if (r.status === 401 && admin) {
    localStorage.removeItem("aneli_token");
    location.reload();
  }
  if (!r.ok) {
    console.error(
      `[api] ${method} ${url} -> ${r.status}`,
      data.error ? data : text.slice(0, 300),
    );
    const plain = text
      .replace(/<title>[\s\S]*?<\/title>/i, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
    const msg = data.error
      ? `${data.error}${data.hint ? ` ${data.hint}` : ""}`
      : r.status === 404
        ? `The server answered 404 for ${method} ${url} (${plain || "not found"}). The API server is probably running old code: restart it and open /api/health.`
        : plain || "Request failed";
    throw new Error(msg);
  }
  return data;
};
export const money = (n) => `€${Number(n || 0).toFixed(2)}`;
