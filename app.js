const STORAGE_KEY = "billing-sheet-state-v5";
const DEFAULT_ROWS = 7;
const FALLBACK_PRODUCTS = [
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
  "KOREA 12FT",
  "KOREA 15FT",
  "KOREA 16FT",
  "KOREA 18FT",
  "KOREA 20FT",
  "KOREA 24FT",
  "KOREA 30FT",
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
loadProductsFromSourceFile();

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
    productCatalog: [],
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) {
      return defaults;
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
    return defaults;
  }
}

function normalizeSlip(rawSlip = {}) {
  const slip = createSlip();
  return {
    ...slip,
    ...rawSlip,
    pendingAmount: rawSlip.pendingAmount || "",
    rows: Array.from({ length: DEFAULT_ROWS }, (_, index) => {
      const rawRow = rawSlip.rows?.[index] || {};
      return {
        ...slip.rows[index],
        ...rawRow,
        product: rawRow.product || buildLegacyProduct(rawRow),
        bundle: rawRow.bundle || rawRow.bundi || "",
        amountMode: rawRow.amountMode || (rawRow.amount ? "manual" : "auto"),
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
    pendingAmount: "",
    rows: Array.from({ length: DEFAULT_ROWS }, () => ({
      product: "",
      bundle: "",
      pcs: "",
      weight: "",
      rate: "",
      amount: "",
      amountMode: "auto",
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

function refreshProductCatalog(noteProducts = []) {
  state.productCatalog = mergeProducts(noteProducts.length ? noteProducts : FALLBACK_PRODUCTS, state.customProducts);
}

async function loadProductsFromSourceFile() {
  try {
    const response = await fetch("updated_names.txt", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const sourceText = await response.text();
    const sourceProducts = parseProductList(sourceText);
    if (!sourceProducts.length) {
      return;
    }

    refreshProductCatalog(sourceProducts);
    renderProductCatalog();
  } catch {
    // Opening index.html directly from disk may block fetch; fallback list stays usable.
  }
}

function parseProductList(text) {
  return mergeProducts([], text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.toUpperCase() === "CATEGORY\tITEM NAME") {
        return "";
      }

      const parts = trimmed.split(/\t+/).map((part) => part.trim()).filter(Boolean);
      if (parts.length < 2) {
        return normalizeProductName(trimmed);
      }

      const [category, ...itemParts] = parts;
      const itemName = itemParts.join(" ");
      if (!itemName) {
        return normalizeProductName(category);
      }

      const normalizedCategory = normalizeCategoryName(category);
      const normalizedItem = normalizeProductName(itemName);
      return combineCategoryAndItem(normalizedCategory, normalizedItem);
    })
    .filter(Boolean));
}

function commit({ fullRender = true, refreshProducts = false } = {}) {
  if (refreshProducts) {
    refreshProductCatalog(state.productCatalog);
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
    const title = fragment.querySelector("h3");
    const removeButton = fragment.querySelector(".remove-button");
    const rowContainer = fragment.querySelector(".editor-rows");
    const pendingAmountInput = fragment.querySelector('[data-field="pendingAmount"]');
    const grandTotalInput = fragment.querySelector("[data-grand-total]");

    fragment.querySelector(".slip-index").textContent = `Sheet ${slipIndex + 1}`;
    title.textContent = slip.customerName || "Untitled bill";

    bindMetaField(fragment, slip, "customerName", () => {
      title.textContent = slip.customerName || "Untitled bill";
    });
    bindMetaField(fragment, slip, "date");
    bindMetaField(fragment, slip, "dcNumber");
    bindMetaField(fragment, slip, "gaddiNumber");
    bindMetaField(fragment, slip, "pendingAmount", () => {
      updateGrandTotalInput(slip, grandTotalInput);
    });

    slip.rows.forEach((row, rowIndex) => {
      const rowFragment = elements.editorRowTemplate.content.cloneNode(true);
      const rowElement = rowFragment.querySelector("tr");
      const inputs = getRowInputs(rowElement);
      rowFragment.querySelector(".row-number").textContent = String(rowIndex + 1);

      Object.entries(inputs).forEach(([field, input]) => {
        input.value = row[field] || "";
        input.addEventListener("input", (event) => {
          handleRowInput(row, field, event.target.value, inputs, grandTotalInput, slip);
        });
        input.addEventListener("change", (event) => {
          handleRowChange(row, field, event.target.value, inputs, grandTotalInput, slip);
        });
      });

      syncRowCalculation(row, inputs);
      rowContainer.appendChild(rowFragment);
    });

    pendingAmountInput.value = slip.pendingAmount || "";
    updateGrandTotalInput(slip, grandTotalInput);

    removeButton.addEventListener("click", () => {
      state.slips = state.slips.filter((item) => item.id !== slip.id);
      if (!state.slips.length) {
        state.slips.push(createSlip());
      }
      commit();
    });

    elements.slipEditors.appendChild(fragment);
  });
}

function getRowInputs(rowElement) {
  const inputs = {};
  rowElement.querySelectorAll("[data-row-field]").forEach((input) => {
    inputs[input.dataset.rowField] = input;
  });
  return inputs;
}

function handleRowInput(row, field, value, inputs, grandTotalInput, slip) {
  row[field] = value;

  if (field === "amount") {
    row.amountMode = value.trim() ? "manual" : "auto";
  }

  if (field !== "amount") {
    syncRowCalculation(row, inputs);
  } else if (row.amountMode === "auto") {
    syncRowCalculation(row, inputs);
  }

  updateGrandTotalInput(slip, grandTotalInput);
  commit({ fullRender: false });
}

function handleRowChange(row, field, value, inputs, grandTotalInput, slip) {
  row[field] = field === "product" ? normalizeProductName(value) : value;
  inputs[field].value = row[field];

  if (field === "amount") {
    row.amountMode = row.amount.trim() ? "manual" : "auto";
  }

  syncRowCalculation(row, inputs);
  updateGrandTotalInput(slip, grandTotalInput);
  commit({ fullRender: false });
}

function syncRowCalculation(row, inputs) {
  const calculationMode = getCalculationMode(row.product);
  const usesWeight = calculationMode === "kg";

  inputs.weight.readOnly = !usesWeight;
  inputs.pcs.readOnly = false;
  inputs.weight.classList.toggle("inactive-field", !usesWeight);
  inputs.pcs.classList.remove("inactive-field");
  inputs.weight.placeholder = usesWeight ? "Weight" : "Not used";
  inputs.pcs.placeholder = "PCS";
  inputs.amount.placeholder = usesWeight ? "Weight x rate" : "PCS x rate";

  if (row.amountMode !== "manual") {
    const autoAmount = calculateRowAmount(row);
    row.amount = autoAmount.display;
    inputs.amount.value = row.amount;
  }
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
    const mode = getCalculationMode(row.product);
    const rowElement = document.createElement("tr");
    rowElement.innerHTML = `
      <td>${index + 1}</td>
      <td class="text-left">${escapeHtml(row.product || " ")}</td>
      <td>${escapeHtml(row.bundle || " ")}</td>
      <td>${escapeHtml(row.pcs || " ")}</td>
      <td>${escapeHtml(mode === "kg" ? row.weight || " " : " ")}</td>
      <td>${escapeHtml(row.rate || " ")}</td>
      <td>${escapeHtml(getRowAmountDisplay(row) || " ")}</td>
    `;
    body.appendChild(rowElement);
  });

  const footer = document.createElement("div");
  footer.className = "bill-footer";
  footer.innerHTML = `
    <div class="bill-footer-cell">
      <div><strong>PENDING AMOUNT</strong> ${escapeHtml(slip.pendingAmount || " ")}</div>
      <div><strong>GT</strong> ${escapeHtml(getGrandTotalDisplay(slip) || " ")}</div>
      <div><strong>GADDI NUMBER</strong> ${escapeHtml(slip.gaddiNumber || " ")}</div>
    </div>
    <div class="bill-footer-cell signature">${escapeHtml(state.settings.signatureLabel || " ")}</div>
  `;

  article.append(titleRow, meta, table, footer);
  return article;
}

function updateGrandTotalInput(slip, input) {
  input.value = getGrandTotalDisplay(slip);
}

function getGrandTotalDisplay(slip) {
  const rowTotal = slip.rows.reduce((sum, row) => {
    const amount = toNumber(getRowAmountDisplay(row));
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);
  const pendingAmount = toNumber(slip.pendingAmount);
  const total = rowTotal + (Number.isFinite(pendingAmount) ? pendingAmount : 0);
  const hasPendingAmount = String(slip.pendingAmount || "").trim() !== "";

  if (!Number.isFinite(total) || total === 0) {
    const hasAnyAmount = slip.rows.some((row) => getRowAmountDisplay(row)) || hasPendingAmount;
    return hasAnyAmount ? "0" : "";
  }

  return formatDisplayNumber(total);
}

function getRowAmountDisplay(row) {
  if (row.amount && row.amount.trim()) {
    return row.amount.trim();
  }

  return calculateRowAmount(row).display;
}

function calculateRowAmount(row) {
  const rate = toNumber(row.rate);
  const quantityField = getCalculationMode(row.product) === "kg" ? row.weight : row.pcs;
  const quantity = toNumber(quantityField);

  if (!Number.isFinite(rate) || !Number.isFinite(quantity)) {
    return { value: Number.NaN, display: "" };
  }

  const value = rate * quantity;
  return {
    value,
    display: formatDisplayNumber(value),
  };
}

function getCalculationMode(productName) {
  const product = normalizeProductName(productName);

  if (
    /^T[BYWG]\b/.test(product) ||
    product.includes("TADPATRI") ||
    product.includes("KOREA") ||
    /^LD\b/.test(product) ||
    product.includes("BALER TWINE") ||
    product.includes("PP SUTLI") ||
    product.includes("SUTLI") ||
    product.includes("TAKIYA")
  ) {
    return "kg";
  }

  return "pcs";
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

function normalizeCategoryName(value) {
  return normalizeProductName(value);
}

function combineCategoryAndItem(category, item) {
  if (!category) {
    return item;
  }

  if (!item) {
    return category;
  }

  if (item === category || item.startsWith(`${category} `)) {
    return item;
  }

  // TY/TB/TW/TG items already describe the Tadpatri family clearly.
  if (category === "TADPATRI" && (/^T[BYWG]\b/.test(item) || item.includes("TADPATRI"))) {
    return item;
  }

  // Avoid repeating obvious family names when the item already carries them.
  if (category === "PANNI" && item.startsWith("PANNI ")) {
    return item;
  }

  if (category === "KOREA" && item.startsWith("KOREA ")) {
    return item;
  }

  return normalizeProductName(`${category} ${item}`);
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

  normalized = normalized.replace(/\bTADPADTRI\b/g, "TADPATRI");
  normalized = normalized.replace(/\bBARLE TWIN SUTLI\b/g, "BALER TWINE SUTLI");
  normalized = normalized.replace(/^([A-Z]{2})(\d)/, "$1 $2");
  normalized = normalized.replace(/^TB(?:\s+TADPATRI BLACK)?\b/, "TB TADPATRI BLACK");
  normalized = normalized.replace(/^TY(?:\s+TADPATRI YELLOW)?\b/, "TY TADPATRI YELLOW");

  return normalized;
}

function toNumber(value) {
  if (value === null || value === undefined) {
    return Number.NaN;
  }

  const normalized = String(value).replace(/[^0-9.-]/g, "");
  return Number.parseFloat(normalized);
}

function formatDisplayNumber(value) {
  if (!Number.isFinite(value)) {
    return "";
  }

  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 0.00001) {
    return String(Math.round(rounded));
  }

  return rounded.toFixed(2).replace(/\.?0+$/, "");
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
