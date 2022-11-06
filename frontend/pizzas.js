// load  pizza.json
const loadPizzasData = async () => {
  const response = await fetch("http://localhost:3000/pizzas");
  const pizzasData = await response.json();
  return pizzasData;
};

let pizzasData //pizzasData is global !

const sendPizzasData = async (newPizzasData) => {
  const rawResponse = await fetch('http://localhost:3000/modify', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPizzasData)
    });
    const content = await rawResponse.json();
    console.log(content);
}

// create one pizza card
const pizzaComponent = (pizza) => {
  return `
    <div class="pizzaCard">
        <div class="pizzaImageName">
            <img src="${pizza.imgUrl}" class="pizzaSmallImgs">
            <div class="pizzaNameIngredients">
                <input id="${
                  "name" + pizza.id
                }" class="inputName" type="text" value="${
    pizza.name
  }" disabled="true"/>
                <input id="${
                  "ingr" + pizza.id
                }" class="inputIngred" type="text" value="${
    pizza.ingredients
  }" disabled="true"/>
                <input id="${
                  "pric" + pizza.id
                }" class="inputPrice" type="number" value=${
    pizza.price
  } disabled="true"/> Ft
            </div>
        </div>
        <div class="addContainer">
          <button id="${
            "modi" + pizza.id
          }" class="modify" onClick={modifyPizza}>
            <img src="/public/img/edit.png">
          </button>
          <button class="delete" onClick={deletePizza}>
            <img src="/public/img/delete.png">
          </button>
          <button class="status" onClick={statusPizza}>active</button>
        </div>
    </div>
        `;
};

// modify button (edit and save)
const modifyPizza = (event) => {
  const editUrl = "http://localhost:3000/public/img/edit.png";
  const saveUrl = "http://localhost:3000/public/img/save.png";
  const img = event.target.querySelector("img");
  const pizzaID = event.target.id.slice(4)
  const inputName = document.getElementById("name" + pizzaID)
  const inputIngredients = document.getElementById("ingr" + pizzaID)
  const inputPrice = document.getElementById("pric" + pizzaID)
  if (img.src === editUrl) {
    inputName.disabled = false
    inputIngredients.disabled = false
    inputPrice.disabled = false
    img.src = saveUrl;
  } else {
    inputName.disabled = true;
    inputIngredients.disabled = true;
    inputPrice.disabled = true;
    img.src = editUrl;
    
    for (const pizza of pizzasData) {
      if (pizza.id===pizzaID) {
        pizza.name=inputName.value
        pizza.ingredients=inputIngredients.value
        pizza.price=inputPrice.value
        sendPizzasData(pizzasData)
      }
    }


  }
};

// pizzas to screen
const init = async () => {
  // all pizzas data here
  pizzasData = await loadPizzasData();

  const pizzaCardContainer = document.querySelector("#pizzaCardContainer");
  pizzaCardContainer.innerHTML = pizzasData.map(pizzaComponent).join(" ");

  const modifyButtons = document.getElementsByClassName("modify"); //edit and save buttons
  console.log(modifyButtons);
  for (const btn of modifyButtons) {
    btn.addEventListener("click", modifyPizza);
  }
};

init();

