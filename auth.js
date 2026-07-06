const STORAGE_SESSION = "podium_session_v1";

function roleForEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (e === "admin@podium.com") return "admin";
  if (e === "caja@podium.com") return "caja";
  if (e === "inventario@podium.com") return "inventario";
  if (e === "supervisor@podium.com") return "supervisor";
  return "unknown";
}

function setSession(email) {
  const role = roleForEmail(email);
  const session = { email: String(email || "").trim(), role, createdAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
  return session;
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION);
}

function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s !== "object") return null;
    if (!s.role) s.role = roleForEmail(s.email);
    return s;
  } catch {
    return null;
  }
}

function requireSession(allowedRoles) {
  const s = getSession();
  if (!s) {
    window.location.href = "./index.html";
    return null;
  }
  if (Array.isArray(allowedRoles) && allowedRoles.length && !allowedRoles.includes(s.role)) {
    window.location.href = "./index.html";
    return null;
  }
  return s;
}

function canAdminEdit(role) {
  return role === "admin" || role === "inventario";
}
