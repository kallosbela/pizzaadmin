// load  orders
const loadOrdersData = async () => {
  const response = await fetch("http://localhost:3000/orders");
  const ordersData = await response.json();
  return ordersData;
};

let ordersData //ordersData is global !

// visszaküldjük a megváltozott státuszt a backendre 
const sendOrderData = async (newOrderData,index) => {
  const pack = {
    filename: ordersData[0][index-1],
    filecontent: newOrderData
  }
  const rawResponse = await fetch('http://localhost:3000/status', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pack)
    });
    const content = await rawResponse.json();
    console.log(content);
}

// create one order card
const orderComponent = (order,index) => {
  console.log(index,order)
  const date = new Date(order.timeOfOrder)
  return `
    <div class="orderCard">
      <div class="fileName">
        ${ordersData[0][index-1]}
      </div>
      <div class="date">
        ${date.toLocaleString()}
      </div>
      <div class="date">
        ${order.customerData.name}
      </div>
      <div class="address">
        ${order.customerData.zipcode}\ 
        ${order.customerData.city}<br> 
        ${order.customerData.street}\ 
        ${order.customerData.houseNum} 
      </div>
      <div class="phone_email">
        ${order.customerData.phoneNum} <br> 
        ${order.customerData.email}
      </div>
      <div class="details">
        ${order.pizzaProduct.replaceAll("\n","<br>")}\  
      </div>
      <button id='status${index}' class="status" onClick={changeStatus}>
        ${order.status}\
      </button>

    </div>
    `
}

// status button 
const changeStatus = (event) => {
  const status1 = "új rendelés";
  const status2 = "szállítás alatt";
  const status3 = "rendelés teljesítve";
  const orderIndex = event.target.id.slice(6)
  
  const text = event.target.innerText
  if (text === status1) {
    event.target.innerText = status2
  } else if (text === status2) {
    event.target.innerText = status3
  } else {
    event.target.innerText = status1
  }
  
  // visszaküldjük a megváltozott státuszt 
  ordersData[orderIndex-1].status = event.target.innerText
  sendOrderData(ordersData[orderIndex-1],orderIndex)
};

// pizzas to screen
const init = async () => {
  // all pizzas data here
  ordersData = await loadOrdersData();
  console.log(ordersData);

  const ordersContainer = document.querySelector("#ordersContainer");
  let content = ""
  for (let i=1; i<=ordersData.length-1; i++) {
    content += orderComponent(ordersData[i],i)
  }
  ordersContainer.innerHTML = content

  const statusButtons = document.getElementsByClassName("status"); //edit and save buttons
  for (const btn of statusButtons) {
    btn.addEventListener("click", changeStatus);
  }
};

init();

