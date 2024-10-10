async function handleFormSubmit(event) {
  event.preventDefault();

  const vegDetails = {
    name: event.target.name.value,
    price: event.target.price.value,
    quantity: parseInt(event.target.quantity.value),
  };

  // axios post api
  let response;
  try {
    response = await axios.post(
      "https://crudcrud.com/api/fd278a11c2be426dac44731a2cba866e/shop",
      vegDetails
    );
    console.log(response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }

  // Clear the input fields
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";

  displayUserOnScreen(response.data);
  updateTotalItems();
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get(
      "https://crudcrud.com/api/fd278a11c2be426dac44731a2cba866e/shop"
    );
    for (let i = 0; i < response.data.length; i++) {
      displayUserOnScreen(response.data[i]);
      updateTotalItems();
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
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
  deleteBtn.addEventListener("click", (event) =>
    handleDelete(event, vegList, vegDetails)
  );

  buyBtn.addEventListener("click", () =>
    handleBuy(vegDetails, inputField, vegItem, vegList)
  );
}

function updateTotalItems() {
  const vegList = document.querySelector("ul");
  const totalElement = document.getElementById("total");
  const totalItems = vegList.children.length;
  totalElement.textContent = `Total Items: ${totalItems}`;
}

async function handleDelete(event, vegList, vegDetails) {
  vegList.removeChild(event.target.parentElement);
  updateTotalItems();
  deleteVeg(vegDetails);
}

function handleBuy(vegDetails, inputField, vegItem, vegList) {
  const buyQuantity = parseInt(inputField.value);
  const availableQuantity = parseInt(vegDetails.quantity);

  if (!isNaN(buyQuantity) && buyQuantity > 0) {
    if (buyQuantity <= availableQuantity) {
      vegDetails.quantity = availableQuantity - buyQuantity;
      vegItem.firstChild.nodeValue = `${vegDetails.name}    Rs. ${vegDetails.price}    ${vegDetails.quantity}KG`;
      inputField.value = "";

      if (vegDetails.quantity === 0) {
        vegList.removeChild(vegItem);
        deleteVeg(vegDetails);
        updateTotalItems();
      } else {
        updateVegQuantity(vegDetails);
      }
    } else {
      alert("Not enough quantity available to buy.");
    }
  } else {
    alert("Please enter a valid quantity to buy.");
  }
}

// update api
async function updateVegQuantity(vegDetails) {
  console.log("inside updateVegQuantity");
  console.log(vegDetails);
  try {
    const response = await axios.put(
      `https://crudcrud.com/api/fd278a11c2be426dac44731a2cba866e/shop/${vegDetails._id}`,
      {
        name: vegDetails.name,
        price: vegDetails.price,
        quantity: vegDetails.quantity,
      }
    );
    console.log(response);
  } catch (error) {
    console.log("Error: ", error.message);
  }
}

// delete api
async function deleteVeg(vegDetails) {
  try {
    const response = await axios.delete(
      `https://crudcrud.com/api/fd278a11c2be426dac44731a2cba866e/shop/${vegDetails._id}`
    );
    console.log(response);
  } catch (error) {
    console.log("Error:", error.message);
  }
}
