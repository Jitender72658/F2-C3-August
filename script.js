let url = "https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json";
document.cookie = "session_id=123; SameSite=none; Secure";
let items = [];

async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error fetching data: ' + error);
    }
  }
  
  async function fetchAndDisplayItems(url) {
    try {
      const data = await fetchData(url);
  
      data.forEach(object => {
        items.push(object);
      });
  
      getMenu(items); // Assuming displayItems is a function that displays the items
      let orders =takeOrder();
    } catch (error) {
      console.error(error.message);
    }
  }

// fetching and loading data at starting
fetchAndDisplayItems(url);
let itemSection = document.getElementById('itemSection');

// getMenu function for displaying data
function getMenu(items){
     itemSection.innerHTML=""; 
   for(let i =0;i<items.length;i++){
        let cardDiv = document.createElement('div');
        cardDiv.className="box";
        let imageDiv = document.createElement('div');
        const imgElement = document.createElement('img');
        imgElement.src=items[i]["imgSrc"];
        imgElement.alt = 'Image Description';
        imageDiv.appendChild(imgElement);
        
        let infoDiv = document.createElement('div');
        let itemDetails = document.createElement('div');
        itemDetails.className="details-div";
        let itemName = document.createElement('h3');
        itemName.innerText=`${items[i]["name"]}`;
        let itemPrice = document.createElement('p');
         itemPrice.innerText = `$ ${items[i]["price"]}`;
         itemDetails.appendChild(itemName);
         itemDetails.appendChild(itemPrice);
        let addToOrderDiv = document.createElement('div');
        addToOrderDiv.className="add-to-order-div"
         addToOrderDiv.innerHTML = `<button>+</button>`;
        infoDiv.appendChild(itemDetails);
        infoDiv.appendChild(addToOrderDiv);
        cardDiv.appendChild(imageDiv);
        cardDiv.appendChild(infoDiv);
        infoDiv.style.display="flex";
        infoDiv.style.justifyContent= "space-between";
        infoDiv.style.alignItems="center";
        itemSection.appendChild(cardDiv);
   }

}
// for generation of random values
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
// funciton for generating random values in a given range
function getRandomValues(){
        const minValue = 0; // Replace with your desired minimum value
        const maxValue = items.length-1; // Replace with your desired maximum value
        const numberOfValues = 3;
  
         const randomValues = [];
  
         for (let i = 0; i < numberOfValues; i++) {
             const randomValue = getRandomInRange(minValue, maxValue);
             randomValues.push(randomValue);
         }
     return randomValues;
}

  let orders={};
  let orderId = 220003223;

async function takeOrder(){
    let randomValues = getRandomValues();
    let currOrder = [];
    orders[orderId] = currOrder;
    for(let i = 0;i<randomValues.length;i++){
         currOrder.push(items[randomValues[i]]);
    }
    orderId++;
    return currOrder;
}
// popup for taking order;
const openPopupButton = document.getElementById('openPopup');
const closePopupButton = document.getElementById('closePopup');
const popupContainer = document.getElementById('popupContainer');

openPopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'flex';
  processOrder(); 
});
let popupMainContent = document.getElementById("takenOrderDetails");
let orderedItemHeading = document.getElementById("orderedItemHeading");
//// function for displaying popup with ordered items and processing details
function addDetailToPopUp(currOrder){
    popupMainContent.innerHTML="";
    for(let i= 0;i<currOrder.length;i++){
    let cardDiv = document.createElement('div');
    cardDiv.className="small-box";
    let imageDiv = document.createElement('div');
    const imgElement = document.createElement('img');
    imgElement.src=currOrder[i]["imgSrc"];
    imgElement.alt = 'Image Description';
    imageDiv.appendChild(imgElement);
    
    let itemDetails = document.createElement('div');
    itemDetails.className="details-div";
    let itemName = document.createElement('h3');
    itemName.innerText=`${currOrder[i]["name"]}`;
    let itemPrice = document.createElement('p');
     itemPrice.innerText = `$ ${currOrder[i]["price"]}`;
     itemDetails.appendChild(itemName);
     itemDetails.appendChild(itemPrice);
    cardDiv.appendChild(imageDiv);
    cardDiv.appendChild(itemDetails);
    cardDiv.style.backgroundColor="white";
    popupMainContent.appendChild(cardDiv);
    }
}

closePopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'none';
  orderedItemHeading.style.display="block";
  popupMainContent.innerHTML="";

});

////////////// methods for processing of order
function TakeOrder() {
    return new Promise(resolve => {
      setTimeout(() => {
        let currOrderPromise = takeOrder();
        let currOrder=[];
        currOrderPromise.then(result => {
              currOrder = result;
            addDetailToPopUp(currOrder);
         });
        resolve(currOrder);
      }, 2500);
    });
  }
  
  function orderPrep() {
    return new Promise(resolve => {
      setTimeout(() => {
        addContent("Processing your order ...")
        resolve({ order_status: true, paid: false });
      }, 1500);
    });
  }
  
  function payOrder() {
    return new Promise(resolve => {
      setTimeout(() => {
        addContent("Processing payment ...")
        resolve({ order_status: true, paid: true});
      }, 1500);
    });
  }
  
  function thankyouFnc() {
    setTimeout(() => {
        addContent("Thank you for eating with us today!");
        console.log(orders);
      }, 2000); 
  }
  
  async function processOrder() {
    try {
      const order = await TakeOrder();
      console.log('Order taken:', order);
  
      const prepStatus = await orderPrep(order);
      console.log('Order prepared:', prepStatus);
      
      if (prepStatus.order_status) {
        const paymentStatus = await payOrder();
        console.log('Payment status:', paymentStatus);
  
        if (paymentStatus.paid) {
          thankyouFnc();
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  /// for displaying messages on popup for processing
  function addContent(message){ 
    orderedItemHeading.style.display="none";
    popupMainContent.innerHTML="";
    let orderProcessingMessage =document.createElement("h4");
    orderProcessingMessage.innerText=message;
    orderProcessingMessage.style.textAlign="center";
    popupMainContent.style.display = "flex";
    popupMainContent.style.justifyContent = "center";
    popupMainContent.style.alignItems = "center";
    popupMainContent.appendChild(orderProcessingMessage);
  }


  //// for searching items
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input',function(){
    searchFoodItem();
})
 function searchFoodItem(){
        let inputValue = searchInput.value;
        const regexPattern = new RegExp(`${inputValue}`,"i");
        let filteredData = [];
        for(let i = 0;i<items.length;i++){
            const currItem= items[i];
            if(regexPattern.test(currItem.name)){
                filteredData.push(currItem);
            }
        }
       getMenu(filteredData);
  }