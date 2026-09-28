const products = [
  { id: "vanta-4060", name: "Vanta 4060", badge: "PLAYER FAVORITE", category: "1080p", label: "1080P GAMING", description: "Your smooth, high-FPS entry into the game.", cpu: "RYZEN 5 7600", gpu: "RTX 4060 8GB", memory: "32GB DDR5", price: 124990, rating: "4.9", reviews: 128, color: "#9ed647", caseColor: "#252923" },
  { id: "vanta-4070", name: "Vanta 4070", badge: "BEST FOR 1440P", category: "1440p", label: "1440P GAMING", description: "Crisp detail and beautifully fluid frames.", cpu: "RYZEN 7 7700", gpu: "RTX 4070 SUPER", memory: "32GB DDR5", price: 184990, rating: "4.9", reviews: 86, color: "#d9ff53", caseColor: "#252923" },
  { id: "spectre-4070", name: "Spectre 4070", badge: "QUIET POWER", category: "1440p", label: "1440P GAMING", description: "Big performance. Clean, understated presence.", cpu: "RYZEN 7 7800X3D", gpu: "RTX 4070 SUPER", memory: "32GB DDR5", price: 209990, rating: "5.0", reviews: 43, color: "#78bfd1", caseColor: "#282b2c" },
  { id: "vanta-4080", name: "Vanta 4080", badge: "4K READY", category: "4k", label: "4K & CREATOR", description: "No compromises for ultra settings and big ideas.", cpu: "RYZEN 7 7800X3D", gpu: "RTX 4080 SUPER", memory: "64GB DDR5", price: 299990, rating: "4.9", reviews: 62, color: "#d69d68", caseColor: "#292623" },
  { id: "spectre-4080", name: "Spectre Studio", badge: "CREATOR PICK", category: "4k", label: "4K & CREATOR", description: "A powerhouse for play, streams, and creation.", cpu: "RYZEN 9 9900X", gpu: "RTX 4080 SUPER", memory: "64GB DDR5", price: 339990, rating: "5.0", reviews: 29, color: "#ba9bdf", caseColor: "#28252e" },
  { id: "vanta-4090", name: "Vanta Apex", badge: "NO LIMITS", category: "4k", label: "4K & CREATOR", description: "Our most powerful build. Full stop.", cpu: "RYZEN 9 9950X", gpu: "RTX 4090 24GB", memory: "64GB DDR5", price: 429990, rating: "5.0", reviews: 17, color: "#eb7373", caseColor: "#2c2424" }
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
        <div class="product-specs"><span>${product.cpu}</span><span>${product.gpu}</span><span>${product.memory}</span></div>
        <div class="product-rating"><strong>★ ${product.rating}</strong> &nbsp;·&nbsp; ${product.reviews} player reviews</div>
        <div class="product-bottom"><span class="product-price">${money.format(product.price)}<small>Incl. taxes · Free shipping</small></span><button class="add-to-cart" type="button" data-add="${product.id}">Add to bag</button></div>
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
      <p class="cart-item-specs">${[item.cpu, item.gpu, item.memory].filter(Boolean).join(" · ")}</p>
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
  const product = products.find((item) => item.id === (button.dataset.add || button.dataset.favorite));
  if (!product) return;
  if (button.hasAttribute("data-add")) {
    addToCart(product);
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
function updateBuildPrice() {
  const upgrades = ["cpu", "gpu", "ram"].reduce((total, name) => total + Number(builderForm.elements[name].value), 0);
  const use = builderForm.elements.use.value;
  const usePremium = use === "4k" ? 15000 : use === "1440p" ? 5000 : 0;
  builderTotal.textContent = money.format(baseBuildPrice + upgrades + usePremium);
}
builderForm.addEventListener("change", updateBuildPrice);
updateBuildPrice();
builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(builderForm);
  const use = data.get("use");
  const cpuChoices = { "0": "RYZEN 5 7600", "16000": "RYZEN 7 7800X3D", "32000": "RYZEN 9 9900X" };
  const gpuChoices = { "0": "RTX 4060 8GB", "25000": "RTX 4070 SUPER", "60000": "RTX 4080 SUPER" };
  const ramChoices = { "0": "32GB DDR5", "9000": "64GB DDR5" };
  addToCart({
    id: `custom-${Date.now()}`,
    name: "Your custom FORGE",
    price: Number(builderTotal.textContent.replace(/[^\d]/g, "")),
    color: "#d9ff53",
    caseColor: "#252923",
    cpu: cpuChoices[data.get("cpu")],
    gpu: gpuChoices[data.get("gpu")],
    memory: ramChoices[data.get("ram")],
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
document.querySelector("#checkout-button").addEventListener("click", () => {
  const summary = [...cart.values()].map((item) => `${item.quantity} x ${item.name} — ${money.format(item.price * item.quantity)}`).join("\n");
  const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
  const body = `Hi FORGE team,\n\nI'd like a quote for:\n${summary}\n\nEstimated total: ${money.format(total)}\n\nPlease get in touch about availability and delivery.`;
  window.location.href = `mailto:hello@forgepc.in?subject=${encodeURIComponent("My FORGE PC build quote")}&body=${encodeURIComponent(body)}`;
});
document.querySelector(".cart-browse").addEventListener("click", () => cartDialog.close());

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#primary-nav");
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
