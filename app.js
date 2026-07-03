const STORAGE_KEY = "billing-sheet-state-v4";
const DEFAULT_ROWS = 7;
const DEFAULT_PRODUCTS = [
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 12x15",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 12x18",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 15x18",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 15x30",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 18x24",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 18x30",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 24x30",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 30x30",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 12x9",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 12x15",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 12x18",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 15x18",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 15x24",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 15x30",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 18x24",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 18x30",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 21x30",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 24x30",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 30x30",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 30x40",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 30x50",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 40x40",
  "TY TADPATRI YELLOW 120 GSM RAJ GOLD 60x60",
  "TW 120 GSM RAJ GOLD 24x18",
  "TW 120 GSM RAJ GOLD 12x15",
  "TW 120 GSM RAJ GOLD 12x18",
  "TW 120 GSM RAJ GOLD 15x18",
  "TW 120 GSM RAJ GOLD 18x30",
  "TW 120 GSM RAJ GOLD 30x24",
  "TW 120 GSM RAJ GOLD 30x40",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 9x12",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 12x15",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 12x18",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 15x18",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 15x24",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 15x30",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 18x24",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 18x30",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 30x21",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 30x24",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 30x30",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 30x40",
  "TB TADPATRI BLACK 170 GSM 24 CARAT 30x50",
  "TG 200 GSM RAJ GOLD 18x24",
  "TG 200 GSM RAJ GOLD 30x18",
  "TG 200 GSM RAJ GOLD 30x24",
  "TG 200 GSM RAJ GOLD 30x40",
  "TG 200 GSM RAJ GOLD 36x18",
  "TG 200 GSM RAJ GOLD 36x24",
  "PANNI 12FT",
  "PANNI 14FT",
  "PANNI 15FT",
  "PANNI 20FT",
  "PANNI 24FT",
  "9x15",
  "10x16",
  "11x16",
  "11x15",
  "11x20",
  "12x15",
  "12x20",
  "12x24",
  "12x30",
  "12x40",
  "15x18",
  "15x24",
  "18x24",
  "18x25",
  "18x30",
  "20x30",
  "20x32",
  "RAJ GOLD 12x3",
  "RAJ GOLD 12x4",
  "RAJ GOLD 15x2.5",
  "RAJ GOLD 18x2",
  "RAJ GOLD 24x1.5",
  "KALASH 12x4.5",
  "KALASH 18x3",
  "KALASH 18x3 BLUE",
  "KALASH 12x4.5 BLUE",
  "KOREA 12FT",
  "KOREA 15FT",
  "KOREA 16FT",
  "KOREA 18FT",
  "KOREA 20FT",
  "KOREA 24FT",
  "VEER BLACK",
  "KOREA 30FT",
  "TB TADPATRI BLACK 200 GSM RAJ GOLD 24x18",
  "TB TADPATRI BLACK 200 GSM RAJ GOLD 30x24",
  "TB TADPATRI BLACK 200 GSM RAJ GOLD 30x40",
  "TB TADPATRI BLACK 200 GSM RAJ GOLD 30x36",
  "TB TADPATRI BLACK 200 GSM RAJ GOLD 36x24",
  "TY TADPATRI YELLOW 170 GSM RAJ GOLD 12x9",
  "LD 12X2",
  "LD 12X3",
  "LD 12X5",
  "LD 18X0.75",
  "LD 18X1",
  "LD 18X2",
  "LD 18X3",
  "LD 24X1",
  "LD 24X0.75",
];

const state = loadState();

const elements = {
  addSlip: document.querySelector("#add-slip"),
  duplicateSlip: document.querySelector("#duplicate-slip"),
  togglePreview: document.querySelector("#toggle-preview"),
  printSheet: document.querySelector("#print-sheet"),
  resetData: document.querySelector("#reset-data"),
  addProduct: document.querySelector("#add-product"),
  newProductName: document.querySelector("#new-product-name"),
  productCount: document.querySelector("#product-count"),
  productOptions: document.querySelector("#product-options"),
  shopLabel: document.querySelector("#shop-label"),
  brandLabel: document.querySelector("#brand-label"),
  signatureLabel: document.querySelector("#signature-label"),
  slipsPerPage: document.querySelector("#slips-per-page"),
  slipEditors: document.querySelector("#slip-editors"),
  previewPages: document.querySelector("#preview-pages"),
  previewSummary: document.querySelector("#preview-summary"),
  slipEditorTemplate: document.querySelector("#slip-editor-template"),
  editorRowTemplate: document.querySelector("#editor-row-template"),
};

document.body.classList.add("preview-hidden");
refreshProductCatalog();
wireTopLevelEvents();
render();

function loadState() {
  const defaults = {
    settings: {
      shopLabel: "ताडपत्री",
      brandLabel: "||| SHREE |||",
      signatureLabel: "JAYESH",
      slipsPerPage: 4,
    },
    customProducts: [],
    slips: [createSlip()],
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) {
      return { ...defaults, productCatalog: [] };
    }

    return {
      settings: {
        ...defaults.settings,
        ...saved.settings,
      },
      customProducts: Array.isArray(saved.customProducts)
        ? saved.customProducts.map(normalizeProductName).filter(Boolean)
        : [],
      slips: Array.isArray(saved.slips) && saved.slips.length
        ? saved.slips.map(normalizeSlip)
        : defaults.slips,
      productCatalog: [],
    };
  } catch {
    return { ...defaults, productCatalog: [] };
  }
}

function normalizeSlip(rawSlip = {}) {
  const slip = createSlip();
  return {
    ...slip,
    ...rawSlip,
    total: rawSlip.total || "",
    rows: Array.from({ length: DEFAULT_ROWS }, (_, index) => {
      const rawRow = rawSlip.rows?.[index] || {};
      return {
        ...slip.rows[index],
        ...rawRow,
        product: rawRow.product || buildLegacyProduct(rawRow),
        bundle: rawRow.bundle || rawRow.bundi || "",
      };
    }),
  };
}

function buildLegacyProduct(row = {}) {
  const legacyParts = [row.color, row.gsm, row.size]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  return legacyParts.length ? normalizeProductName(legacyParts.join(" ")) : "";
}

function createSlip() {
  return {
    id: `slip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    customerName: "",
    date: "",
    dcNumber: "",
    gaddiNumber: "",
    total: "",
    rows: Array.from({ length: DEFAULT_ROWS }, () => ({
      product: "",
      bundle: "",
      pcs: "",
      weight: "",
      rate: "",
      amount: "",
    })),
  };
}

function wireTopLevelEvents() {
  elements.addSlip.addEventListener("click", () => {
    state.slips.push(createSlip());
    commit();
  });

  elements.duplicateSlip.addEventListener("click", () => {
    const lastSlip = state.slips[state.slips.length - 1];
    const duplicate = lastSlip
      ? normalizeSlip(JSON.parse(JSON.stringify(lastSlip)))
      : createSlip();
    duplicate.id = createSlip().id;
    state.slips.push(duplicate);
    commit();
  });

  elements.printSheet.addEventListener("click", () => {
    window.print();
  });

  elements.togglePreview.addEventListener("click", () => {
    document.body.classList.toggle("preview-hidden");
    syncPreviewToggleLabel();
  });

  elements.resetData.addEventListener("click", () => {
    const confirmed = window.confirm("Clear the current bills? Saved products will stay.");
    if (!confirmed) {
      return;
    }

    state.slips = [createSlip()];
    commit();
  });

  elements.addProduct.addEventListener("click", addProductFromManager);
  elements.newProductName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addProductFromManager();
    }
  });

  elements.shopLabel.addEventListener("input", (event) => {
    state.settings.shopLabel = event.target.value;
    commit({ fullRender: false });
  });

  elements.brandLabel.addEventListener("input", (event) => {
    state.settings.brandLabel = event.target.value;
    commit({ fullRender: false });
  });

  elements.signatureLabel.addEventListener("input", (event) => {
    state.settings.signatureLabel = event.target.value;
    commit({ fullRender: false });
  });

  elements.slipsPerPage.addEventListener("change", (event) => {
    state.settings.slipsPerPage = Number(event.target.value) || 4;
    commit({ fullRender: false });
  });
}

function addProductFromManager() {
  const productName = normalizeProductName(elements.newProductName.value);
  if (!productName) {
    return;
  }

  state.customProducts = mergeProducts(state.customProducts, [productName]);
  elements.newProductName.value = "";
  commit({ fullRender: false, refreshProducts: true });
  elements.newProductName.focus();
}

function refreshProductCatalog() {
  state.productCatalog = mergeProducts(DEFAULT_PRODUCTS, state.customProducts);
}

function commit({ fullRender = true, refreshProducts = false } = {}) {
  if (refreshProducts) {
    refreshProductCatalog();
  }

  persistState();

  if (fullRender) {
    render();
    return;
  }

  if (refreshProducts) {
    renderProductCatalog();
  }

  renderPreview();
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    settings: state.settings,
    customProducts: state.customProducts,
    slips: state.slips,
  }));
}

function render() {
  elements.shopLabel.value = state.settings.shopLabel;
  elements.brandLabel.value = state.settings.brandLabel;
  elements.signatureLabel.value = state.settings.signatureLabel;
  elements.slipsPerPage.value = String(state.settings.slipsPerPage);

  renderProductCatalog();
  renderEditors();
  renderPreview();
  syncPreviewToggleLabel();
}

function renderProductCatalog() {
  elements.productCount.textContent = `${state.productCatalog.length} products ready`;
  elements.productOptions.innerHTML = "";

  const fragment = document.createDocumentFragment();
  state.productCatalog.forEach((product) => {
    const option = document.createElement("option");
    option.value = product;
    fragment.appendChild(option);
  });
  elements.productOptions.appendChild(fragment);
}

function renderEditors() {
  elements.slipEditors.innerHTML = "";

  state.slips.forEach((slip, slipIndex) => {
    const fragment = elements.slipEditorTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".slip-editor-card");
    const indexLabel = fragment.querySelector(".slip-index");
    const title = fragment.querySelector("h3");
    const removeButton = fragment.querySelector(".remove-button");
    const rowContainer = fragment.querySelector(".editor-rows");

    indexLabel.textContent = `Sheet ${slipIndex + 1}`;
    title.textContent = slip.customerName || "Untitled bill";

    bindMetaField(fragment, slip, "customerName", () => {
      title.textContent = slip.customerName || "Untitled bill";
    });
    bindMetaField(fragment, slip, "date");
    bindMetaField(fragment, slip, "dcNumber");
    bindMetaField(fragment, slip, "gaddiNumber");
    bindMetaField(fragment, slip, "total");

    slip.rows.forEach((row, rowIndex) => {
      const rowFragment = elements.editorRowTemplate.content.cloneNode(true);
      const rowElement = rowFragment.querySelector("tr");
      rowFragment.querySelector(".row-number").textContent = String(rowIndex + 1);

      rowElement.querySelectorAll("[data-row-field]").forEach((input) => {
        const field = input.dataset.rowField;
        input.value = row[field] || "";
        input.addEventListener("change", (event) => {
          row[field] = field === "product"
            ? normalizeProductName(event.target.value)
            : event.target.value;
          event.target.value = row[field];
          commit({ fullRender: false });
        });
        input.addEventListener("input", (event) => {
          row[field] = event.target.value;
          commit({ fullRender: false });
        });
      });

      rowContainer.appendChild(rowFragment);
    });

    removeButton.addEventListener("click", () => {
      state.slips = state.slips.filter((item) => item.id !== slip.id);
      if (!state.slips.length) {
        state.slips.push(createSlip());
      }
      commit();
    });

    card.dataset.slipId = slip.id;
    elements.slipEditors.appendChild(fragment);
  });
}

function bindMetaField(fragment, slip, fieldName, afterChange) {
  const input = fragment.querySelector(`[data-field="${fieldName}"]`);
  input.value = slip[fieldName] || "";
  input.addEventListener("input", (event) => {
    slip[fieldName] = event.target.value;
    afterChange?.();
    commit({ fullRender: false });
  });
}

function renderPreview() {
  elements.previewPages.innerHTML = "";

  if (!state.slips.length) {
    elements.previewSummary.textContent = "No bills yet";
    elements.previewPages.innerHTML = `<div class="empty-state">Add a bill to see the printable preview.</div>`;
    return;
  }

  const slipsPerPage = state.settings.slipsPerPage;
  const pages = chunk(state.slips, slipsPerPage);
  elements.previewSummary.textContent = `${state.slips.length} bill${state.slips.length === 1 ? "" : "s"} across ${pages.length} A4 page${pages.length === 1 ? "" : "s"}`;

  pages.forEach((pageSlips, pageIndex) => {
    const page = document.createElement("section");
    page.className = `a4-page density-${slipsPerPage}`;
    page.setAttribute("aria-label", `Print page ${pageIndex + 1}`);

    const pageGrid = document.createElement("div");
    pageGrid.className = "page-grid";

    if (pageSlips.length === 1) {
      pageGrid.classList.add("single-slip-grid");
    }

    pageSlips.forEach((slip) => {
      pageGrid.appendChild(buildSlipPreview(slip));
    });

    if (pageSlips.length > 1) {
      for (let fillerIndex = pageSlips.length; fillerIndex < slipsPerPage; fillerIndex += 1) {
        const filler = document.createElement("div");
        filler.className = "bill-slip";
        filler.style.visibility = "hidden";
        pageGrid.appendChild(filler);
      }
    }

    page.appendChild(pageGrid);
    elements.previewPages.appendChild(page);
  });
}

function buildSlipPreview(slip) {
  const article = document.createElement("article");
  article.className = "bill-slip";

  const titleRow = document.createElement("div");
  titleRow.className = "bill-title-row";
  titleRow.innerHTML = `
    <div class="left-title">${escapeHtml(state.settings.shopLabel || " ")}</div>
    <div class="center-title">${escapeHtml(state.settings.brandLabel || " ")}</div>
    <div class="right-title"><strong>DATE :-</strong> ${escapeHtml(slip.date || " ")}</div>
  `;

  const meta = document.createElement("div");
  meta.className = "bill-meta";
  meta.innerHTML = `
    <div class="bill-meta-cell">
      <span class="bill-meta-label">NAME :-</span>
      <span class="bill-meta-value">${escapeHtml(slip.customerName || " ")}</span>
    </div>
    <div class="bill-meta-cell">
      <span class="bill-meta-label">DC NO. :-</span>
      <span class="bill-meta-value">GD/001 ${escapeHtml(slip.dcNumber || " ")}</span>
    </div>
  `;

  const table = document.createElement("table");
  table.className = "bill-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th style="width: 6%;">SR</th>
        <th class="text-left" style="width: 40%;">PRODUCT</th>
        <th style="width: 10%;">BUNDLE</th>
        <th style="width: 9%;">PCS</th>
        <th style="width: 13%;">WEIGHT</th>
        <th style="width: 10%;">RATE</th>
        <th style="width: 12%;">AMOUNT</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const body = table.querySelector("tbody");
  slip.rows.forEach((row, index) => {
    const rowElement = document.createElement("tr");
    rowElement.innerHTML = `
      <td>${index + 1}</td>
      <td class="text-left">${escapeHtml(row.product || " ")}</td>
      <td>${escapeHtml(row.bundle || " ")}</td>
      <td>${escapeHtml(row.pcs || " ")}</td>
      <td>${escapeHtml(row.weight || " ")}</td>
      <td>${escapeHtml(row.rate || " ")}</td>
      <td>${escapeHtml(row.amount || " ")}</td>
    `;
    body.appendChild(rowElement);
  });

  const footer = document.createElement("div");
  footer.className = "bill-footer";
  footer.innerHTML = `
    <div class="bill-footer-cell">
      <strong>TOTAL</strong> ${escapeHtml(slip.total || " ")}
      <div><strong>GADDI NUMBER</strong> ${escapeHtml(slip.gaddiNumber || " ")}</div>
    </div>
    <div class="bill-footer-cell signature">${escapeHtml(state.settings.signatureLabel || " ")}</div>
  `;

  article.append(titleRow, meta, table, footer);
  return article;
}

function mergeProducts(existingProducts, newProducts) {
  const seen = new Set();
  const merged = [];

  [...existingProducts, ...newProducts].forEach((product) => {
    const normalized = normalizeProductName(product);
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    merged.push(normalized);
  });

  return merged;
}

function normalizeProductName(value) {
  if (value === null || value === undefined) {
    return "";
  }

  let normalized = String(value)
    .replace(/[•×]/g, "x")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  normalized = normalized.replace(/^([A-Z]{2})(\d)/, "$1 $2");
  normalized = normalized.replace(/^TB(?:\s+TADPATRI BLACK)?\b/, "TB TADPATRI BLACK");
  normalized = normalized.replace(/^TY(?:\s+TADPATRI YELLOW)?\b/, "TY TADPATRI YELLOW");

  return normalized;
}

function chunk(items, size) {
  const pages = [];
  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }
  return pages;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function syncPreviewToggleLabel() {
  const previewHidden = document.body.classList.contains("preview-hidden");
  elements.togglePreview.textContent = previewHidden ? "Show preview" : "Hide preview";
}
