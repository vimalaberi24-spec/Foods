// ================= FOOD DATA =================
const foodData = [
  { id: 1, name: "Margherita Pizza", price: 399.99, category: "pizza", image: "img/food/p1.jpg", description: "Classic pizza" },
  { id: 2, name: "Pepperoni Pizza", price: 499.99, category: "pizza", image: "img/category/pizza.jpg", description: "Pepperoni cheese pizza" },
  { id: 3, name: "Cheeseburger", price: 299.99, category: "burger", image: "img/food/b1.jpg", description: "Beef burger" },
  { id: 4, name: "Chicken Burger", price: 299.99, category: "burger", image: "img/category/burger.jpg", description: "Chicken burger" },
  { id: 5, name: "Club Sandwich", price: 199.99, category: "sandwich", image: "img/food/s1.jpg", description: "Club sandwich" },
  { id: 6, name: "Veggie Sandwich", price: 99.99, category: "sandwich", image: "img/category/sandwich.jpg", description: "Veg sandwich" }
];

// ================= GLOBAL VARIABLES =================
let cart = [];

// DOM
const cartLink = document.getElementById("cartLink");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");
const featuredFoods = document.getElementById("featuredFoods");
const checkoutBtn = document.getElementById("checkoutBtn");

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();

  if (featuredFoods) displayFeaturedFoods();
  updateCartUI();

  // Cart open
  if (cartLink) {
    cartLink.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }

  if (closeCart) closeCart.addEventListener("click", closeCartModal);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }

  // Close modal
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCartModal();
  });

  // Page specific
  if (document.querySelector(".menu-page")) {
    displayMenuFoods();
    setupFilterButtons();
  }

  if (window.location.pathname.includes("orders.html")) {
    displayOrders();
  }

  if (document.querySelector(".contact-page")) {
    setupContactForm();
  }
});

// ================= DISPLAY FEATURED =================
function displayFeaturedFoods() {
  featuredFoods.innerHTML = "";

  foodData.slice(0, 3).forEach((food) => {
    featuredFoods.innerHTML += `
      <div class="food-card">
        <img src="${food.image}">
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <p>₹${food.price}</p>
        <button onclick="addToCart(${food.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ================= MENU =================
function displayMenuFoods(category = "all") {
  const menuFoods = document.getElementById("menuFoods");
  if (!menuFoods) return;

  menuFoods.innerHTML = "";

  const filtered = category === "all"
    ? foodData
    : foodData.filter(f => f.category === category);

  filtered.forEach(food => {
    menuFoods.innerHTML += `
      <div class="food-card">
        <img src="${food.image}">
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <p>₹${food.price}</p>
        <button onclick="addToCart(${food.id})">Add to Cart</button>
      </div>
    `;
  });
}

function setupFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayMenuFoods(btn.dataset.category);
    });
  });
}

// ================= CART =================
function addToCart(id) {
  const item = foodData.find(f => f.id === id);
  if (!item) return;

  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCartToLocalStorage();
  updateCartUI();
  alert(item.name + " added!");
}

function updateCartUI() {
  if (cartCount) {
    cartCount.textContent = cart.reduce((t, i) => t + i.quantity, 0);
  }

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Cart is empty</p>";
    if (cartTotal) cartTotal.textContent = "0";
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div>
        <h4>${item.name}</h4>
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        ${item.quantity}
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
        ₹${(item.price * item.quantity).toFixed(2)}
        <button onclick="removeFromCart(${item.id})">X</button>
      </div>
    `;
  });

  if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(id);

  saveCartToLocalStorage();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCartToLocalStorage();
  updateCartUI();
}

// ================= CART MODAL =================
function openCart() {
  if (cartModal) cartModal.style.display = "flex";
}

function closeCartModal() {
  if (cartModal) cartModal.style.display = "none";
}

// ================= CHECKOUT =================
function checkout() {
  if (cart.length === 0) {
    alert("Cart empty!");
    return;
  }

  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  window.location.href = "checkout.html";
}

// ================= STORAGE =================
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const data = localStorage.getItem("cart");
  if (data) cart = JSON.parse(data);
}

// ================= CONTACT =================
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message sent!");
    form.reset();
  });
}

// ================= ORDERS =================
function displayOrders() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders</p>";
    return;
  }

  container.innerHTML = "";

  orders.reverse().forEach(order => {
    let items = "";

    order.items.forEach(i => {
      items += `<p>${i.name} x ${i.quantity}</p>`;
    });

    container.innerHTML += `
      <div>
        <h3>${new Date(order.timestamp).toLocaleString()}</h3>
        ${items}
        <h4>Total ₹${order.total}</h4>
      </div>
    `;
  });
}
