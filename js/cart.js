// Setting up local storage
class CartItem {
  constructor(name, img, price) {
    this.name = name;
    this.img = img;
    this.price = price;
    this.quantity = 1;
  }
}

// Setting up local storage
class LocalCart {
  static key = "cartItems";

  static getLocalCartItems() {
    let cartMap = new Map();
    const cart = localStorage.getItem(LocalCart.key);
    if (cart === null || cart.length === 0) return cartMap;
    return new Map(Object.entries(JSON.parse(cart)));
  }

  static addItemToLocalCart(id, item) {
    let cart = LocalCart.getLocalCartItems();
    if (cart.has(id)) {
      let mapItem = cart.get(id);
      mapItem.quantity += 1;
      cart.set(id, mapItem);
    } else cart.set(id, item);
    localStorage.setItem(
      LocalCart.key,
      JSON.stringify(Object.fromEntries(cart))
    );
    updateCartUI();
  }

  static removeItemFromCart(id) {
    let cart = LocalCart.getLocalCartItems();
    if (cart.has(id)) {
      let mapItem = cart.get(id);
      if (mapItem.quantity > 1) {
        mapItem.quantity -= 1;
        cart.set(id, mapItem);
      } else cart.delete(id);
    }
    if (cart.length === 0) localStorage.clear();
    else
      localStorage.setItem(
        LocalCart.key,
        JSON.stringify(Object.fromEntries(cart))
      );
    updateCartUI();
  }
}

// Display cart on hover and hide cart when cursor is away from body
const cartIcon = document.querySelector(".bi-bag");
const wholeCartWindow = document.querySelector(".whole-cart-window");
wholeCartWindow.inWindow = 0;
const addToCartBtns = document.querySelectorAll(".add-cart");
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", addItemFunction);
});

// Add item to cart
function addItemFunction(e) {
  const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
  const img = e.target.parentElement.parentElement.previousElementSibling.src;
  const name = e.target.parentElement.previousElementSibling.textContent;
  let price = e.target.parentElement.children[0].textContent;
  price = price.replace("R", '')
  const item = new CartItem(name, img, price);
  LocalCart.addItemToLocalCart(id, item);
  alert("Item added to cart");
  console.log(price);
}

// Event listeners for mouse movement over cart area icon
cartIcon.addEventListener("mouseover", () => {
  if (wholeCartWindow.classList.contains("hide"))
    wholeCartWindow.classList.remove("hide");
});

cartIcon.addEventListener("mouseleave", () => {
  // if(wholeCartWindow.classList.contains('hide'))
  setTimeout(() => {
    if (wholeCartWindow.inWindow === 0) {
      wholeCartWindow.classList.add("hide");
    }
  }, 500);
});

wholeCartWindow.addEventListener("mouseover", () => {
  wholeCartWindow.inWindow = 1;
});

wholeCartWindow.addEventListener("mouseleave", () => {
  wholeCartWindow.classList.add("hide");
  wholeCartWindow.inWindow = 0;
});

// Displays the carts UI once new items are added
function updateCartUI(){
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=""
    const items = LocalCart.getLocalCartItems()
    if(items === null) return
    let count = 0
    let total = 0
    for(const [key, value] of items.entries()){
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price * value.quantity
        price = Math.round(price*100)/100
        count+=1
        total += price
        total = Math.round(total*100)/100
        cartItem.innerHTML = `
                             <img src="${value.img}" alt="">
                                <div class="details">
                                <h3>${value.name}</h3>
                                    <p>
                                        <span class="quantity">${value.quantity}</span>
                                        <span class="price">R ${price}</span>
                                    </p>
                                    </div>
                                <div class="cancel"><i class="bi bi-x-circle-fill"></i></div>
    `;
    cartItem.lastElementChild.addEventListener("click", () => {
      LocalCart.removeItemFromCart(key);
    });
    cartWrapper.append(cartItem);
  }

  if (count > 0) {
    cartIcon.classList.add("non-empty");
    let root = document.querySelector(":root");
    root.style.setProperty("--after-content", `"${count}"`);
    const subtotal = document.querySelector(".subtotal");
    subtotal.innerHTML = `SubTotal:R ${total}`;
  } else 
    cartIcon.classList.remove("non-empty");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});


// Filter by categories
function apparel(){
  document.getElementById("sneaker").style.display = "none";
  document.getElementById("accessories").style.display = "none";
}

function sneakers(){
  document.getElementById("apparel").style.display = "none";
  document.getElementById("accessories").style.display = "none"; 
}

function showAll(){
  document.getElementById("sneaker").style.display = "block";
  document.getElementById("apparel").style.display = "block";
  document.getElementById("accessories").style.display = "block";  
}

function accessories(){
  document.getElementById("sneaker").style.display = "none";
  document.getElementById("apparel").style.display = "none"; 
}

