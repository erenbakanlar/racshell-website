/* ==========================================================
   RACSHELL — Etkileşimler
   ========================================================== */
(function () {
  "use strict";

  const WA_NUMBER = "905326508094";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);

  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ---------- Header ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#menuToggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  });
  document.querySelectorAll("#navLinks a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // Aktif menü bağlantısı
  const navMap = {};
  document.querySelectorAll("#navLinks a").forEach((a) => (navMap[a.getAttribute("href")] = a));
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.classList.contains("hero") ? "#top" : "#" + e.target.id;
        if (!navMap[id]) return;
        Object.values(navMap).forEach((a) => a.classList.remove("active"));
        navMap[id].classList.add("active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["kategoriler", "koleksiyon", "hakkimizda", "iletisim"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
  sectionObserver.observe($(".hero"));

  /* ---------- Marquee ---------- */
  const words = ["Yeni Sezon", "Elbise", "Takım", "Çanta", "Takı", "Zamansız Zarafet", "Antalya'da Şıklığın Yeni Adresi"];
  const chunk = words.map((w) => `<span>${w}<svg><use href="#shell"/></svg></span>`).join("");
  $("#marqueeTrack").innerHTML = chunk + chunk;

  /* ---------- Kategoriler (yalnızca ürünü olan kategoriler) ---------- */
  const activeCats = CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c.id));
  $("#catGrid").innerHTML = activeCats
    .map((c, i) => {
      const items = PRODUCTS.filter((p) => p.category === c.id);
      const cover = (items.find((p) => p.images && p.images.length) || {}).images;
      return `
    <button class="cat-card reveal r${(i % 5) + 1}" data-cat="${c.id}">
      ${cover ? `<img src="${cover[0]}" alt="" loading="lazy">` : ""}
      <h3>${c.label}</h3>
      <span>${c.note} · ${items.length} ürün</span>
    </button>`;
    })
    .join("");

  $("#catGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".cat-card");
    if (!card) return;
    setFilter(card.dataset.cat);
    document.getElementById("koleksiyon").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Katalog ---------- */
  const filters = [{ id: "all", label: "Tümü" }, ...activeCats];
  const filterBox = $("#filters");
  filterBox.innerHTML = filters
    .map((f) => `<button class="filter-btn${f.id === "all" ? " active" : ""}" role="tab" data-filter="${f.id}">${f.label}</button>`)
    .join("");
  filterBox.addEventListener("click", (e) => {
    const b = e.target.closest(".filter-btn");
    if (b) setFilter(b.dataset.filter);
  });

  const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || "";
  const imagesOf = (p) => p.images || [];
  const placeholder = `<div class="media-ph"><svg><use href="#shell"/></svg></div>`;

  function cardMedia(p) {
    const imgs = imagesOf(p);
    if (!imgs.length) return placeholder;
    return `<img class="img-main" src="${imgs[0]}" alt="${p.name}" loading="lazy" decoding="async">` +
      (imgs[1] ? `<img class="img-alt" src="${imgs[1]}" alt="" loading="lazy" decoding="async">` : "");
  }

  function renderProducts(filter) {
    const list = PRODUCTS.map((p, i) => ({ ...p, idx: i })).filter((p) => filter === "all" || p.category === filter);
    $("#productGrid").innerHTML = list
      .map(
        (p, i) => `
      <article class="product" style="animation-delay:${i * 80}ms">
        <div class="product-media" data-idx="${p.idx}" tabindex="0" role="button" aria-label="${p.name} fotoğraflarını gör">
          ${p.tag ? `<span class="product-tag ${p.tagStyle || ""}">${p.tag}</span>` : ""}
          ${imagesOf(p).length > 1 ? `<span class="product-count">${imagesOf(p).length} fotoğraf</span>` : ""}
          ${cardMedia(p)}
          <div class="product-actions">
            <button type="button" data-idx="${p.idx}"><svg><use href="#i-eye"/></svg>İncele</button>
            <a href="${waLink(`Merhaba, "${p.name}" ürünü hakkında bilgi almak istiyorum.`)}" target="_blank" rel="noopener">
              <svg><use href="#i-wa"/></svg>Sor
            </a>
          </div>
        </div>
        <div class="product-info">
          <span class="product-cat">${catLabel(p.category)}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-swatches">
            ${(p.colors || []).map((c) => `<i style="background:${c}"></i>`).join("")}
            ${p.price ? `<span class="product-price">${p.price}</span>` : ""}
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  function setFilter(id) {
    filterBox.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.filter === id));
    renderProducts(id);
  }
  renderProducts("all");

  /* ---------- Ürün modal + fotoğraf galerisi ---------- */
  const modal = $("#productModal");
  const gallery = $("#modalMedia");
  let lastFocus = null;
  let current = { imgs: [], i: 0, name: "" };

  function showSlide(i) {
    const n = current.imgs.length;
    if (!n) return;
    current.i = (i + n) % n;
    const img = $(".gallery-main", gallery);
    img.classList.remove("show");
    img.src = current.imgs[current.i];
    img.alt = `${current.name} — fotoğraf ${current.i + 1}`;
    const reveal = () => img.classList.add("show");
    img.complete ? requestAnimationFrame(reveal) : img.addEventListener("load", reveal, { once: true });
    gallery.querySelectorAll(".gallery-thumbs button").forEach((b, k) => {
      b.classList.toggle("active", k === current.i);
      if (k === current.i) b.scrollIntoView({ block: "nearest", inline: "center" });
    });
    const counter = $(".gallery-counter", gallery);
    if (counter) counter.textContent = `${current.i + 1} / ${n}`;
  }

  function openModal(idx) {
    const p = PRODUCTS[idx];
    if (!p) return;
    lastFocus = document.activeElement;
    current = { imgs: imagesOf(p), i: 0, name: p.name };
    const multi = current.imgs.length > 1;

    gallery.innerHTML = current.imgs.length
      ? `<div class="gallery-stage">
           <img class="gallery-main" alt="">
           ${multi ? `
           <button class="gallery-nav prev" aria-label="Önceki fotoğraf"><svg><use href="#i-arrow"/></svg></button>
           <button class="gallery-nav next" aria-label="Sonraki fotoğraf"><svg><use href="#i-arrow"/></svg></button>` : ""}
           ${multi ? '<span class="gallery-counter"></span>' : ""}
         </div>
         ${multi ? `<div class="gallery-thumbs">${current.imgs
           .map((src, k) => `<button aria-label="Fotoğraf ${k + 1}"><img src="${src}" alt="" loading="lazy"></button>`)
           .join("")}</div>` : ""}`
      : placeholder;

    $("#modalCat").textContent = catLabel(p.category);
    $("#modalTitle").textContent = p.name;
    $("#modalDesc").textContent = p.desc || "";
    $("#modalColors").innerHTML = (p.colors || []).map((c) => `<i style="background:${c}"></i>`).join("");
    $("#modalColorsRow").hidden = !(p.colors && p.colors.length);
    $("#modalSizes").innerHTML = (p.sizes || []).map((s) => `<span>${s}</span>`).join("");
    $("#modalSizesRow").hidden = !(p.sizes && p.sizes.length);
    $("#modalWa").href = waLink(`Merhaba, "${p.name}" ürünü hakkında bilgi almak istiyorum.`);

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (current.imgs.length) showSlide(0);
    $("#modalClose").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  gallery.addEventListener("click", (e) => {
    if (e.target.closest(".prev")) return showSlide(current.i - 1);
    if (e.target.closest(".next")) return showSlide(current.i + 1);
    const thumb = e.target.closest(".gallery-thumbs button");
    if (thumb) showSlide([...thumb.parentNode.children].indexOf(thumb));
  });
  // dokunmatik kaydırma
  let touchX = null;
  gallery.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  gallery.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) showSlide(current.i + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  $("#productGrid").addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const t = e.target.closest("[data-idx]");
    if (t) openModal(+t.dataset.idx);
  });
  $("#productGrid").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("product-media")) {
      e.preventDefault();
      openModal(+e.target.dataset.idx);
    }
  });
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showSlide(current.i + 1);
    if (e.key === "ArrowLeft") showSlide(current.i - 1);
  });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      }),
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  $("#year").textContent = new Date().getFullYear();

  /* ==========================================================
     HERO — Dalgalanan kırmızı elbise
     Sayfa açılınca rüzgâr eser, etek dalgalanır, ~5 sn sonra
     sönümlenerek sabit (dinlenme) haline oturur.
     ========================================================== */
  const skirt = $("#skirt");
  const train = $("#train");
  const folds = $("#folds");
  if (!skirt) return;

  const WAIST_Y = 304, HEM_Y = 846, SPAN = HEM_Y - WAIST_Y;
  const LOBES = 6, HEM_L = 150, HEM_R = 462;
  const f1 = (n) => n.toFixed(1);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  // Etek kenarındaki kıvrım noktaları (dinlenme hali)
  const hemPts = [];
  for (let i = 0; i <= LOBES; i++) {
    const u = i / LOBES;
    hemPts.push([HEM_L + (HEM_R - HEM_L) * u, HEM_Y + 14 * Math.sin(Math.PI * u)]);
  }

  let T = 0, A = 0;
  function disp(x, y, k = 1) {
    const h = clamp01((y - WAIST_Y) / SPAN);
    const ph = T * 4.6 - 3.6 * h + x * 0.007;
    return [
      x + A * k * (54 * Math.pow(h, 1.4) * Math.sin(ph) + 30 * h * h),
      y + A * k * (16 * h * h * Math.cos(ph * 1.25 + x * 0.02))
    ];
  }
  const P = (x, y, k) => { const d = disp(x, y, k); return f1(d[0]) + " " + f1(d[1]); };

  function buildSkirt() {
    let d = `M${P(270, 304)}C${P(260, 330)} ${P(254, 356)} ${P(252, 384)}C${P(238, 520)} ${P(196, 700)} ${P(hemPts[0][0], hemPts[0][1])}`;
    for (let i = 0; i < LOBES; i++) {
      const a = hemPts[i], b = hemPts[i + 1];
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 10;
      d += `Q${P(mx, my)} ${P(b[0], b[1])}`;
    }
    d += `C${P(414, 700)} ${P(366, 520)} ${P(348, 384)}C${P(346, 356)} ${P(340, 330)} ${P(330, 304)}Z`;
    return d;
  }

  function buildTrain() {
    const k = 1.7;
    const lift = (x, y) => {
      const h = clamp01((y - WAIST_Y) / SPAN);
      const d = disp(x, y, k);
      return f1(d[0]) + " " + f1(d[1] - A * 34 * h * h);
    };
    return `M${lift(340, 400)}C${lift(382, 560)} ${lift(452, 740)} ${lift(556, 862)}Q${lift(522, 878)} ${lift(440, 868)}C${lift(404, 700)} ${lift(372, 560)} ${lift(340, 400)}Z`;
  }

  // kıvrım çizgileri: belden etek ucundaki birleşim noktalarına
  const foldLines = [];
  for (let i = 1; i < LOBES; i++) {
    const sx = 270 + (60 * i) / LOBES;
    const e = hemPts[i];
    const mx = sx + (e[0] - sx) * 0.45 + (i - 3) * 4;
    foldLines.push([sx, 312, mx, 580, e[0], e[1] - 2]);
  }
  folds.innerHTML = foldLines
    .map(() => `<path stroke="#5a0710" stroke-width="2.4" opacity=".45"/><path stroke="#ff7a84" stroke-width="1.2" opacity=".35"/>`)
    .join("");
  const foldEls = folds.querySelectorAll("path");

  function buildFolds() {
    foldLines.forEach((l, i) => {
      const d = `M${P(l[0], l[1])}Q${P(l[2], l[3])} ${P(l[4], l[5])}`;
      foldEls[i * 2].setAttribute("d", d);
      const dh = `M${P(l[0] + 5, l[1] + 10)}Q${P(l[2] + 8, l[3])} ${P(l[4] + 9, l[5] - 8)}`;
      foldEls[i * 2 + 1].setAttribute("d", dh);
    });
  }

  function draw() {
    skirt.setAttribute("d", buildSkirt());
    train.setAttribute("d", buildTrain());
    buildFolds();
  }

  const DURATION = 6;
  function amplitude(t) {
    const gust = smooth(0, 0.45, t);          // rüzgâr başlar
    const decay = Math.exp(-t / 2);         // sönümlenir
    const settle = 1 - smooth(3.8, DURATION, t); // tamamen durur
    return gust * decay * settle;
  }

  if (reduceMotion) {
    A = 0;
    draw();
    return;
  }

  A = 0;
  draw();
  let start = null;
  function frame(now) {
    if (start === null) start = now;
    T = (now - start) / 1000;
    if (T >= DURATION) {
      A = 0;
      draw(); // dinlenme haline sabitle
      return;
    }
    A = amplitude(T);
    draw();
    requestAnimationFrame(frame);
  }
  // giriş animasyonuyla birlikte başlat
  setTimeout(() => requestAnimationFrame(frame), 350);
})();
