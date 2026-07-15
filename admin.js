const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const STORAGE_SALES = "podium_demo_sales_v1";
const STORAGE_INV = "podium_demo_inventory_v1";
const STORAGE_RECIPES = "podium_demo_recipes_v1";
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

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProducts() {
  const fromStorage = loadJson(STORAGE_PRODUCTS, null);
  if (Array.isArray(fromStorage) && fromStorage.length) return fromStorage;
  return [];
}

function startOfWeek(d) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function inRange(sale, range) {
  if (range === "all") return true;
  const d = new Date(sale.createdAt);
  const now = new Date();

  if (range === "day") {
    return d.toDateString() === now.toDateString();
  }

  if (range === "week") {
    const a = startOfWeek(now);
    const b = new Date(a);
    b.setDate(b.getDate() + 7);
    return d >= a && d < b;
  }

  if (range === "month") {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }

  return true;
}

const els = {
  tabSales: document.getElementById("tabSales"),
  tabInventory: document.getElementById("tabInventory"),
  salesView: document.getElementById("salesView"),
  inventoryView: document.getElementById("inventoryView"),
  salesRange: document.getElementById("salesRange"),
  clearSales: document.getElementById("clearSales"),
  salesTable: document.getElementById("salesTable"),
  salesKpi: document.getElementById("salesKpi"),
  sumCount: document.getElementById("sumCount"),
  sumTotal: document.getElementById("sumTotal"),

  ingName: document.getElementById("ingName"),
  ingUnit: document.getElementById("ingUnit"),
  ingStock: document.getElementById("ingStock"),
  addIng: document.getElementById("addIng"),
  invTable: document.getElementById("invTable"),

  recipeProduct: document.getElementById("recipeProduct"),
  recipeIngredient: document.getElementById("recipeIngredient"),
  recipeQty: document.getElementById("recipeQty"),
  addRecipeLine: document.getElementById("addRecipeLine"),
  recipeTable: document.getElementById("recipeTable"),
};

function lockDown() {
  const disableIds = ["addIng", "addRecipeLine", "clearSales"]; 
  for (const id of disableIds) {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  }
  const fields = ["ingName", "ingUnit", "ingStock", "recipeProduct", "recipeIngredient", "recipeQty", "salesRange"]; 
  for (const id of fields) {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  }

  const toHide = document.querySelectorAll("button.btn.secondary");
  for (const b of toHide) {
    if (b.textContent === "Eliminar") b.style.display = "none";
  }
}

function hideSalesUI() {
  if (els.tabSales) els.tabSales.style.display = "none";
  if (els.salesView) els.salesView.style.display = "none";
  if (els.tabInventory) {
    els.tabInventory.setAttribute("aria-selected", "true");
  }
  if (els.inventoryView) els.inventoryView.style.display = "block";
}

function setTab(which) {
  const isSales = which === "sales";
  els.tabSales.setAttribute("aria-selected", String(isSales));
  els.tabInventory.setAttribute("aria-selected", String(!isSales));
  els.salesView.style.display = isSales ? "block" : "none";
  els.inventoryView.style.display = isSales ? "none" : "block";
}

function getSales() {
  return loadJson(STORAGE_SALES, []);
}

function renderSales() {
  const range = els.salesRange.value;
  const sales = getSales()
    .filter((s) => inRange(s, range))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  els.salesTable.innerHTML = "";
  let total = 0;

  for (const s of sales) {
    total += s.total || 0;
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.textContent = new Date(s.createdAt).toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const tdId = document.createElement("td");
    tdId.textContent = `#${s.orderId}`;

    const tdMethod = document.createElement("td");
    tdMethod.textContent = s.method || "—";

    const tdTicket = document.createElement("td");
    const via = s.ticketVia || "none";
    tdTicket.textContent =
      via === "whatsapp"
        ? "WhatsApp"
        : via === "correo"
          ? "Correo"
          : via === "airdrop_bt"
            ? "Airdrop/BT"
            : "Ninguno";

    const tdTotal = document.createElement("td");
    tdTotal.className = "money";
    tdTotal.textContent = mxn.format(s.total || 0);

    tr.appendChild(tdDate);
    tr.appendChild(tdId);
    tr.appendChild(tdMethod);
    tr.appendChild(tdTicket);
    tr.appendChild(tdTotal);

    els.salesTable.appendChild(tr);
  }

  els.sumCount.textContent = String(sales.length);
  els.sumTotal.textContent = mxn.format(total);
  els.salesKpi.textContent = `${sales.length} ventas`;
}

function clearDemoSales() {
  saveJson(STORAGE_SALES, []);
  renderSales();
}

function loadInv() {
  return loadJson(STORAGE_INV, []);
}

function saveInv(inv) {
  saveJson(STORAGE_INV, inv);
}

function loadRecipes() {
  return loadJson(STORAGE_RECIPES, []);
}

function saveRecipes(rec) {
  saveJson(STORAGE_RECIPES, rec);
}

function renderInv() {
  const inv = loadInv();
  els.invTable.innerHTML = "";

  for (const it of inv) {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = it.name;

    const tdUnit = document.createElement("td");
    tdUnit.textContent = it.unit;

    const tdStock = document.createElement("td");
    tdStock.textContent = String(it.stock);

    const tdAct = document.createElement("td");
    const del = document.createElement("button");
    del.className = "btn secondary";
    del.type = "button";
    del.textContent = "Eliminar";
    del.addEventListener("click", () => {
      saveInv(inv.filter((x) => x.id !== it.id));
      renderInv();
      renderRecipeSelects();
    });
    tdAct.appendChild(del);

    tr.appendChild(tdName);
    tr.appendChild(tdUnit);
    tr.appendChild(tdStock);
    tr.appendChild(tdAct);

    els.invTable.appendChild(tr);
  }
}

function addIngredient() {
  const name = (els.ingName.value || "").trim();
  const unit = els.ingUnit.value;
  const stock = Number(String(els.ingStock.value || "").replace(",", "."));

  if (!name) return;
  if (!Number.isFinite(stock)) return;

  const inv = loadInv();
  inv.push({ id: crypto.randomUUID(), name, unit, stock });
  saveInv(inv);

  els.ingName.value = "";
  els.ingStock.value = "";

  renderInv();
  renderRecipeSelects();
}

function renderRecipeSelects() {
  const inv = loadInv();
  els.recipeIngredient.innerHTML = "";
  for (const it of inv) {
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = `${it.name} (${it.unit})`;
    els.recipeIngredient.appendChild(opt);
  }

  const products = loadProducts();
  els.recipeProduct.innerHTML = "";
  for (const p of products) {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    els.recipeProduct.appendChild(opt);
  }
}

function renderRecipes() {
  const rec = loadRecipes();
  const inv = loadInv();
  const invById = new Map(inv.map((x) => [x.id, x]));

  els.recipeTable.innerHTML = "";
  for (const r of rec) {
    const tr = document.createElement("tr");

    const tdP = document.createElement("td");
    tdP.textContent = r.product;

    const tdI = document.createElement("td");
    const ing = invById.get(r.ingredientId);
    tdI.textContent = ing ? ing.name : "(ingrediente eliminado)";

    const tdQ = document.createElement("td");
    tdQ.textContent = String(r.qty);

    const tdA = document.createElement("td");
    const del = document.createElement("button");
    del.className = "btn secondary";
    del.type = "button";
    del.textContent = "Eliminar";
    del.addEventListener("click", () => {
      saveRecipes(rec.filter((x) => x.id !== r.id));
      renderRecipes();
    });
    tdA.appendChild(del);

    tr.appendChild(tdP);
    tr.appendChild(tdI);
    tr.appendChild(tdQ);
    tr.appendChild(tdA);

    els.recipeTable.appendChild(tr);
  }
}

function addRecipeLine() {
  const product = els.recipeProduct.value;
  const ingredientId = els.recipeIngredient.value;
  const qty = Number(String(els.recipeQty.value || "").replace(",", "."));

  if (!product || !ingredientId) return;
  if (!Number.isFinite(qty) || qty <= 0) return;

  const rec = loadRecipes();
  rec.push({ id: crypto.randomUUID(), product, ingredientId, qty });
  saveRecipes(rec);

  els.recipeQty.value = "";
  renderRecipes();
}

function bind() {
  els.tabSales.addEventListener("click", () => setTab("sales"));
  els.tabInventory.addEventListener("click", () => setTab("inventory"));
  els.salesRange.addEventListener("change", renderSales);
  els.clearSales.addEventListener("click", clearDemoSales);

  els.addIng.addEventListener("click", addIngredient);
  els.addRecipeLine.addEventListener("click", addRecipeLine);
}

function init() {
  const s = getSession();
  const role = s?.role;
  if (!role || !["admin", "inventario", "supervisor"].includes(role)) {
    window.location.href = "./auth.html";
    return;
  }

  bind();
  if (role === "inventario") {
    setTab("inventory");
    hideSalesUI();
    const recipes = document.getElementById("cardRecipes");
    if (recipes) recipes.style.display = "none";
    const caja = document.getElementById("tabCaja");
    if (caja) caja.style.display = "none";
  } else {
    setTab("sales");
  }

  if (role === "supervisor") {
    lockDown();
  }

  renderSales();
  renderInv();
  renderRecipeSelects();
  renderRecipes();
}

init();
