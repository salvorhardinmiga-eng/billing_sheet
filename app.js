const STORAGE_KEY = "billing-sheet-state-v2";
const DEFAULT_ROWS = 7;

const state = loadState();

const elements = {
  addSlip: document.querySelector("#add-slip"),
  duplicateSlip: document.querySelector("#duplicate-slip"),
  togglePreview: document.querySelector("#toggle-preview"),
  printSheet: document.querySelector("#print-sheet"),
  resetData: document.querySelector("#reset-data"),
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
    slips: [createSlip()],
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
      slips: Array.isArray(saved.slips) && saved.slips.length
        ? saved.slips.map(normalizeSlip)
        : defaults.slips,
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
    total: rawSlip.total || "",
    rows: Array.from({ length: DEFAULT_ROWS }, (_, index) => ({
      ...slip.rows[index],
      ...(rawSlip.rows?.[index] || {}),
      bundle: rawSlip.rows?.[index]?.bundle || rawSlip.rows?.[index]?.bundi || "",
    })),
  };
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
      color: "",
      gsm: "",
      size: "",
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
    if (!lastSlip) {
      state.slips.push(createSlip());
    } else {
      const duplicate = normalizeSlip(JSON.parse(JSON.stringify(lastSlip)));
      duplicate.id = createSlip().id;
      state.slips.push(duplicate);
    }
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
    const confirmed = window.confirm("Clear all bills and start fresh?");
    if (!confirmed) {
      return;
    }

    state.settings = {
      shopLabel: "ताडपत्री",
      brandLabel: "||| SHREE |||",
      signatureLabel: "JAYESH",
      slipsPerPage: 4,
    };
    state.slips = [createSlip()];
    commit();
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

function commit({ fullRender = true } = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (fullRender) {
    render();
    return;
  }

  renderPreview();
}

function render() {
  elements.shopLabel.value = state.settings.shopLabel;
  elements.brandLabel.value = state.settings.brandLabel;
  elements.signatureLabel.value = state.settings.signatureLabel;
  elements.slipsPerPage.value = String(state.settings.slipsPerPage);

  renderEditors();
  renderPreview();
  syncPreviewToggleLabel();
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
    title.textContent = `${slip.customerName || "Untitled bill"}`;

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
    if (pageSlips.length === 1) {
      page.classList.add("single-slip-page");
    }
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
        <th style="width: 5%;">SR</th>
        <th class="text-left" style="width: 18%;">COLOR</th>
        <th style="width: 8%;">GSM</th>
        <th style="width: 12%;">SIZE</th>
        <th style="width: 8%;">BUNDLE</th>
        <th style="width: 8%;">PCS</th>
        <th style="width: 16%;">WEIGHT</th>
        <th style="width: 12%;">RATE</th>
        <th style="width: 13%;">AMOUNT</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const body = table.querySelector("tbody");
  slip.rows.forEach((row, index) => {
    const rowElement = document.createElement("tr");
    rowElement.innerHTML = `
      <td>${index + 1}</td>
      <td class="text-left">${escapeHtml(row.color || " ")}</td>
      <td>${escapeHtml(row.gsm || " ")}</td>
      <td>${escapeHtml(row.size || " ")}</td>
      <td>${escapeHtml(row.bundle || " ")}</td>
      <td>${escapeHtml(row.pcs || " ")}</td>
      <td>${escapeHtml(row.weight || " ")}</td>
      <td>${escapeHtml(row.rate || " ")}</td>
      <td>${escapeHtml(getDisplayAmount(row) || " ")}</td>
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
function getDisplayAmount(row) {
  return row.amount && row.amount.trim() ? row.amount.trim() : "";
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
