let cart = [];
let total = 0;

function addToCart(itemName, price) {
  cart.push({ name: itemName, price: price });
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  cartList.innerHTML = "";
  total = 0;

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${item.name} - $${item.price}`;
    cartList.appendChild(listItem);
    total += item.price;
  });

  totalPriceElement.textContent = total;
}

function checkout() {
  const selectedPictureNames = cart.map((item) => item.name);

  const pictureElements = document.querySelectorAll(".picture");
  pictureElements.forEach((picture) => {
    const pictureName = picture.querySelector("img").alt;
    if (selectedPictureNames.includes(pictureName)) {
      picture.style.display = "none";
    }
  });

  // Clear the cart and update the cart display
  cart = [];
  updateCart();
  alert("Thanks for shopping");
}
