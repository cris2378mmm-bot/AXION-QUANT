/* =========================================================
   AXION QUANT — LÓGICA PRINCIPAL DE LA APLICACIÓN
   Archivo: app.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // =======================================================
  // 1. ESTADO GLOBAL Y PERSISTENCIA
  // =======================================================
  const STORAGE_CART_KEY = "axion_quant_cart_v4";
  const STORAGE_COUPON_KEY = "axion_quant_coupon_v4";

  const state = {
    category: "all",
    search: "",
    sort: "featured",
    cart: loadFromStorage(STORAGE_CART_KEY, []),
    appliedCoupon: loadFromStorage(STORAGE_COUPON_KEY, null)
  };

  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(state.cart));
    localStorage.setItem(STORAGE_COUPON_KEY, JSON.stringify(state.appliedCoupon));
  }

  // Formateadores
  function formatUSD(amount, decimals = 2) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  }

  function formatCompactUSD(value) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${Math.round(value)}`;
  }

  // =======================================================
  // 2. REFERENCIAS DEL DOM
  // =======================================================
  const el = {
    tickerTrack: document.getElementById("ticker-track"),
    navbar: document.getElementById("navbar"),
    navLinks: document.getElementById("nav-links"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),

    // Catálogo
    filterTabs: document.getElementById("filter-tabs"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    productsGrid: document.getElementById("products-grid"),
    emptyState: document.getElementById("empty-state"),
    resetFiltersBtn: document.getElementById("reset-filters-btn"),

    // Simulador
    simCapital: document.getElementById("sim-capital"),
    simMonthly: document.getElementById("sim-monthly"),
    simRate: document.getElementById("sim-rate"),
    simMonths: document.getElementById("sim-months"),
    simRisk: document.getElementById("sim-risk"),
    valCapital: document.getElementById("val-capital"),
    valMonthly: document.getElementById("val-monthly"),
    valRate: document.getElementById("val-rate"),
    valMonths: document.getElementById("val-months"),
    valRisk: document.getElementById("val-risk"),
    resFinal: document.getElementById("res-final"),
    resProfit: document.getElementById("res-profit"),
    resRiskUsd: document.getElementById("res-risk-usd"),
    growthCanvas: document.getElementById("growthChart"),

    // Carrito y Overlays
    overlay: document.getElementById("overlay"),
    openCartBtn: document.getElementById("open-cart-btn"),
    closeCartBtn: document.getElementById("close-cart-btn"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartCount: document.getElementById("cart-count"),
    cartItems: document.getElementById("cart-items"),
    couponInput: document.getElementById("coupon-input"),
    applyCouponBtn: document.getElementById("apply-coupon-btn"),
    couponFeedback: document.getElementById("coupon-feedback"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    discountRow: document.getElementById("discount-row"),
    cartDiscount: document.getElementById("cart-discount"),
    cartTotal: document.getElementById("cart-total"),
    checkoutBtn: document.getElementById("checkout-btn"),

    // Modal Producto
    productModal: document.getElementById("product-modal"),
    closeProductModal: document.getElementById("close-product-modal"),
    modalProductContent: document.getElementById("modal-product-content"),

    // Modal Checkout
    checkoutModal: document.getElementById("checkout-modal"),
    closeCheckoutModal: document.getElementById("close-checkout-modal"),
    checkoutFormView: document.getElementById("checkout-form-view"),
    checkoutForm: document.getElementById("checkout-form"),
    payName: document.getElementById("pay-name"),
    payEmail: document.getElementById("pay-email"),
    checkoutTotalDisplay: document.getElementById("checkout-total-display"),
    checkoutSuccessView: document.getElementById("checkout-success-view"),
    receiptBox: document.getElementById("receipt-box"),
    finishOrderBtn: document.getElementById("finish-order-btn"),

    // Formularios
    contactForm: document.getElementById("contact-form"),
    newsletterForm: document.getElementById("newsletter-form"),
    toastContainer: document.getElementById("toast-container")
  };

  // =======================================================
  // 3. TICKER DE MERCADOS EN VIVO
  // =======================================================
  function renderTicker() {
    if (!el.tickerTrack || typeof MARKET_TICKERS === "undefined") return;

    // Duplicamos el arreglo para un loop infinito sin cortes
    const items = [...MARKET_TICKERS, ...MARKET_TICKERS];

    el.tickerTrack.innerHTML = items
      .map(
        (item) => `
        <div class="ticker-item">
          <span class="ticker-symbol">${item.symbol}</span>
          <span class="ticker-price">${item.price}</span>
          <span class="ticker-change ${item.up ? "up" : "down"}">${item.change}</span>
        </div>
      `
      )
      .join("");
  }

  // =======================================================
  // 4. NAVEGACIÓN Y MENÚ MÓVIL
  // =======================================================
  function setupNavigation() {
    window.addEventListener("scroll", () => {
      el.navbar.classList.toggle("scrolled", window.scrollY > 30);
    });

    el.mobileMenuBtn.addEventListener("click", () => {
      el.navLinks.classList.toggle("active");
      const icon = el.mobileMenuBtn.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    });

    el.navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        el.navLinks.classList.remove("active");
        const icon = el.mobileMenuBtn.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      });
    });
  }

  // =======================================================
  // 5. CATÁLOGO: FILTRADO, BÚSQUEDA Y RENDER
  // =======================================================
  function getFilteredProducts() {
    const query = state.search.trim().toLowerCase();

    const filtered = PRODUCTS.filter((product) => {
      const matchesCat =
        state.category === "all" || product.category === state.category;

      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.shortDesc.toLowerCase().includes(query) ||
        product.specs.some((s) => s.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });

    const sorted = [...filtered];
    switch (state.sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "featured":
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return sorted;
  }

  function renderProducts() {
    const list = getFilteredProducts();

    if (list.length === 0) {
      el.productsGrid.innerHTML = "";
      el.emptyState.classList.remove("hidden");
      return;
    }

    el.emptyState.classList.add("hidden");

    el.productsGrid.innerHTML = list
      .map(
        (p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-img-wrap">
          <img class="product-img" src="${p.image}" alt="${p.title}" loading="lazy" />
          ${
            p.badge
              ? `<span class="product-badge ${p.badgeType}">${p.badge}</span>`
              : ""
          }
          <span class="product-category-tag">${CATEGORY_LABELS[p.category] || p.category}</span>
        </div>

        <div class="product-body">
          <div class="product-meta">
            <span class="product-rating">
              <i class="fa-solid fa-star"></i> ${p.rating.toFixed(1)} (${p.reviews})
            </span>
            <span>ENTREGA DIGITAL</span>
          </div>

          <h3 class="product-title">${p.title}</h3>
          <p class="product-desc">${p.shortDesc}</p>

          <div class="product-specs">
            ${p.specs.map((spec) => `<span>${spec}</span>`).join("")}
          </div>

          <div class="product-footer">
            <div class="product-price-wrap">
              ${
                p.oldPrice
                  ? `<span class="product-old-price">${formatUSD(p.oldPrice)}</span>`
                  : ""
              }
              <span class="product-price">${formatUSD(p.price)}</span>
            </div>

            <div class="product-actions">
              <button class="btn-icon-view" data-action="view" data-id="${p.id}" title="Ver ficha técnica" aria-label="Ver detalles de ${p.title}">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="btn-add-cart" data-action="add" data-id="${p.id}">
                <i class="fa-solid fa-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  function setupCatalogEvents() {
    // Tabs de categoría
    el.filterTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      el.filterTabs
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      state.category = btn.dataset.category;
      renderProducts();
    });

    // Búsqueda
    el.searchInput.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderProducts();
    });

    // Ordenamiento
    el.sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProducts();
    });

    // Reset de filtros
    el.resetFiltersBtn.addEventListener("click", () => {
      state.category = "all";
      state.search = "";
      state.sort = "featured";

      el.searchInput.value = "";
      el.sortSelect.value = "featured";
      el.filterTabs
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));

      renderProducts();
    });

    // Delegación de clics en las tarjetas
    el.productsGrid.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (!actionBtn) return;

      const { action, id } = actionBtn.dataset;
      if (action === "add") {
        addToCart(id);
      } else if (action === "view") {
        openProductModal(id);
      }
    });
  }

  // =======================================================
  // 6. MODAL DE VISTA RÁPIDA DE PRODUCTO
  // =======================================================
  function openProductModal(productId) {
    const p = PRODUCTS.find((item) => item.id === productId);
    if (!p) return;

    el.modalProductContent.innerHTML = `
      <div class="modal-product-grid">
        <div>
          <img class="modal-product-img" src="${p.image}" alt="${p.title}" />
          <div class="product-specs" style="margin-top: 14px;">
            ${p.specs.map((spec) => `<span>${spec}</span>`).join("")}
          </div>
        </div>

        <div class="modal-product-details">
          <span class="section-tag" style="margin-bottom: 8px;">${CATEGORY_LABELS[p.category]}</span>
          <h3>${p.title}</h3>
          <div class="product-meta" style="margin-bottom: 14px;">
            <span class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating.toFixed(1)} · ${p.reviews} reseñas verificadas</span>
          </div>
          <p>${p.fullDesc}</p>

          <ul class="modal-features-list">
            ${p.features
              .map((feat) => `<li><i class="fa-solid fa-check"></i> <span>${feat}</span></li>`)
              .join("")}
          </ul>

          <div class="product-footer">
            <div class="product-price-wrap">
              ${
                p.oldPrice
                  ? `<span class="product-old-price">${formatUSD(p.oldPrice)}</span>`
                  : ""
              }
              <span class="product-price">${formatUSD(p.price)}</span>
            </div>

            <button class="btn btn-primary" id="modal-add-btn">
              <i class="fa-solid fa-bag-shopping"></i> Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-add-btn").addEventListener("click", () => {
      addToCart(p.id);
      closeAllOverlays();
      openCart();
    });

    el.overlay.classList.remove("hidden");
    el.productModal.classList.remove("hidden");
  }

  // =======================================================
  // 7. CARRITO DE COMPRAS Y CUPONES
  // =======================================================
  function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existing = state.cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id: product.id, qty: 1 });
    }

    saveState();
    renderCart();
    showToast(`"${product.title}" agregado al carrito.`);
  }

  function updateCartQty(productId, delta) {
    const item = state.cart.find((i) => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter((i) => i.id !== productId);
    }

    saveState();
    renderCart();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter((i) => i.id !== productId);
    saveState();
    renderCart();
  }

  function getCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      return product ? sum + product.price * item.qty : sum;
    }, 0);

    const couponData =
      state.appliedCoupon && COUPONS[state.appliedCoupon]
        ? COUPONS[state.appliedCoupon]
        : null;

    const discountRate = couponData ? couponData.discount : 0;
    const discountAmount = subtotal * discountRate;
    const total = Math.max(0, subtotal - discountAmount);

    return { subtotal, discountRate, discountAmount, total };
  }

  function renderCart() {
    const totalItems = state.cart.reduce((sum, i) => sum + i.qty, 0);
    el.cartCount.textContent = totalItems;

    if (state.cart.length === 0) {
      el.cartItems.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <p>Tu carrito está vacío.</p>
          <span style="font-size: 0.8rem;">Explora nuestros bots, indicadores o membresías.</span>
        </div>
      `;
    } else {
      el.cartItems.innerHTML = state.cart
        .map((item) => {
          const p = PRODUCTS.find((prod) => prod.id === item.id);
          if (!p) return "";
          return `
            <div class="cart-item">
              <img class="cart-item-img" src="${p.image}" alt="${p.title}" />
              <div class="cart-item-info">
                <div class="cart-item-title" title="${p.title}">${p.title}</div>
                <div class="cart-item-price">${formatUSD(p.price * item.qty)}</div>
                <div class="cart-item-controls">
                  <div class="qty-group">
                    <button class="qty-btn" data-cart-action="dec" data-id="${p.id}" aria-label="Disminuir cantidad">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" data-cart-action="inc" data-id="${p.id}" aria-label="Aumentar cantidad">+</button>
                  </div>
                  <button class="remove-item-btn" data-cart-action="remove" data-id="${p.id}" title="Eliminar">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    const { subtotal, discountRate, discountAmount, total } = getCartTotals();

    el.cartSubtotal.textContent = formatUSD(subtotal);
    el.cartTotal.textContent = formatUSD(total);

    if (discountRate > 0 && subtotal > 0) {
      el.discountRow.classList.remove("hidden");
      el.discountRow.querySelector("span:first-child").textContent = `Descuento (${Math.round(
        discountRate * 100
      )}%)`;
      el.cartDiscount.textContent = `-${formatUSD(discountAmount)}`;
    } else {
      el.discountRow.classList.add("hidden");
    }

    // Mostrar estado del cupón guardado si existe
    if (state.appliedCoupon && COUPONS[state.appliedCoupon]) {
      el.couponInput.value = state.appliedCoupon;
      el.couponFeedback.textContent = `Código ${state.appliedCoupon} activo: ${COUPONS[state.appliedCoupon].label}`;
      el.couponFeedback.className = "coupon-feedback success";
    }
  }

  function applyCoupon() {
    const code = el.couponInput.value.trim().toUpperCase();

    if (!code) {
      state.appliedCoupon = null;
      saveState();
      el.couponFeedback.textContent = "";
      el.couponFeedback.className = "coupon-feedback";
      renderCart();
      return;
    }

    if (COUPONS[code]) {
      state.appliedCoupon = code;
      saveState();
      el.couponFeedback.textContent = `Código ${code} aplicado: ${COUPONS[code].label}`;
      el.couponFeedback.className = "coupon-feedback success";
      renderCart();
      showToast(`Cupón ${code} aplicado correctamente.`);
    } else {
      el.couponFeedback.textContent = "Código inválido. Prueba con AXION10.";
      el.couponFeedback.className = "coupon-feedback error";
    }
  }

  function openCart() {
    closeAllOverlays();
    el.overlay.classList.remove("hidden");
    el.cartDrawer.classList.add("open");
  }

  function closeAllOverlays() {
    el.overlay.classList.add("hidden");
    el.cartDrawer.classList.remove("open");
    el.productModal.classList.add("hidden");
    el.checkoutModal.classList.add("hidden");
  }

  function setupCartEvents() {
    el.openCartBtn.addEventListener("click", openCart);
    el.closeCartBtn.addEventListener("click", closeAllOverlays);
    el.closeProductModal.addEventListener("click", closeAllOverlays);
    el.closeCheckoutModal.addEventListener("click", closeAllOverlays);
    el.overlay.addEventListener("click", closeAllOverlays);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllOverlays();
    });

    el.cartItems.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cart-action]");
      if (!btn) return;
      const { cartAction, id } = btn.dataset;

      if (cartAction === "inc") updateCartQty(id, 1);
      if (cartAction === "dec") updateCartQty(id, -1);
      if (cartAction === "remove") removeFromCart(id);
    });

    el.applyCouponBtn.addEventListener("click", applyCoupon);
    el.couponInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCoupon();
      }
    });

    // Abrir Checkout
    el.checkoutBtn.addEventListener("click", () => {
      if (state.cart.length === 0) {
        showToast("Agrega al menos un producto antes de finalizar.", true);
        return;
      }

      const { total } = getCartTotals();
      el.checkoutTotalDisplay.textContent = `${formatUSD(total)} USD`;
      el.checkoutFormView.classList.remove("hidden");
      el.checkoutSuccessView.classList.add("hidden");

      el.cartDrawer.classList.remove("open");
      el.overlay.classList.remove("hidden");
      el.checkoutModal.classList.remove("hidden");
    });

    // Procesar Checkout simulado
    el.checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = el.payName.value.trim();
      const email = el.payEmail.value.trim();
      const method =
        el.checkoutForm.querySelector('input[name="pay-method"]:checked')?.value ||
        "Tarjeta";
      const { total } = getCartTotals();
      const itemCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
      const orderId = `AXQ-${Math.floor(100000 + Math.random() * 900000)}`;

      el.receiptBox.innerHTML = `
        <div class="receipt-row"><span>ID de Orden</span><strong class="mono-num accent">${orderId}</strong></div>
        <div class="receipt-row"><span>Titular</span><strong>${name}</strong></div>
        <div class="receipt-row"><span>Entrega Digital</span><strong>${email}</strong></div>
        <div class="receipt-row"><span>Método de Pago</span><strong>${method}</strong></div>
        <div class="receipt-row"><span>Artículos</span><strong class="mono-num">${itemCount} licencia(s)</strong></div>
        <div class="receipt-row"><span>Total Pagado</span><strong class="mono-num accent">${formatUSD(total)} USD</strong></div>
      `;

      // Vaciar carrito y cupón
      state.cart = [];
      state.appliedCoupon = null;
      el.couponInput.value = "";
      el.couponFeedback.textContent = "";
      saveState();
      renderCart();

      el.checkoutForm.reset();
      el.checkoutFormView.classList.add("hidden");
      el.checkoutSuccessView.classList.remove("hidden");
      showToast(`Orden ${orderId} confirmada con éxito.`);
    });

    el.finishOrderBtn.addEventListener("click", closeAllOverlays);
  }

  // =======================================================
  // 8. SIMULADOR DE INTERÉS COMPUESTO Y GRÁFICA CANVAS
  // =======================================================
  let lastSimulationData = null;

  function runSimulation() {
    const capital = Number(el.simCapital.value);
    const monthly = Number(el.simMonthly.value);
    const ratePct = Number(el.simRate.value);
    const months = Number(el.simMonths.value);
    const riskPct = Number(el.simRisk.value);

    // Actualizar etiquetas de sliders
    el.valCapital.textContent = formatUSD(capital, 0);
    el.valMonthly.textContent = formatUSD(monthly, 0);
    el.valRate.textContent = `${ratePct.toFixed(1)}%`;
    el.valMonths.textContent = `${months} meses`;
    el.valRisk.textContent = `${riskPct.toFixed(2)}%`;

    // Proyección mes a mes
    const r = ratePct / 100;
    const balanceSeries = [capital];
    const contributedSeries = [capital];

    let currentBalance = capital;
    let totalContributed = capital;

    for (let m = 1; m <= months; m++) {
      currentBalance = currentBalance * (1 + r) + monthly;
      totalContributed += monthly;
      balanceSeries.push(currentBalance);
      contributedSeries.push(totalContributed);
    }

    const netProfit = currentBalance - totalContributed;
    const riskBaseUSD = capital * (riskPct / 100);

    el.resFinal.textContent = formatUSD(currentBalance, 0);
    el.resProfit.textContent = `+${formatUSD(netProfit, 0)}`;
    el.resRiskUsd.textContent = formatUSD(riskBaseUSD, 2);

    lastSimulationData = { balanceSeries, contributedSeries, months };
    drawGrowthChart(lastSimulationData);
  }

  function drawGrowthChart({ balanceSeries, contributedSeries, months }) {
    const canvas = el.growthCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Ajuste nítido para pantallas HiDPI / Retina
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 560;
    const height = 260;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Limpiar lienzo
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 18, bottom: 34, left: 60 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const maxVal = Math.max(...balanceSeries) * 1.08;
    const minVal = 0;

    const getX = (index) => pad.left + (index / months) * chartW;
    const getY = (val) =>
      pad.top + chartH - ((val - minVal) / (maxVal - minVal || 1)) * chartH;

    // 1. Líneas de cuadrícula horizontales y eje Y
    const gridSteps = 4;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridSteps; i++) {
      const value = (maxVal / gridSteps) * i;
      const y = getY(value);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();

      ctx.fillStyle = "#64748B";
      ctx.fillText(formatCompactUSD(value), pad.left - 10, y);
    }

    // 2. Etiquetas del eje X
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#64748B";
    const xTicks = [0, Math.round(months / 2), months];
    xTicks.forEach((m) => {
      const x = getX(m);
      ctx.fillText(`Mes ${m}`, x, height - pad.bottom + 12);
    });

    // 3. Línea de Capital Aportado (punteada gris)
    ctx.save();
    ctx.strokeStyle = "#64748B";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    contributedSeries.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // 4. Relleno degradado bajo la Curva de Capital Total
    const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.32)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");

    ctx.beginPath();
    balanceSeries.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(months), height - pad.bottom);
    ctx.lineTo(getX(0), height - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 5. Línea principal de Capital Total (Esmeralda)
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 2.8;
    ctx.lineJoin = "round";
    ctx.beginPath();
    balanceSeries.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 6. Punto final resaltado
    const endX = getX(months);
    const endY = getY(balanceSeries[months]);

    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(16, 185, 129, 0.28)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#10B981";
    ctx.fill();
  }

  function setupSimulator() {
    const inputs = [
      el.simCapital,
      el.simMonthly,
      el.simRate,
      el.simMonths,
      el.simRisk
    ];

    inputs.forEach((input) => {
      input.addEventListener("input", runSimulation);
    });

    window.addEventListener("resize", () => {
      if (lastSimulationData) drawGrowthChart(lastSimulationData);
    });

    runSimulation();
  }

  // =======================================================
  // 9. FORMULARIOS (CONTACTO Y NEWSLETTER) + TOASTS
  // =======================================================
  function setupForms() {
    el.contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("c-name").value.trim();
      showToast(`Gracias, ${name}. Tu solicitud llegó al desk de AXION QUANT.`);
      el.contactForm.reset();
    });

    el.newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Suscripción confirmada. Recibirás el reporte este domingo.");
      el.newsletterForm.reset();
    });
  }

  function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " error" : ""}`;
    toast.innerHTML = `
      <i class="fa-solid ${isError ? "fa-triangle-exclamation" : "fa-circle-check"}" style="color: ${
      isError ? "#EF4444" : "#10B981"
    };"></i>
      <span>${message}</span>
    `;

    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  // =======================================================
  // 10. INICIALIZACIÓN GENERAL
  // =======================================================
  renderTicker();
  setupNavigation();
  renderProducts();
  setupCatalogEvents();
  renderCart();
  setupCartEvents();
  setupSimulator();
  setupForms();
});
