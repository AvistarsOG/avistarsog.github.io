const products = [
  { id: "vanta-4060", name: "Vanta 4060", badge: "PLAYER FAVORITE", category: "1080p", label: "1080P GAMING", description: "Your smooth, high-FPS entry into the game.", cpu: "RYZEN 5 7600", gpu: "RTX 4060 8GB", memory: "32GB DDR5", storage: "1TB", price: 124990, rating: "4.9", reviews: 128, color: "#9ed647", caseColor: "#252923" },
  { id: "vanta-4070", name: "Vanta 4070", badge: "BEST FOR 1440P", category: "1440p", label: "1440P GAMING", description: "Crisp detail and beautifully fluid frames.", cpu: "RYZEN 5 7600", gpu: "RTX 4070 SUPER", memory: "32GB DDR5", storage: "1TB", price: 149990, rating: "4.9", reviews: 86, color: "#d9ff53", caseColor: "#252923" },
  { id: "spectre-4070", name: "Spectre 4070", badge: "QUIET POWER", category: "1440p", label: "1440P GAMING", description: "Big performance. Clean, understated presence.", cpu: "RYZEN 7 7800X3D", gpu: "RTX 4070 SUPER", memory: "64GB DDR5", storage: "1TB", price: 174990, rating: "5.0", reviews: 43, color: "#78bfd1", caseColor: "#282b2c" },
  { id: "vanta-4080", name: "Vanta 4080", badge: "4K READY", category: "4k", label: "4K & CREATOR", description: "No compromises for ultra settings and big ideas.", cpu: "RYZEN 7 7800X3D", gpu: "RTX 4080 SUPER", memory: "64GB DDR5", storage: "2TB", cooling: "240mm", price: 223990, rating: "4.9", reviews: 62, color: "#d69d68", caseColor: "#292623" },
  { id: "spectre-4080", name: "Spectre Studio", badge: "CREATOR PICK", category: "4k", label: "4K & CREATOR", description: "A powerhouse for play, streams, and creation.", cpu: "RYZEN 9 9900X", gpu: "RTX 4080 SUPER", memory: "64GB DDR5", storage: "2TB", cooling: "360mm", motherboard: "X870E", psu: "1000W", fans: "6", price: 269490, rating: "5.0", reviews: 29, color: "#ba9bdf", caseColor: "#28252e" },
  { id: "vanta-4090", name: "Vanta Apex", badge: "NO LIMITS", category: "4k", label: "4K & CREATOR", description: "Our most powerful build. Full stop.", cpu: "RYZEN 9 9950X3D", gpu: "RTX 5090 32GB", memory: "64GB DDR5", storage: "4TB", cooling: "360mm", motherboard: "X870E", psu: "1200W", fans: "10", price: 478990, rating: "5.0", reviews: 17, color: "#eb7373", caseColor: "#2c2424" }
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const cart = new Map();
const productGrid = document.querySelector("#product-grid");
const productCount = document.querySelector("#product-count");
const cartDialog = document.querySelector("#cart-dialog");
const builderDialog = document.querySelector("#builder-dialog");
const quoteDialog = document.querySelector("#quote-dialog");
const toast = document.querySelector(".toast");
let activeFilter = "all";
let toastTimeout;
let illustrationSequence = 0;

function towerIllustration(color, caseColor, variation = 0) {
  const spin = variation % 2 ? 4 : -3;
  const panelId = `panel-${variation}-${illustrationSequence++}`;
  return `<svg class="product-svg" viewBox="0 0 200 220" aria-hidden="true" focusable="false">
    <defs><linearGradient id="${panelId}" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#111" stop-opacity=".06"/></linearGradient></defs>
    <g transform="rotate(${spin} 100 110)">
      <path d="m37 22 107-8 20 13v169l-20 13-107-9Z" fill="${caseColor}" stroke="#51594b" stroke-width="2"/>
    <path d="m42 27 101-7v164l-101-8Z" fill="url(#${panelId})" stroke="#8b9782" stroke-opacity=".5"/>
      <path d="m143 20 15 10v160l-15 8Z" fill="#11140f" stroke="#65705c"/>
      <path d="m49 37 85-6v6l-85 7Z" fill="#fff" opacity=".16"/>
      <path d="m52 48 35-3v44l-35 3Z" fill="#11140f" stroke="#6e7968"/>
      <path d="m59 56 21-2v28l-21 2Z" fill="${color}" opacity=".85"/>
      <path d="m95 46 37-3v4l-37 3Zm0 8 37-3v4l-37 3Z" fill="#a6ae9e" opacity=".5"/>
      <path d="m53 103 77-6v3l-77 6Zm0 7 77-6v3l-77 6Z" fill="#a6ae9e" opacity=".35"/>
      <g fill="none" stroke="${color}" stroke-width="2.5">
        <circle cx="75" cy="145" r="19"/><circle cx="75" cy="145" r="13" stroke-width="1"/>
        <circle cx="119" cy="142" r="19"/><circle cx="119" cy="142" r="13" stroke-width="1"/>
      </g>
      <g fill="${color}" opacity=".72">
        <path d="M75 129c6 6 6 9 0 15-6-6-6-9 0-15Zm16 16c-6 6-9 6-15 0 6-6 9-6 15 0Zm-16 16c-6-6-6-9 0-15 6 6 6 9 0 15Zm-16-16c6-6 9-6 15 0-6 6-9 6-15 0Z"/>
        <path d="M119 126c6 6 6 9 0 15-6-6-6-9 0-15Zm16 16c-6 6-9 6-15 0 6-6 9-6 15 0Zm-16 16c-6-6-6-9 0-15 6 6 6 9 0 15Zm-16-16c6-6 9-6 15 0-6 6-9 6-15 0Z"/>
      </g>
      <circle cx="151" cy="157" r="2.5" fill="${color}"/>
      <path d="m45 190 98 7v5l-98-8Z" fill="#10130f"/>
    </g>
  </svg>`;
}

function renderProducts() {
  const sort = document.querySelector("#sort-products").value;
  let visible = products.filter((product) => activeFilter === "all" || product.category === activeFilter);
  if (sort === "price-low") visible = [...visible].sort((a, b) => a.price - b.price);
  if (sort === "price-high") visible = [...visible].sort((a, b) => b.price - a.price);

  productGrid.innerHTML = visible.map((product) => {
    const favorite = product.favorite ? "true" : "false";
    return `<article class="product-card" data-product="${product.id}">
      <div class="product-art">
        <span class="product-tag">${product.badge}</span>
        <button class="favorite-button" type="button" aria-label="Save ${product.name} to favorites" aria-pressed="${favorite}" data-favorite="${product.id}">${favorite === "true" ? "♥" : "♡"}</button>
        ${towerIllustration(product.color, product.caseColor, products.indexOf(product))}
      </div>
      <div class="product-info">
        <p class="product-category">${product.label}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-specs"><span>${product.cpu}</span><span>${product.gpu}</span><span>${product.memory}</span><span>${product.storage} SSD</span></div>
        <div class="product-rating"><strong>★ ${product.rating}</strong> &nbsp;·&nbsp; ${product.reviews} player reviews</div>
        <div class="product-bottom"><span class="product-price">${money.format(product.price)}<small>Incl. taxes · Free shipping</small></span><button class="add-to-cart" type="button" data-add="${product.id}">Add to bag</button></div>
        <button class="view-build" type="button" data-configure="${product.id}">Customize this PC in 360° <span aria-hidden="true">↗</span></button>
      </div>
    </article>`;
  }).join("");
  productCount.textContent = `${visible.length} ${visible.length === 1 ? "system" : "systems"} ready to play`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function addToCart(item) {
  const existing = cart.get(item.id);
  if (existing) existing.quantity += 1;
  else cart.set(item.id, { ...item, quantity: 1 });
  renderCart();
  showToast(`${item.name} added to your bag`);
}

function renderCart() {
  const items = [...cart.values()];
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => { el.textContent = count; });
  document.querySelector("#cart-empty").hidden = items.length > 0;
  document.querySelector("#cart-footer").hidden = items.length === 0;
  document.querySelector("#cart-total").textContent = money.format(total);
  document.querySelector("#cart-items").innerHTML = items.map((item) => `<article class="cart-row">
    <div class="cart-thumb">${towerIllustration(item.color, item.caseColor, products.findIndex((product) => product.id === item.id))}</div>
    <div><h3 class="cart-item-name">${item.name}</h3><p class="cart-item-price">${money.format(item.price)} each</p>
      <p class="cart-item-specs">${[item.cpu, item.gpu, item.memory, item.storage, item.cooling, item.motherboard, item.psu, item.fans, item.caseName].filter(Boolean).join(" · ")}</p>
      <div class="quantity-control" aria-label="Quantity for ${item.name}">
        <button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Remove one ${item.name}">−</button><span>${item.quantity}</span>
        <button type="button" data-quantity="${item.id}" data-change="1" aria-label="Add one ${item.name}">+</button>
        <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Remove ${item.name} from bag">×</button>
      </div>
    </div><span class="cart-row-total">${money.format(item.price * item.quantity)}</span>
  </article>`).join("");
}

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle("is-active", selected);
      chip.setAttribute("aria-pressed", String(selected));
    });
    renderProducts();
  });
});

document.querySelector("#sort-products").addEventListener("change", renderProducts);

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const product = products.find((item) => item.id === (button.dataset.add || button.dataset.favorite || button.dataset.configure));
  if (!product) return;
  if (button.hasAttribute("data-add")) {
    addToCart(product);
    return;
  }
  if (button.hasAttribute("data-configure")) {
    openConfigurator(product);
    return;
  }
  product.favorite = !product.favorite;
  button.setAttribute("aria-pressed", String(product.favorite));
  button.textContent = product.favorite ? "♥" : "♡";
  showToast(product.favorite ? `${product.name} saved to favorites` : `${product.name} removed from favorites`);
});

document.querySelector("#open-builder").addEventListener("click", () => builderDialog.showModal());

const builderForm = document.querySelector("#builder-form");
const builderTotal = document.querySelector("#builder-total");
const baseBuildPrice = 124990;
const viewer = document.querySelector("#pc-viewer-stage");
const viewerModel = document.querySelector("#pc-model");
const viewerRange = document.querySelector("#view-angle");
const viewerTilt = document.querySelector("#view-tilt");
const viewerAngle = document.querySelector("#viewer-angle");
const rotateButton = document.querySelector("#auto-rotate");
const compatibilityNote = document.querySelector("#compatibility-note");
const gpuArtwork = document.querySelector("#gpu-artwork");
const cpuArtwork = document.querySelector("#cpu-artwork");
const buildOptions = {
  angle: 0,
  tilt: 0,
  caseColor: "#252923",
  caseName: "Obsidian",
  lightColor: "#d9ff53",
  lightName: "Lime"
};
let rotateTimer;
let dragState;

function buildPreviewSvg() {
  const gpu = builderForm.elements.gpu;
  const gpuName = gpu.selectedOptions[0].textContent.split(" (+")[0].replace("NVIDIA ", "").replace("AMD ", "");
  const cpuName = builderForm.elements.cpu.selectedOptions[0].dataset.model;
  const safeGpuName = gpuName.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
  const safeCpuName = cpuName.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
  const graphicsFill = gpuName.startsWith("RX") ? "#b76340" : "#53667c";
  const caseColor = buildOptions.caseColor;
  const lightColor = buildOptions.lightColor;
  const fan = (x, y, radius = 27) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="#10130f" stroke="${lightColor}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${radius - 7}" fill="none" stroke="${lightColor}" stroke-opacity=".55" stroke-width="2"/><circle cx="${x}" cy="${y}" r="5" fill="${lightColor}"/><path d="M${x} ${y - radius + 5}q9 8 0 17q-9-9 0-17m${radius - 5} ${radius + 1}q-8 9-17 0q9-9 17 0m${-radius + 5} ${radius + 1}q8-9 17 0q-9 9-17 0" fill="${lightColor}" opacity=".72"/>`;
  return `
    <div class="pc-face pc-face-front" aria-hidden="true"><svg viewBox="0 0 190 276"><path class="case-shell" d="M23 9h144v258H23z" fill="${caseColor}" stroke="#737c6d" stroke-width="2"/><path d="M31 17h128v242H31z" fill="#171a16" stroke="#a0a893" stroke-opacity=".35"/><path d="M39 28h112v24H39z" fill="${caseColor}"/><text x="95" y="44" fill="#cfd5c9" font-size="8" text-anchor="middle" letter-spacing="2">FORGE</text>${fan(95, 106, 34)}${fan(95, 191, 34)}<circle cx="95" cy="246" r="3" fill="${lightColor}"/></svg></div>
    <div class="pc-face pc-face-right" aria-hidden="true"><svg viewBox="0 0 140 276"><path d="M5 9h130v258H5z" fill="${caseColor}" stroke="#899181" stroke-width="2"/><path d="M11 17h118v242H11z" fill="#161b18" stroke="${lightColor}" stroke-opacity=".42"/><path d="M21 32h40v68H21z" fill="#252d27" stroke="#657064"/><path d="M26 38h30v30H26z" fill="#353e35" stroke="${lightColor}" stroke-opacity=".55"/><path d="M30 43h22v21H30z" fill="${lightColor}" opacity=".28"/><text x="41" y="56" fill="#eef1e7" font-size="4" text-anchor="middle">${safeCpuName}</text><path d="M24 75h34v4H24zm0 8h34v4H24zm0 8h34v4H24z" fill="#a6ae9e" opacity=".55"/><path d="M68 35h50v8H68z" fill="#383f37" stroke="#768071"/><path d="M69 46h48v53H69z" fill="${graphicsFill}" stroke="${lightColor}" stroke-opacity=".78" stroke-width="2"/><path d="M74 52h38M74 59h38M74 66h38M74 73h38M74 80h38" stroke="#d9e2d5" stroke-opacity=".22"/><g fill="#161b18" stroke="${lightColor}" stroke-width="1.7"><circle cx="83" cy="65" r="8"/><circle cx="104" cy="65" r="8"/><circle cx="83" cy="86" r="8"/><circle cx="104" cy="86" r="8"/></g><path d="M68 101h50v5H68zm-2 12h55v3H66zm0 8h55v3H66zm0 8h55v3H66z" fill="#879080"/><path d="M20 220h104v28H20z" fill="#20251f" stroke="#5e675a"/><circle cx="31" cy="234" r="5" fill="${lightColor}"/></svg></div>
    <div class="pc-face pc-face-back" aria-hidden="true"><svg viewBox="0 0 190 276"><path d="M23 9h144v258H23z" fill="${caseColor}" stroke="#737c6d" stroke-width="2"/><path d="M35 25h120v225H35z" fill="#171a16" stroke="#757e70"/><rect x="45" y="35" width="35" height="75" rx="2" fill="#242a23" stroke="#646e60"/><path d="M52 44h21v9H52zm0 15h21v9H52zm0 15h21v9H52zm0 15h21v9H52" fill="#929c8a"/><circle cx="126" cy="69" r="25" fill="#10130f" stroke="${lightColor}" stroke-width="3"/><circle cx="126" cy="69" r="15" fill="none" stroke="${lightColor}" stroke-opacity=".55" stroke-width="2"/><path d="M94 120h53v4H94zm0 9h53v4H94zm0 9h53v4H94z" fill="#929c8a"/><path d="M46 160h98v70H46z" fill="#212720" stroke="#6a7365"/><path d="M57 172h76v3H57zm0 10h76v3H57zm0 10h76v3H57zm0 10h76v3H57zm0 10h76v3H57z" fill="#717a6c"/><circle cx="153" cy="242" r="3" fill="${lightColor}"/></svg></div>
    <div class="pc-face pc-face-left" aria-hidden="true"><svg viewBox="0 0 140 276"><path d="M5 9h130v258H5z" fill="${caseColor}" stroke="#899181" stroke-width="2"/><path d="M16 26h108v224H16z" fill="#171a16" stroke="#687263"/><path d="M28 47h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28zm0 13h84v4H28z" fill="#929c8a" opacity=".75"/><path d="M28 224h84v9H28z" fill="${lightColor}" opacity=".65"/></svg></div>
    <div class="pc-face pc-face-top" aria-hidden="true"><svg viewBox="0 0 190 135"><defs><linearGradient id="top-shine" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".15"/><stop offset=".2" stop-color="#080a08" stop-opacity=".2"/></linearGradient></defs><path d="M8 16 174 5l8 8v104l-8 9L8 114Z" fill="${caseColor}" stroke="#838d7a" stroke-width="2"/><path d="M18 23 163 15l8 5v83l-8 8-145-8Z" fill="#171b16" stroke="${lightColor}" stroke-opacity=".45"/><path d="m26 31 128-7v66l-128-7z" fill="#222821" stroke="#66705f"/><path d="m34 36 111-6v5L34 41zm0 12 111-6v4L34 52zm0 12 111-6v4L34 64z" fill="${lightColor}" opacity=".36"/><path d="m29 93 127 6-7 7-113-5z" fill="#8a9481" opacity=".35"/><path d="M12 18 177 10v103L12 104Z" fill="url(#top-shine)"/></svg></div>
    <div class="pc-face pc-face-bottom" aria-hidden="true"><svg viewBox="0 0 190 135"><path d="M8 16 174 5l8 8v104l-8 9L8 114Z" fill="${caseColor}" stroke="#838d7a" stroke-width="2"/><path d="M22 25 164 17l5 5v86l-5 6-142-7Z" fill="#141713" stroke="#747e6c"/><path d="m32 35 48-3-2 47-48-2zm68-4 48-3-2 47-48 2z" fill="#20251f" stroke="#77816f"/><path d="m37 42 38-2-1 31-38-2zm68-3 38-2-1 31-38 2z" fill="#30372f"/><path d="m24 94 141 7-5 6-132-7z" fill="${lightColor}" opacity=".35"/><circle cx="21" cy="28" r="3" fill="#b9c2ad"/><circle cx="166" cy="18" r="3" fill="#b9c2ad"/></svg></div>`;
}

function renderComponentArtwork() {
  const gpuOption = builderForm.elements.gpu.selectedOptions[0];
  const cpuOption = builderForm.elements.cpu.selectedOptions[0];
  const gpuName = gpuOption.dataset.model;
  const cpuName = cpuOption.dataset.model;
  const vendorColor = gpuName.startsWith("RX") ? "#b76340" : "#4e5c70";
  const escapeSvgText = (value) => value.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
  const fan = (cx) => `<circle cx="${cx}" cy="36" r="20" fill="#171b17" stroke="#a5b191" stroke-width="2"/><circle cx="${cx}" cy="36" r="14" fill="none" stroke="#727d6b"/><circle cx="${cx}" cy="36" r="4" fill="#bbc5ae"/><path d="M${cx} 22q6 6 0 11q-6-5 0-11m14 14q-6 6-11 0q5-6 11 0m-14 14q-6-6 0-11q6 5 0 11m-14-14q6-6 11 0q-5 6-11 0" fill="#7d8877"/>`;
  gpuArtwork.innerHTML = `<svg viewBox="0 0 190 74" role="img" aria-label="${escapeSvgText(gpuName)} graphics card illustration"><path d="m13 12 147-4 18 8v44l-19 5-146-3-7-8V20z" fill="${vendorColor}" stroke="#828b7d" stroke-width="2"/><path d="M17 17h142v39H17z" fill="#252a24" stroke="#77816e"/>${fan(49)}${fan(94)}${fan(139)}<path d="m177 23 10 3v26l-10 3z" fill="#bfc7b7"/><path d="M42 64v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5m8-5v5" stroke="#bdc6b6" stroke-width="2"/><circle cx="170" cy="17" r="3" fill="${buildOptions.lightColor}"/></svg>`;
  cpuArtwork.innerHTML = `<svg viewBox="0 0 92 74" role="img" aria-label="${escapeSvgText(cpuName)} processor illustration"><defs><linearGradient id="cpu-metal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e4e7dd"/><stop offset=".48" stop-color="#9fa79b"/><stop offset="1" stop-color="#6e786c"/></linearGradient></defs><path d="M18 6h56v7h7v48h-7v7H18v-7h-7V13h7z" fill="url(#cpu-metal)" stroke="#586253" stroke-width="2"/><path d="M25 16h42v42H25z" rx="4" fill="#303831" stroke="#e0e5d9"/><path d="M30 21h32v32H30z" fill="#111812"/><text x="46" y="34" fill="#e2e8dc" font-size="5.4" text-anchor="middle" font-weight="bold">FORGE</text><text x="46" y="42" fill="#d4ff68" font-size="4.6" text-anchor="middle">${escapeSvgText(cpuName.replace("RYZEN ", "R "))}</text><text x="46" y="49" fill="#b0baa9" font-size="3.6" text-anchor="middle">AM5 PROCESSOR</text>${[22,31,40,49,58,67].map((x) => `<path d="M${x} 4v4m0 58v4" stroke="#bbc3b6" stroke-width="2"/>`).join("")}${[18,28,38,48,58].map((y) => `<path d="M8 ${y}h4m66 0h4" stroke="#bbc3b6" stroke-width="2"/>`).join("")}</svg>`;
  document.querySelector("#gpu-model-name").textContent = gpuName;
  document.querySelector("#cpu-model-name").textContent = cpuName;
}

function updateViewer(refreshArtwork = false) {
  const angle = Math.round(((buildOptions.angle % 360) + 360) % 360) % 360;
  buildOptions.angle = angle;
  viewerRange.value = String(angle);
  const tilt = Math.max(-75, Math.min(75, Math.round(buildOptions.tilt)));
  buildOptions.tilt = tilt;
  viewerTilt.value = String(tilt);
  const viewName = tilt > 38 ? "TOP VIEW" : tilt < -38 ? "BASE VIEW" : ["FRONT", "GLASS SIDE", "REAR", "VENT SIDE"][Math.floor(((angle + 45) % 360) / 90)];
  viewerAngle.textContent = `${angle}° · ${viewName}`;
  if (refreshArtwork || !viewerModel.childElementCount) {
    viewerModel.innerHTML = buildPreviewSvg();
    renderComponentArtwork();
  }
  viewerModel.style.transform = `rotateY(${angle}deg) rotateX(${tilt}deg)`;
}

function updateBuildPrice() {
  const upgrades = ["cpu", "gpu", "ram", "storage", "cooling", "motherboard", "psu", "fans"].reduce((total, name) => total + Number(builderForm.elements[name].value), 0);
  builderTotal.textContent = money.format(baseBuildPrice + upgrades);
  updateViewer(true);
}

function updateCompatibility(target) {
  const gpu = builderForm.elements.gpu;
  const cpu = builderForm.elements.cpu;
  const psu = builderForm.elements.psu;
  const cooling = builderForm.elements.cooling;
  const recommendations = [];
  if (target === "gpu" && gpu.value === "230000" && Number(psu.value) < 18000) {
    psu.value = "18000";
    recommendations.push("a 1200W PSU for the RTX 5090");
  } else if (target === "gpu" && gpu.value === "100000" && Number(psu.value) < 7000) {
    psu.value = "7000";
    recommendations.push("a 1000W PSU for the RTX 5080");
  }
  if (target === "cpu" && cpu.value === "44000" && Number(cooling.value) < 9000) {
    cooling.value = "14000";
    recommendations.push("360mm liquid cooling for the Ryzen 9 9950X3D");
  }
  if (recommendations.length) {
    compatibilityNote.textContent = `For this high-performance part, we selected ${recommendations.join(" and ")}. You can still review every component before requesting a quote.`;
    return;
  }
  const warnings = [];
  if (gpu.value === "230000" && Number(psu.value) < 18000) warnings.push("A 1200W PSU is recommended for the RTX 5090.");
  else if (gpu.value === "100000" && Number(psu.value) < 7000) warnings.push("A 1000W PSU is recommended for the RTX 5080.");
  if (cpu.value === "44000" && Number(cooling.value) < 9000) warnings.push("Liquid cooling is recommended for the Ryzen 9 9950X3D.");
  compatibilityNote.textContent = warnings.join(" ") || "All listed parts use a compatible AM5 platform. Final availability is confirmed with your quote.";
}

function openConfigurator(product) {
  const gpuMatch = product.gpu.match(/(4060 Ti|4060|4070 SUPER|5070 Ti|5070|4080 SUPER|5080|5090|9060 XT|9070 XT|7900 XTX)/);
  const gpuValues = { "4060": "0", "4060 Ti": "10000", "4070 SUPER": "25000", "5070": "35000", "5070 Ti": "58000", "4080 SUPER": "60000", "5080": "100000", "5090": "230000", "9060 XT": "8000", "9070 XT": "35000", "7900 XTX": "65000" };
  const gpuValue = gpuMatch ? gpuValues[gpuMatch[1]] : "0";
  builderForm.elements.gpu.value = gpuValue;
  const cpuMatch = product.cpu.match(/(7600|9600X|7800X3D|9800X3D|9900X|9950X)/);
  const cpuValues = { "7600": "0", "9600X": "7000", "7800X3D": "16000", "9800X3D": "24000", "9900X": "26000", "9950X": "44000" };
  if (cpuMatch) builderForm.elements.cpu.value = cpuValues[cpuMatch[1]];
  builderForm.elements.ram.value = product.memory.startsWith("64GB") ? "9000" : "0";
  builderForm.elements.storage.value = product.storage === "4TB" ? "12000" : product.storage === "2TB" ? "5000" : "0";
  builderForm.elements.cooling.value = product.cooling === "360mm" ? "14000" : product.cooling === "240mm" ? "9000" : "0";
  builderForm.elements.motherboard.value = product.motherboard === "X870E" ? "19000" : product.motherboard === "B850" ? "8000" : "0";
  builderForm.elements.psu.value = product.psu === "1200W" ? "18000" : product.psu === "1000W" ? "7000" : "0";
  builderForm.elements.fans.value = product.fans === "10" ? "8000" : product.fans === "6" ? "4500" : "0";
  builderForm.elements.use.value = product.category;
  updateCompatibility();
  buildOptions.angle = 0;
  buildOptions.tilt = 0;
  updateBuildPrice();
  builderDialog.showModal();
}

document.querySelectorAll(".color-swatch[data-case-color]").forEach((button) => {
  button.addEventListener("click", () => {
    buildOptions.caseColor = button.dataset.caseColor;
    buildOptions.caseName = button.dataset.colorName;
    document.querySelector("#case-color-name").textContent = buildOptions.caseName;
    document.querySelectorAll(".color-swatch[data-case-color]").forEach((swatch) => {
      const selected = swatch === button;
      swatch.classList.toggle("is-selected", selected);
      swatch.setAttribute("aria-pressed", String(selected));
    });
    updateViewer(true);
  });
});
document.querySelectorAll(".color-swatch[data-light-color]").forEach((button) => {
  button.addEventListener("click", () => {
    buildOptions.lightColor = button.dataset.lightColor;
    buildOptions.lightName = button.dataset.lightName;
    document.querySelector("#light-color-name").textContent = buildOptions.lightName;
    document.querySelectorAll(".color-swatch[data-light-color]").forEach((swatch) => {
      const selected = swatch === button;
      swatch.classList.toggle("is-selected", selected);
      swatch.setAttribute("aria-pressed", String(selected));
    });
    updateViewer(true);
  });
});

function rotateViewer(amount) {
  buildOptions.angle += amount;
  updateViewer();
}
viewerRange.addEventListener("input", () => {
  buildOptions.angle = Number(viewerRange.value);
  updateViewer();
});
viewerTilt.addEventListener("input", () => {
  buildOptions.tilt = Number(viewerTilt.value);
  updateViewer();
});
document.querySelectorAll("[data-rotate]").forEach((button) => {
  button.addEventListener("click", () => rotateViewer(Number(button.dataset.rotate)));
});
viewer.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, input")) return;
  dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, angle: buildOptions.angle, tilt: buildOptions.tilt };
  viewer.setPointerCapture(event.pointerId);
});
viewer.addEventListener("pointermove", (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  buildOptions.angle = dragState.angle + (dragState.x - event.clientX) * 0.8;
  buildOptions.tilt = dragState.tilt + (event.clientY - dragState.y) * 0.65;
  updateViewer();
});
viewer.addEventListener("pointerup", (event) => {
  if (dragState?.pointerId === event.pointerId) dragState = undefined;
});
viewer.addEventListener("pointercancel", () => { dragState = undefined; });
rotateButton.addEventListener("click", () => {
  const shouldRotate = rotateButton.getAttribute("aria-pressed") !== "true";
  rotateButton.setAttribute("aria-pressed", String(shouldRotate));
  rotateButton.innerHTML = `<span aria-hidden="true">${shouldRotate ? "Ⅱ" : "↻"}</span> ${shouldRotate ? "Pause rotation" : "Auto rotate"}`;
  if (shouldRotate) {
    rotateTimer = window.setInterval(() => rotateViewer(2), 70);
  } else {
    window.clearInterval(rotateTimer);
  }
});
builderDialog.addEventListener("close", () => {
  window.clearInterval(rotateTimer);
  rotateButton.setAttribute("aria-pressed", "false");
  rotateButton.innerHTML = '<span aria-hidden="true">↻</span> Auto rotate';
});

builderForm.addEventListener("change", (event) => {
  updateCompatibility(event.target.name);
  updateBuildPrice();
});
updateBuildPrice();
builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(builderForm);
  const use = data.get("use");
  const cpuChoices = Object.fromEntries([...builderForm.elements.cpu.options].map((option) => [option.value, option.dataset.model]));
  const gpuChoices = Object.fromEntries([...builderForm.elements.gpu.options].map((option) => [option.value, option.dataset.model]));
  const ramChoices = { "0": "32GB DDR5 · 6000 MT/s", "9000": "64GB DDR5 · 6000 MT/s", "23000": "96GB DDR5 · 6000 MT/s" };
  const storageChoices = { "0": "1TB NVMe SSD", "5000": "2TB NVMe SSD", "12000": "4TB NVMe SSD" };
  const coolingChoices = { "0": "Tower air cooler", "9000": "240mm liquid cooler", "14000": "360mm liquid cooler" };
  const motherboardChoices = { "0": "B650 Wi-Fi", "8000": "B850 Wi-Fi", "19000": "X870E Wi-Fi" };
  const psuChoices = { "0": "850W 80+ Gold ATX 3.1", "7000": "1000W 80+ Gold ATX 3.1", "18000": "1200W 80+ Platinum" };
  const fanChoices = { "0": "3 PWM fans", "4500": "6 PWM ARGB fans", "8000": "10 PWM ARGB fans" };
  addToCart({
    id: `custom-${Date.now()}`,
    name: "Your custom FORGE",
    price: Number(builderTotal.textContent.replace(/[^\d]/g, "")),
    color: buildOptions.lightColor,
    caseColor: buildOptions.caseColor,
    caseName: `${buildOptions.caseName} case · ${buildOptions.lightName} lighting`,
    cpu: cpuChoices[data.get("cpu")],
    gpu: gpuChoices[data.get("gpu")],
    memory: ramChoices[data.get("ram")],
    storage: storageChoices[data.get("storage")],
    cooling: coolingChoices[data.get("cooling")],
    motherboard: motherboardChoices[data.get("motherboard")],
    psu: psuChoices[data.get("psu")],
    fans: fanChoices[data.get("fans")],
    category: use
  });
  builderDialog.close();
  cartDialog.showModal();
});

document.querySelector(".cart-trigger").addEventListener("click", () => cartDialog.showModal());
document.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
document.querySelector("#cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.remove) {
    cart.delete(button.dataset.remove);
  } else if (button.dataset.quantity) {
    const item = cart.get(button.dataset.quantity);
    item.quantity += Number(button.dataset.change);
    if (item.quantity <= 0) cart.delete(button.dataset.quantity);
  } else return;
  renderCart();
});
const quoteForm = document.querySelector("#quote-form");
function openQuoteDialog() {
  if (cartDialog.open) cartDialog.close();
  quoteDialog.showModal();
}
document.querySelector("#checkout-button").addEventListener("click", openQuoteDialog);
document.querySelectorAll("[data-open-quote]").forEach((button) => button.addEventListener("click", openQuoteDialog));
quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quoteForm);
  const items = [...cart.values()];
  const buildLines = items.length
    ? items.map((item) => `${item.quantity} x ${item.name} — ${money.format(item.price * item.quantity)}\n${[item.cpu, item.gpu, item.memory, item.storage, item.cooling, item.motherboard, item.psu, item.fans, item.caseName].filter(Boolean).join(" · ")}`).join("\n\n")
    : "No system selected yet — please help me choose a PC.";
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const body = `Hi FORGE team,\n\nPlease prepare a quote for:\n${buildLines}\n\nCurrent estimate: ${money.format(total)}\nName: ${formData.get("name")}\nEmail: ${formData.get("email")}\nCity / PIN: ${formData.get("location") || "Not provided"}\n\nAdditional details:\n${formData.get("notes") || "None"}\n\nPlease confirm current parts availability, final pricing, and delivery.`;
  const subject = `PC build quote request — ${formData.get("name")}`;
  window.location.href = `mailto:hello@forgepc.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  quoteDialog.close();
  showToast("Your email draft is ready — send it to request your quote.");
});
document.querySelector(".cart-browse").addEventListener("click", () => cartDialog.close());

const chatPanel = document.querySelector("#chat-panel");
const chatLauncher = document.querySelector("#chat-launcher");
const chatMessages = document.querySelector("#chat-messages");
const chatInput = document.querySelector("#chat-input");
const chatForm = document.querySelector("#chat-form");
function appendChatMessage(text, kind = "guide", link) {
  const article = document.createElement("article");
  article.className = `chat-message chat-message-${kind}`;
  const label = document.createElement("span");
  label.className = "chat-message-label";
  label.textContent = kind === "visitor" ? "YOU" : "BUILD GUIDE";
  const message = document.createElement("p");
  message.textContent = text;
  article.append(label, message);
  if (link) {
    const linkButton = document.createElement("button");
    linkButton.type = "button";
    linkButton.className = "chat-action-link";
    linkButton.textContent = link.label;
    linkButton.addEventListener("click", link.action);
    article.append(linkButton);
  }
  chatMessages.append(article);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function respondToChat(message) {
  const question = message.toLowerCase();
  if (/warranty|delivery|shipping|ship|support|return/.test(question)) {
    appendChatMessage("Every FORGE system includes our 3-year warranty and insured shipping across India. A person can confirm coverage and delivery for your PIN code over email.", "guide", { label: "Ask the team by email →", action: openQuoteDialog });
    return;
  }
  if (/4k|creator|render|stream/.test(question)) {
    appendChatMessage(`For 4K gaming or creation, start with the Vanta 4080 at ${money.format(223990)}; the Vanta Apex is our top-end option at ${money.format(478990)}. Want to tune the GPU, memory, or storage?`, "guide", { label: "Configure a 4K build →", action: () => { openConfigurator(products.find((product) => product.id === "vanta-4080")); chatPanel.hidden = true; chatLauncher.setAttribute("aria-expanded", "false"); } });
    return;
  }
  if (/1440|qhd|2k|high.?refresh/.test(question)) {
    appendChatMessage(`For 1440p, the Vanta 4070 at ${money.format(149990)} is a strong all-rounder. The builder lets you compare newer GPUs and add more memory or storage.`, "guide", { label: "Configure a 1440p PC →", action: () => { openConfigurator(products.find((product) => product.id === "vanta-4070")); chatPanel.hidden = true; chatLauncher.setAttribute("aria-expanded", "false"); } });
    return;
  }
  if (/budget|cheap|afford|1080|recommend|suggest|start|entry/.test(question)) {
    appendChatMessage(`For a first gaming PC or 1080p, the Vanta 4060 starts at ${money.format(124990)}. Tell me your budget and screen resolution, and I can point you to a closer match.`, "guide", { label: "Explore the 1080p build →", action: () => { openConfigurator(products[0]); chatPanel.hidden = true; chatLauncher.setAttribute("aria-expanded", "false"); } });
    return;
  }
  if (/gpu|graphics|rtx|radeon|processor|cpu|parts|compat|component/.test(question)) {
    appendChatMessage("You can choose from several NVIDIA RTX and AMD Radeon graphics cards, six AMD Ryzen processors, plus RAM, SSD capacity, a B650/B850/X870E motherboard, PSU, cooling, and case fans. The estimate updates as you change parts.", "guide", { label: "Open the parts configurator →", action: () => { builderDialog.showModal(); chatPanel.hidden = true; chatLauncher.setAttribute("aria-expanded", "false"); } });
    return;
  }
  if (/human|person|email|quote|team|contact/.test(question)) {
    appendChatMessage("I’m the instant build guide, not a staffed live agent. Send our team your build and details with the email quote form; your email app opens so you can review and send the request.", "guide", { label: "Prepare an email quote →", action: openQuoteDialog });
    return;
  }
  appendChatMessage("I can help with a PC recommendation, budgets, GPUs and CPUs, build parts, 3D customization, warranty, and delivery. For a personal quote, I can prepare an email to our team.", "guide", { label: "Ask for a quote by email →", action: openQuoteDialog });
}
function sendChatMessage(message) {
  const cleanMessage = message.trim();
  if (!cleanMessage) return;
  appendChatMessage(cleanMessage, "visitor");
  window.setTimeout(() => respondToChat(cleanMessage), 220);
}
chatLauncher.addEventListener("click", () => {
  chatPanel.hidden = !chatPanel.hidden;
  chatLauncher.setAttribute("aria-expanded", String(!chatPanel.hidden));
  if (!chatPanel.hidden) chatInput.focus();
});
document.querySelector(".chat-close").addEventListener("click", () => {
  chatPanel.hidden = true;
  chatLauncher.setAttribute("aria-expanded", "false");
  chatLauncher.focus();
});
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChatMessage(chatInput.value);
  chatInput.value = "";
});
document.querySelector(".chat-quick-prompts").addEventListener("click", (event) => {
  const prompt = event.target.closest("[data-chat-prompt]");
  if (!prompt) return;
  const questions = {
    recommend: "Recommend a PC for gaming",
    budget: "I'm looking for a budget gaming PC",
    warranty: "Tell me about warranty and delivery"
  };
  sendChatMessage(questions[prompt.dataset.chatPrompt]);
});
document.querySelectorAll("[data-open-chat]").forEach((button) => button.addEventListener("click", () => {
  chatPanel.hidden = false;
  chatLauncher.setAttribute("aria-expanded", "true");
  chatInput.focus();
}));

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#primary-nav");
const themeToggle = document.querySelector("#theme-toggle");
function updateThemeToggle() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  themeToggle.title = `Switch to ${isDark ? "light" : "dark"} theme`;
  themeToggle.innerHTML = `<span aria-hidden="true">${isDark ? "☀" : "☾"}</span>`;
}
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("forge-theme", nextTheme);
  updateThemeToggle();
});
updateThemeToggle();
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !isOpen);
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
renderProducts();
renderCart();
