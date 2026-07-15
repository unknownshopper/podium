const STORAGE_SESSION = "podium_session_v1";
const STORAGE_USERS = "podium_users_v1";

function roleForEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (e === "admin@podium.com") return "admin";
  if (e === "caja@podium.com") return "caja";
  if (e === "inventario@podium.com") return "inventario";
  if (e === "supervisor@podium.com") return "supervisor";
  return "unknown";
}

async function sha256Hex(str) {
  const txt = String(str ?? "");
  if (!globalThis.crypto?.subtle) {
    return "plain:" + txt;
  }
  const bytes = new TextEncoder().encode(txt);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u !== "object") return null;
    return u;
  } catch {
    return null;
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

async function ensureSeedUsers() {
  const existing = loadUsers();
  if (existing) return existing;

  const defaultPassword = "podium123";
  const hash = await sha256Hex(defaultPassword);
  const users = {
    "admin@podium.com": { role: "admin", passwordHash: hash },
    "caja@podium.com": { role: "caja", passwordHash: hash },
    "inventario@podium.com": { role: "inventario", passwordHash: hash },
    "supervisor@podium.com": { role: "supervisor", passwordHash: hash },
  };
  saveUsers(users);
  return users;
}

async function login(email, password) {
  const e = String(email || "").trim().toLowerCase();
  const users = await ensureSeedUsers();
  const u = users?.[e];
  if (!u) return null;
  const inputHash = await sha256Hex(String(password || ""));
  if (u.passwordHash !== inputHash) return null;

  const role = u.role || roleForEmail(e);
  const session = { email: e, role, createdAt: new Date().toISOString() };
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
    window.location.href = "./auth.html";
    return null;
  }
  if (Array.isArray(allowedRoles) && allowedRoles.length && !allowedRoles.includes(s.role)) {
    window.location.href = "./auth.html";
    return null;
  }
  return s;
}

function canAdminEdit(role) {
  return role === "admin" || role === "inventario";
}
