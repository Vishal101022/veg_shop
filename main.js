function handleFormSubmit(event) {
  event.preventDefault();

  const vegDetails = {
    name: event.target.name.value,
    price: event.target.price.value,
    quantity: parseInt(event.target.quantity.value),
  };

  console.log(vegDetails);

  axios
    .post("https://shops.free.beeceptor.com/", vegDetails)
    .then((response) => displayUserOnScreen(response.data))
    .catch((error) => console.log(error));

  // Clear the input fields
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
}

window.addEventListener("DOMContentLoaded", (event) => {
  axios
    .get("https://shops.free.beeceptor.com/")
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        displayUserOnScreen(response.data[i]);
        updateTotalItems();
      }
    })
    .catch((error) => console.log(error));
});

function displayUserOnScreen(vegDetails) {
  const vegItem = document.createElement("li");

  vegItem.appendChild(
    document.createTextNode(
      `${vegDetails.name}    Rs. ${vegDetails.price}    ${vegDetails.quantity}KG`
    )
  );

  const inputField = document.createElement("input");
  inputField.setAttribute("type", "number");
  inputField.setAttribute("min", "1");
  inputField.setAttribute("placeholder", "Quantity to buy");
  vegItem.appendChild(inputField);

  const buyBtn = document.createElement("button");
  buyBtn.appendChild(document.createTextNode("Buy"));
  vegItem.appendChild(buyBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  vegItem.appendChild(deleteBtn);

  const vegList = document.querySelector("ul");
  vegList.appendChild(vegItem);

  updateTotalItems();

  deleteBtn.addEventListener("click", function (event) {
    vegList.removeChild(event.target.parentElement);
    updateTotalItems();
  });

  // Buy item logic
  buyBtn.addEventListener("click", function () {
    const buyQuantity = parseInt(inputField.value);
    const availableQuantity = parseInt(vegDetails.quantity);

    if (!isNaN(buyQuantity) && buyQuantity > 0) {
      if (buyQuantity <= availableQuantity) {
        vegDetails.quantity = availableQuantity - buyQuantity;
        vegItem.firstChild.nodeValue = `${vegDetails.name}    Rs. ${vegDetails.price}    ${vegDetails.quantity}KG`;

        if (vegDetails.quantity === 0) {
          vegList.removeChild(vegItem);
          updateTotalItems();
        }
      } else {
        alert("Not enough quantity available to buy.");
      }
    } else {
      alert("Please enter a valid quantity to buy.");
    }
  });
}

function updateTotalItems() {
  const vegList = document.querySelector("ul");
  const totalElement = document.getElementById("total");
  const totalItems = vegList.children.length;
  totalElement.textContent = `Total Items: ${totalItems}`;
}
