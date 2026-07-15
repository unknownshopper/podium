
const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const STORAGE_SALES = "podium_demo_sales_v1";
const STORAGE_PRODUCTS = "podium_demo_products_v1";

function getSession() {
  try {
    const raw = localStorage.getItem("podium_session_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const state = {
  orderSeq: 1024,
  activeCategory: "Todos",
  query: "",
  products: [
    { id: "sm-zeus", name: "Zeus", category: "Smoothies", price: 99, desc: "Maracuyá, yogurt griego, leche deslactosada, leche de coco." },
    { id: "sm-poseidon", name: "Poseidon", category: "Smoothies", price: 85, desc: "Piña, naranja, mango, yogurt griego." },
    { id: "sm-afrodita", name: "Afrodita", category: "Smoothies", price: 99, desc: "Guayaba, fresas, naranja, chía, yogurt griego." },
    { id: "sm-hades", name: "Hades", category: "Smoothies", price: 99, desc: "Kiwi, aguacate, espinacas, dátiles, yogurt griego." },
    { id: "sm-athenea", name: "Athenea", category: "Smoothies", price: 99, desc: "Kiwi, fresas, crema de cacahuate, yogurt griego." },
    { id: "sm-hera", name: "Hera", category: "Smoothies", price: 110, desc: "Maracuyá, fresas, yogurt griego, leche deslactosada, leche de coco." },
    { id: "sm-ares", name: "Ares", category: "Smoothies", price: 110, desc: "Leche deslactosada, plátano, moka, canela, vainilla." },

    { id: "cf-americano", name: "Americano", category: "Cafés", price: 40, desc: "Café." },
    { id: "cf-capuchino", name: "Capuchino", category: "Cafés", price: 55, desc: "Café + leche." },
    { id: "cf-americano-frio", name: "Americano frío", category: "Cafés", price: 45, desc: "Café frío." },
    { id: "cf-orange-brew-tonic", name: "Orange brew tonic", category: "Cafés", price: 85, desc: "Tonic + café." },
    { id: "cf-dirty-chai", name: "Dirty Chai", category: "Cafés", price: 125, desc: "Chai con espresso." },
    { id: "cf-taro-latte", name: "Taro Latte", category: "Cafés", price: 85, desc: "Taro latte." },
    { id: "cf-chai-latte", name: "Chai Latte", category: "Cafés", price: 85, desc: "Chai latte." },

    { id: "jg-verde", name: "Jugo verde", category: "Jugos / Slushys", price: 60, desc: "Espinacas, manzana, apio, limón, jengibre." },
    { id: "jg-rojo", name: "Jugo rojo", category: "Jugos / Slushys", price: 70, desc: "Betabel, zanahoria, limón, jengibre, fresas." },
    { id: "sl-fresa", name: "Slushy de fresa", category: "Jugos / Slushys", price: 80, desc: "Frappeado de fresas naturales con chamoy." },
    { id: "sl-mango-pina", name: "Slushy de mango y piña", category: "Jugos / Slushys", price: 80, desc: "Frappeado de mango y piña con chamoy." },

    { id: "bd-chi", name: "Chi", category: "Bebidas", price: 35, desc: "Bebida." },
    { id: "bd-coca-zero", name: "Coca Zero", category: "Bebidas", price: 25, desc: "Refresco." },
    { id: "bd-agua", name: "Agua", category: "Bebidas", price: 25, desc: "Agua." },
    { id: "bd-gatorade", name: "Gatorade", category: "Bebidas", price: 25, desc: "Bebida isotónica." },
    { id: "bd-suero", name: "Suero", category: "Bebidas", price: 35, desc: "Bebida." },

    { id: "sw-4-quesos", name: "4 quesos", category: "Sandwiches / Chapatas", price: 160, desc: "Quesos brie, cabra, cheddar, manchego + mermelada de tocino. Con malangas." },
    { id: "sw-duo", name: "El dúo dinámico", category: "Sandwiches / Chapatas", price: 130, desc: "Huevo cocido, pavo, tocino, queso panela, tomate, aguacate, aderezo de cilantro. Con malangas." },
    { id: "sw-original", name: "El original", category: "Sandwiches / Chapatas", price: 130, desc: "Pechuga de pollo especiada, aguacate, lechuga, aderezo de cilantro. Con malangas." },
    { id: "sw-tunacado", name: "Tunacado", category: "Sandwiches / Chapatas", price: 130, desc: "Receta de tunacado + guacamole. Con malangas." },
    { id: "sw-roast-tomatoes", name: "Roast tomatoes", category: "Sandwiches / Chapatas", price: 130, desc: "Tomates especiados/deshidratados, pavo, queso panela, aguacate, aderezo chipotle. Con malangas." },

    { id: "ts-avocado-toast", name: "Avocado Toast", category: "Toasts", price: 0, desc: "Masa madre 7 granos + guacamole, arúgula, vinagreta balsámica, aceite de oliva. Elige proteína." },
    { id: "ts-avocado-salmon", name: "Avocado Toast (Salmón ahumado)", category: "Toasts", price: 130, desc: "Avocado toast + salmón ahumado." },
    { id: "ts-avocado-atun", name: "Avocado Toast (Atún)", category: "Toasts", price: 115, desc: "Avocado toast + atún." },
    { id: "ts-avocado-huevo", name: "Avocado Toast (Huevo)", category: "Toasts", price: 100, desc: "Avocado toast + huevo." },
    { id: "ts-french-toast", name: "French Toast", category: "Toasts", price: 130, desc: "Masa madre 7 granos, fresas, plátano y Nutella." },
    { id: "ts-apple-french-toast", name: "Apple French Toast", category: "Toasts", price: 130, desc: "Manzana caramelizada, crema de cacahuate, nuez de la india y Nutella." },

    { id: "ot-brownie", name: "Brownie", category: "Otros", price: 35, desc: "Postre." },
    { id: "ot-pan-zanahoria", name: "Pan de zanahoria", category: "Otros", price: 35, desc: "Pan dulce." },
    { id: "ot-pan-platano", name: "Pan de plátano", category: "Otros", price: 60, desc: "Pan dulce." },
    { id: "ot-barrita", name: "Barrita de proteina", category: "Otros", price: 35, desc: "Snack." },
    { id: "ot-malingas", name: "Malingas", category: "Otros", price: 40, desc: "Acompañamiento." },

    { id: "ex-shot", name: "Shot de leche", category: "Extra", price: 5, desc: "Extra." },
    { id: "ex-scoop-habbits", name: "Scoop Habbits", category: "Extra", price: 40, desc: "Extra." },
  ],
  cart: new Map(),
};

const els = {
  app: document.getElementById("app"),
  panelCats: document.getElementById("panelCats"),
  panelProducts: document.getElementById("panelProducts"),
  panelCart: document.getElementById("panelCart"),
  adminLink: document.getElementById("goAdmin"),
  logout: document.getElementById("logout"),
  categoryChips: document.getElementById("categoryChips"),
  searchInput: document.getElementById("searchInput"),
  clearBtn: document.getElementById("clearBtn"),
  productGrid: document.getElementById("productGrid"),
  cartItems: document.getElementById("cartItems"),
  total: document.getElementById("total"),
  itemsCount: document.getElementById("itemsCount"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  newSaleBtn: document.getElementById("newSaleBtn"),
  toast: document.getElementById("toast"),
  clock: document.getElementById("clock"),
  orderId: document.getElementById("orderId"),
  checkoutModal: document.getElementById("checkoutModal"),
  modalTotal: document.getElementById("modalTotal"),
  payMethod: document.getElementById("payMethod"),
  sendNote: document.getElementById("sendNote"),
  noteFields: document.getElementById("noteFields"),
  sendVia: document.getElementById("sendVia"),
  waField: document.getElementById("waField"),
  emailField: document.getElementById("emailField"),
  noteWhatsapp: document.getElementById("noteWhatsapp"),
  noteEmail: document.getElementById("noteEmail"),
  cancelCheckout: document.getElementById("cancelCheckout"),
  confirmCheckout: document.getElementById("confirmCheckout"),
};

function openModal() {
  if (!els.checkoutModal) return;
  els.modalTotal.textContent = mxn.format(cartTotal());
  els.checkoutModal.style.display = "flex";
}

function setFocus(which) {
  if (!els.app) return;
  els.app.setAttribute("data-focus", which);
}

function closeModal() {
  if (!els.checkoutModal) return;
  els.checkoutModal.style.display = "none";
}

function setNoteEnabled(enabled) {
  if (!els.noteFields) return;
  els.noteFields.style.display = enabled ? "grid" : "none";
  if (!enabled) {
    if (els.sendVia) els.sendVia.value = "whatsapp";
    els.noteWhatsapp.value = "";
    els.noteEmail.value = "";
  }
}

function setSendVia(via) {
  if (!els.waField || !els.emailField) return;
  const v = via || "whatsapp";
  els.waField.style.display = v === "whatsapp" ? "grid" : "none";
  els.emailField.style.display = v === "correo" ? "grid" : "none";
}

function categories() {
  const set = new Set(state.products.map((p) => p.category));
  return ["Todos", ...Array.from(set)];
}

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function filteredProducts() {
  const q = normalize(state.query);
  return state.products
    .filter((p) => state.activeCategory === "Todos" || p.category === state.activeCategory)
    .filter((p) => {
      if (!q) return true;
      return normalize(p.name).includes(q) || normalize(p.category).includes(q) || normalize(p.desc).includes(q);
    });
}

function cartTotal() {
  let t = 0;
  for (const [, line] of state.cart.entries()) t += line.price * line.qty;
  return t;
}

function ticketText(orderId, method) {
  const now = new Date();
  const dt = now.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const lines = [];
  lines.push(`Podium.hs · Nota de consumo`);
  lines.push(dt);
  lines.push(`Compra #${orderId}`);
  lines.push(`Cobro (ref): ${method}`);
  lines.push("");
  for (const [, line] of state.cart.entries()) {
    lines.push(`${line.qty} x ${line.name} — ${mxn.format(line.price * line.qty)}`);
  }
  lines.push("");
  lines.push(`TOTAL: ${mxn.format(cartTotal())}`);
  return lines.join("\n");
}

function openWhatsapp(msisdn, message) {
  const clean = (msisdn || "").replace(/\D+/g, "");
  if (!clean) return false;
  const url = `https://wa.me/52${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  return true;
}

function openMailTo(email, subject, body) {
  const e = (email || "").trim();
  if (!e) return false;
  const url = `mailto:${encodeURIComponent(e)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  return true;
}

async function shareTicket(message) {
  if (navigator.share) {
    try {
      await navigator.share({ text: message });
      return true;
    } catch {
      // ignore
    }
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(message);
      showToast("Ticket copiado. Pégalo en WhatsApp/Correo");
      return true;
    } catch {
      // ignore
    }
  }
  return false;
}

function downloadTextFile(filename, text) {
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

function loadSales() {
  try {
    const raw = localStorage.getItem(STORAGE_SALES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSales(list) {
  localStorage.setItem(STORAGE_SALES, JSON.stringify(list));
}

function cartCount() {
  let c = 0;
  for (const [, line] of state.cart.entries()) c += line.qty;
  return c;
}

let toastTimer = null;
function showToast(msg) {
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.style.display = "block";
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    els.toast.style.display = "none";
  }, 1600);
}

function setCategory(cat) {
  state.activeCategory = cat;
  renderCategories();
  renderProducts();
}

function addToCart(productId) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) return;
  const existing = state.cart.get(productId);
  if (existing) existing.qty += 1;
  else state.cart.set(productId, { id: p.id, name: p.name, price: p.price, qty: 1 });
  renderCart();
  showToast(`Agregado: ${p.name}`);
}

function decCart(productId) {
  const existing = state.cart.get(productId);
  if (!existing) return;
  existing.qty -= 1;
  if (existing.qty <= 0) state.cart.delete(productId);
  renderCart();
}

function incCart(productId) {
  const existing = state.cart.get(productId);
  if (!existing) return;
  existing.qty += 1;
  renderCart();
}

function removeCart(productId) {
  state.cart.delete(productId);
  renderCart();
}

function newSale() {
  state.cart.clear();
  state.orderSeq += 1;
  renderCart();
  renderOrderId();
  showToast("Nueva venta lista");
}

function checkout() {
  if (state.cart.size === 0) {
    showToast("Agrega productos para registrar");
    return;
  }
  openModal();
}

function confirmCheckout() {
  const total = cartTotal();
  const method = els.payMethod?.value || "Efectivo";
  const wantsNote = Boolean(els.sendNote?.checked);
  const via = els.sendVia?.value || "whatsapp";
  const wa = (els.noteWhatsapp?.value || "").trim();
  const em = (els.noteEmail?.value || "").trim();
  const ref = state.orderSeq;
  const ticket = ticketText(ref, method);

  const items = [];
  for (const [, line] of state.cart.entries()) {
    items.push({ name: line.name, qty: line.qty, price: line.price });
  }

  const sales = loadSales();
  sales.push({
    orderId: ref,
    createdAt: new Date().toISOString(),
    method,
    total,
    items,
    ticketVia: wantsNote ? via : "none",
  });
  saveSales(sales);

  state.cart.clear();
  state.orderSeq += 1;
  renderCart();
  renderOrderId();

  closeModal();
  setNoteEnabled(false);
  if (els.sendNote) els.sendNote.checked = false;

  if (wantsNote) {
    if (via === "whatsapp") {
      if (wa) openWhatsapp(wa, ticket);
      else showToast("Falta WhatsApp para enviar ticket");
    }
    if (via === "correo") {
      if (em) openMailTo(em, `Compra #${ref}`, ticket);
      else showToast("Falta correo para enviar ticket");
    }
    if (via === "airdrop_bt") {
      void shareTicket(ticket);
      downloadTextFile(`podium_compra_${ref}.txt`, ticket);
    }
  }

  const notePart = wantsNote
    ? ` · Ticket: ${via === "whatsapp" ? "WhatsApp" : via === "correo" ? "Correo" : "Airdrop/BT"}`
    : "";
  showToast(`Venta registrada · ${mxn.format(total)} · ${method}${notePart}`);
}

function renderCategories() {
  const cats = categories();
  els.categoryChips.innerHTML = "";
  for (const cat of cats) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "categoryBtn";
    b.setAttribute("aria-pressed", String(cat === state.activeCategory));
    b.addEventListener("click", () => setCategory(cat));

    const label = document.createElement("div");
    label.textContent = cat;

    const count = document.createElement("span");
    const n = cat === "Todos" ? state.products.length : state.products.filter((p) => p.category === cat).length;
    count.textContent = String(n);

    b.appendChild(label);
    b.appendChild(count);
    els.categoryChips.appendChild(b);
  }
}

function renderProducts() {
  const ps = filteredProducts();
  els.productGrid.innerHTML = "";
  for (const p of ps) {
    const el = document.createElement("div");
    el.className = "card";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Agregar ${p.name}`);
    el.addEventListener("click", () => addToCart(p.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        addToCart(p.id);
      }
    });

    const title = document.createElement("strong");
    title.textContent = p.name;
    const desc = document.createElement("span");
    desc.textContent = p.desc;
    const meta = document.createElement("div");
    meta.className = "metaRow";

    const cat = document.createElement("span");
    cat.className = "catLabel";
    cat.textContent = p.category;
    const price = document.createElement("div");
    price.className = "price";
    price.textContent = mxn.format(p.price);

    meta.appendChild(cat);
    meta.appendChild(price);

    el.appendChild(title);
    el.appendChild(desc);
    el.appendChild(meta);
    els.productGrid.appendChild(el);
  }
}

function renderCart() {
  els.cartItems.innerHTML = "";
  for (const [id, line] of state.cart.entries()) {
    const wrap = document.createElement("div");
    wrap.className = "lineItem";

    const top = document.createElement("div");
    top.className = "lineTop";
    const name = document.createElement("strong");
    name.textContent = line.name;
    const subtotal = document.createElement("div");
    subtotal.className = "price";
    subtotal.textContent = mxn.format(line.price * line.qty);
    top.appendChild(name);
    top.appendChild(subtotal);

    const qtyRow = document.createElement("div");
    qtyRow.className = "qtyRow";
    const controls = document.createElement("div");
    controls.className = "qtyControls";

    const dec = document.createElement("button");
    dec.type = "button";
    dec.className = "iconBtn";
    dec.textContent = "−";
    dec.addEventListener("click", () => decCart(id));

    const qty = document.createElement("div");
    qty.className = "qty";
    qty.textContent = String(line.qty);

    const inc = document.createElement("button");
    inc.type = "button";
    inc.className = "iconBtn";
    inc.textContent = "+";
    inc.addEventListener("click", () => incCart(id));

    controls.appendChild(dec);
    controls.appendChild(qty);
    controls.appendChild(inc);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "Quitar";
    remove.addEventListener("click", () => removeCart(id));

    qtyRow.appendChild(controls);
    qtyRow.appendChild(remove);

    wrap.appendChild(top);
    wrap.appendChild(qtyRow);
    els.cartItems.appendChild(wrap);
  }

  els.total.textContent = mxn.format(cartTotal());
  const c = cartCount();
  els.itemsCount.textContent = `${c} ${c === 1 ? "artículo" : "artículos"}`;
}

function renderOrderId() {
  els.orderId.textContent = `#${state.orderSeq}`;
}

function tickClock() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  els.clock.textContent = `${hh}:${mm}`;
}

function bind() {
  els.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderProducts();
  });
  els.clearBtn.addEventListener("click", () => {
    state.query = "";
    els.searchInput.value = "";
    renderProducts();
  });
  els.newSaleBtn.addEventListener("click", newSale);
  els.checkoutBtn.addEventListener("click", checkout);

  if (els.panelCats) {
    els.panelCats.addEventListener("click", () => setFocus("cats"));
  }
  if (els.panelProducts) {
    els.panelProducts.addEventListener("click", () => setFocus("products"));
  }
  if (els.panelCart) {
    els.panelCart.addEventListener("click", () => setFocus("cart"));
  }

  if (els.sendNote) {
    els.sendNote.addEventListener("change", (e) => setNoteEnabled(Boolean(e.target.checked)));
  }
  if (els.sendVia) {
    els.sendVia.addEventListener("change", (e) => setSendVia(e.target.value));
  }
  if (els.cancelCheckout) {
    els.cancelCheckout.addEventListener("click", () => {
      closeModal();
      setNoteEnabled(false);
      if (els.sendNote) els.sendNote.checked = false;
    });
  }
  if (els.checkoutModal) {
    els.checkoutModal.addEventListener("click", (e) => {
      if (e.target === els.checkoutModal) {
        closeModal();
        setNoteEnabled(false);
        if (els.sendNote) els.sendNote.checked = false;
      }
    });
  }
  if (els.confirmCheckout) {
    els.confirmCheckout.addEventListener("click", confirmCheckout);
  }

  if (els.logout) {
    els.logout.addEventListener("click", (e) => {
      e.preventDefault();
      try { localStorage.removeItem("podium_session_v1"); } catch {}
      window.location.href = "./auth.html";
    });
  }

  window.addEventListener("keydown", (e) => {
    if (!els.checkoutModal) return;
    if (els.checkoutModal.style.display === "flex" && e.key === "Escape") {
      closeModal();
      setNoteEnabled(false);
      if (els.sendNote) els.sendNote.checked = false;
    }
  });
}

function init() {
  const s = getSession();
  const role = s?.role;
  if (!role || !["caja", "admin", "supervisor"].includes(role)) {
    window.location.href = "./auth.html";
    return;
  }
  if (role === "caja" && els.adminLink) {
    els.adminLink.style.display = "none";
  }
  bind();
  renderCategories();
  renderProducts();
  renderCart();
  renderOrderId();
  tickClock();
  window.setInterval(tickClock, 1000);
  setSendVia(els.sendVia?.value || "whatsapp");
  setFocus(els.app?.getAttribute("data-focus") || "products");
  try {
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(state.products));
  } catch {
    // ignore
  }
}

init();
