let cart = [];
let total = 0;
let buyerAddress;
const sellerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; 
const connectWalletButton = document.getElementById("connect-wallet-button");

if (typeof window.ethereum !== "undefined") {
  const web3 = new Web3(window.ethereum);

  connectWalletButton.addEventListener("click", async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      buyerAddress = accounts[0];
      alert("Wallet connected successfully!");

      console.log("Connected user's address:", buyerAddress);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Wallet connection failed. Please check MetaMask.");
    }
  });
} else {
  alert("MetaMask is not installed. Please install and configure MetaMask.");
}

function addToCart(itemName, price) {
 
  const isItemInCart = cart.some((item) => item.name === itemName);

  if (isItemInCart) {
    alert("The item is already in the cart.");
  } else {
    cart.push({ name: itemName, price: price });
    updateCart();
  }
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

async function checkout() {
  if (!buyerAddress) {
    alert("Please connect your wallet first.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const selectedPictureNames = cart.map((item) => item.name);

  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed. Please install and configure MetaMask.");
    return;
  }

  try {
    const web3Provider = window.ethereum;
    const web3 = new Web3(web3Provider);

    const buyerBalance = await web3.eth.getBalance(buyerAddress);

    const ethCost = web3.utils.toWei((total * 1e18).toString(), "wei");

    if (buyerBalance < ethCost) {
      alert("Insufficient funds in your wallet. Please add ETH.");
      console.log("Buyer Balance:", buyerBalance.toString());
      console.log("ETH Cost:", ethCost.toString());

      return;
    }

    
    const transaction = {
      from: buyerAddress,
      to: sellerAddress,
      value: ethCost,
      gas: 50000, 
      gasPrice: web3.utils.toWei("30", "gwei"),
    };

    const tx = await web3.eth.sendTransaction(transaction);
    console.log("Transaction hash:", tx.transactionHash);

    cart = [];
    updateCart();

    
    const pictureElements = document.querySelectorAll(".picture");
    pictureElements.forEach((picture) => {
      const pictureName = picture.querySelector("img").alt;
      if (selectedPictureNames.includes(pictureName)) {
        picture.style.display = "none";
      }
    });

    alert("Payment successful! ETH sent to the seller.");
  } catch (error) {
    console.error("Payment processing error:", error);
    alert("Payment processing failed. Please try again.");
  }
}
