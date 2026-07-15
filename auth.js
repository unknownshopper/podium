const STORAGE_SESSION = "podium_session_v2";
const STORAGE_USERS = "podium_users_v2";

function roleForEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (e === "admin@podium.com") return "admin";
  if (e === "supervisor@podium.com") return "supervisor";
  if (e === "caja1@podium.com") return "caja1";
  if (e === "caja2@podium.com") return "caja2";
  if (e === "inventario@podium.com") return "inventario";
  
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
  if (
    existing &&
    typeof existing === "object" &&
    !Array.isArray(existing) &&
    Object.keys(existing).length > 0
  ) {
    return existing;
  }

  const hash123 = await sha256Hex("podium123");
  const hash234 = await sha256Hex("podium234");
  const users = {
    "admin@podium.com": { role: "admin", passwordHash: hash123 },
    "caja1@podium.com": { role: "caja1", passwordHash: hash123 },
    "caja2@podium.com": { role: "caja2", passwordHash: hash234 },
    "inventario@podium.com": { role: "inventario", passwordHash: hash123 },
    "supervisor@podium.com": { role: "supervisor", passwordHash: hash123 },
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
