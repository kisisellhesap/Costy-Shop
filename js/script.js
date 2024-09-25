const productListDiv = document.querySelector(".product-list");
const cardListDiv = document.querySelector(".card-list");
const cardIcon = document.querySelector(".card-icon");
const backHome = document.querySelector(".back-home");
const cardTotalPrice = document.querySelector(".card-total-price");
const homeWrapper = document.querySelector(".home-wrapper");
const cardWrapper = document.querySelector(".card-wrapper");
const productWrapper = document.querySelector(".product-wrapper");

const onePage = document.querySelector(".one-page");

const homeContainer = document.querySelector(".home");
const errorDiv = document.querySelector(".error");
const openNav = document.querySelector("#open-menu");
const closeNav = document.querySelector("#close-menu");

let cardList = JSON.parse(localStorage.getItem("cardList")) || [];

window.onload = function () {
  const cardMode = localStorage.getItem("cardMode") === "true"; // localStorage'dan cardMode'u okuyoruz
  updateView(cardMode); // Sayfayı güncelliyoruz
};

const getJson = async () => {
  const response = await fetch("./db.json");
  const data = await response.json();
  return data;
};

const dataList = await getJson();

function updateView(isCardMode) {
  // console.log(isCardMode);
  if (isCardMode) {
    onePage.classList.remove("on-mode");
    cardWrapper.classList.add("on-mode");
  } else {
    onePage.classList.add("on-mode");
    cardWrapper.classList.remove("on-mode");
  }
}

const displayData = () => {
  dataList.map((item) => {
    const itemDiv = createItem(item.id, item.title, item.price, item.image);
    productListDiv.insertAdjacentHTML("beforeend", itemDiv);
  });
};
const createItem = (id, title, price, image) => {
  let item = `
     <div class="product-card" data-id="${id}" >
              <div class="product-header">
                <img
                  src="${image}"
                  alt="${image}"
                />
                <p class="product-name">${title}</p>
                <p class="product-price-content">$ <span> ${price} </span></p>
              </div>
              <button class="add-btn">Add To Cart</button>
            </div>

    `;

  return item;
};
displayData();

const displayQuantity = () => {
  let totalLength = 0;

  for (const item of cardList) {
    let keep = item.quantity;
    totalLength += keep;
  }

  cardIcon.children[0].setAttribute("data-quantiy", totalLength);
};

const saveLs = () => {
  localStorage.setItem("cardList", JSON.stringify(cardList));

  displayQuantity();
};

const addBtns = document.querySelectorAll(".add-btn");

const addCard = (e) => {
  const item = e.target.parentElement;
  const id = item.getAttribute("data-id");
  const title = item.children[0].children[1].textContent.trim();
  const price = Number(
    item.children[0].children[2].children[0].textContent.trim()
  );
  const image = item.children[0].children[0].src;
  const uniqueCheck = cardList.some((item) => item.id === id);

  let quantity = 1;
  let totalPrice = (price * quantity).toFixed(2);

  // console.log(price, quantity, totalPrice);

  if (!uniqueCheck) {
    cardList.push({
      id,
      image,
      title,
      price,
      quantity,
      totalPrice,
    });
    setTimeout(() => {
      errorDiv.classList.remove("error-active");
    }, 1000);
    showError("Add To Card", "#3EC972");
    errorDiv.classList.add("error-active");
  } else {
    setTimeout(() => {
      errorDiv.classList.remove("error-active");
    }, 1000);
    showError("Item has already on your cardList", "#F7E6A4");
    errorDiv.classList.add("error-active");
    // console.log(item);
  }

  displayCard();
};

for (const addBtn of addBtns) {
  addBtn.addEventListener("click", addCard);
}

const createCard = (id, title, totalPrice, image, quantity) => {
  let card = `

                      <div class="card-item" data-id="${id}">
                    <img
                      src="${image}"
                      alt="${image}"
                    />
                    <div class="card-item-info">
                      <p class="card-item-name">${title}</p>
                      <input type="text" class="card-item-quantity" value="${quantity}" maxLength="2" />
                    </div>
                    <p class="card-item-price">$ <span class="card-price">${totalPrice} </span></p>
                    <button class="remove-btn">Remove</button>
                  </div>

      `;

  return card;
};
const changeThePrice = (e) => {
  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  let piece = Number(e.target.value.trim().replace(/\D/g, "1"));
  if (piece === "" || piece === 0) {
    piece = 1;
  }
  cardList.map((item) => {
    if (item.id === id) {
      item.quantity = piece;
      item.totalPrice = (item.quantity * item.price).toFixed(2);
    }
  });
  displayCard();
};

const inputAddToClick = () => {
  const inputBtns = document.querySelectorAll(".card-item-quantity");
  for (const input of inputBtns) {
    input.addEventListener("input", changeThePrice);
  }
};
const CardListTotalPrice = () => {
  let totalPrice = 0;
  cardList.map((item) => {
    totalPrice += Number(item.totalPrice);
  });
  cardTotalPrice.textContent = `$ ${totalPrice.toFixed(2)}`;
};
const displayCard = () => {
  cardListDiv.innerHTML = "";
  cardList.map((card) => {
    let cardItem = createCard(
      card.id,
      card.title,
      card.totalPrice,
      card.image,
      card.quantity
    );

    cardListDiv.insertAdjacentHTML("beforeend", cardItem);
  });
  removeAddToClick();
  inputAddToClick();
  CardListTotalPrice();
  saveLs();
  console.log(cardList, "dizi");
};

const removeCard = (e) => {
  const id = e.target.parentElement.getAttribute("data-id");

  cardList = cardList.filter((item) => item.id !== id);

  setTimeout(() => {
    errorDiv.classList.remove("error-active");
  }, 1000);
  showError("Remove Item", "#E55969");
  errorDiv.classList.add("error-active");
  // console.log(e.target);

  displayCard();
};

const removeAddToClick = () => {
  const removeBtns = document.querySelectorAll(".remove-btn");

  for (const removeBtn of removeBtns) {
    removeBtn.addEventListener("click", removeCard);
  }
};
displayCard();

cardIcon.addEventListener("click", () => {
  localStorage.setItem("cardMode", "true");
  updateView(true);
});

backHome.addEventListener("click", () => {
  localStorage.setItem("cardMode", "false");
  updateView(false);
});

const showError = (message, color) => {
  errorDiv.textContent = message;
  errorDiv.style.backgroundColor = color;
};

openNav.addEventListener("click", () => {
  document.querySelector("nav").classList.add("nav-active");
});

closeNav.addEventListener("click", () => {
  document.querySelector("nav").classList.remove("nav-active");
});
