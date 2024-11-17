// SHOPPING CART APP
const productContainer = document.querySelector(".products"); //contenedor principal de productos
const cardContainer = document.querySelector(".cart-items"); // contenedor de productos
const totalPrice = document.querySelector(".price-total"); // subtotal de productos
const productAmount = document.querySelector(".product-amount"); //precio del producto añadido al carrito
const cardIcon = document.querySelector("#cart-icon"); //icono del carrito de compras
const closeBtn = document.querySelector(".close-btn"); // boton que cierra el contenedor del carrito de compras

// variable que almacena un arreglo con los productos agregados al carrito
let cardItems = [];
// variable valor total del carrito
let totalCrtValue = 0;
// variable con el total de productos agregados al carrito
let productCount = 0;

// funcion que muestra el contenedor del carrito
function showCart() {
  document.querySelector("#products-id").style.display = "block"; //lo mostramos
}

// evento click para el icono del carrito de compras
cardIcon.addEventListener("click", showCart);

// function para cerrar el carrito
function closeCart() {
  document.querySelector("#products-id").style.display = "none";
}

// evento click para llamar a la funcion anterior y cerrar el carrito
closeBtn.addEventListener("click", closeCart);

// funcion que se ejecuta cuando se pulsa sobre el boton "agregar al carrito"
function addProduct(e) {
  e.preventDefault();

  // comprobar si el elemento pulsado tiene la clase de agregado al carro
  if (e.target.classList.contains("btn-add-cart")) {
    const selectProduct = e.target.parentElement; //seleccionar el elemento padre del elemento pulsado
    handleProducAdd(selectProduct);

    // mostrar el carrito al agregar un producto
    showCart();
  }
}

// evento clic para el contenedor de productos
productContainer.addEventListener("click", addProduct);

// funcion para leer la informacion del producto seleccionado
function handleProducAdd(product) {
  const infoProduct = {
    image: product.querySelector("div img").src, //url de la imagen del producto
    title: product.querySelector(".title").textContent, //titulo del producto
    price: product.querySelector("div p span").textContent, //precio del producto
    id: product.querySelector("a").getAttribute("data-id"), //id del producto
    amount: 1, // cantidad del producto agregado
  };

  // actualizamos el precio total del carrito
  totalCrtValue = parseFloat(totalCrtValue) + parseFloat(infoProduct.price);
  // redondear el resultado a 2 decimales
  totalCrtValue = totalCrtValue.toFixed(2);
  //si existe retornamos el id del producto
  const exist = cardItems.some((product) => {
    return product.id === infoProduct.id;
  });

  // Si existe actualizamos la cantidad
  if (exist) {
    // iterar sobre el arreglo de productos del carrito
    const pro = cardItems.map((product) => {
      // verificar si el id coincide con el que se esta agregando
      if (product.id === infoProduct.id) {
        product.amount++; //aumentar la cantidad del producto
        return product;
      } else {
        return product;
      }
    }); //creamos un nuevo arreglo para despues modificar cantidad
    // actualizamos el carrito de compras aplicando spret ... (desestrocturacion de arreglo)
    cardItems = [...pro];
  }
  // si no existe agregamos el producto al carrito y lo actualizamos
  else {
    cardItems = [...cardItems, infoProduct];
    productCount++; //incrementamos la cantidad de productos agregados al carrito
  }

  loadHTML();
  // guardamos en el localstorage
  saveData();
}

// funcion para cargar la lista en el carrito
function loadHTML() {
  cardContainer.innerHTML = ""; //eliminamos los productos
  // recorremos el arreglo de productos
  cardItems.forEach((product) => {
    const { image, title, price, amount, id } = product; //desestructuration de objetos
    const row = document.createElement("div");
    row.classList.add("item");
    row.innerHTML = `
    <img src=${image} alt="">
    <div class="item-content">
      <h5>${title}</h5>
      <h5 class="cart-price">$${price}</h5>
      <h6>Cantidad ${amount}</h6>
    </div>
    <i class="fa-solid fa-trash delete-product" data-id=${id}></i>
    `;

    // agregamos el div al contenedor del carrito de compras
    cardContainer.appendChild(row);
  });

  totalPrice.innerHTML = totalCrtValue; //precio total
  productAmount.innerHTML = productCount; //cantidad de productos

  // verificar si existen productos al carrito para mostar el boton "ver carrito"

  if (cardItems.length > 0)
    document.querySelector(".vercarrito").style.display = "block";
  else document.querySelector(".vercarrito").style.display = "none";
}

// funcion para eleminar productos del carrito de compras
function deleteProduct(e) {
  if (e.target.classList.contains("delete-product")) {
    const deleteId = e.target.getAttribute("data-id"); //obtenemos el id
    //iterar sobre el arreglo de productos
    cardItems.forEach((value) => {
      if (value.id === deleteId) {
        const priceReduce = parseFloat(value.price) * parseFloat(value.amount); //calculamos el precio del producto a eliminar
        totalCrtValue = totalCrtValue - priceReduce; //restamos el precio del producto a eliminar al total del carro de compras
        totalCrtValue = totalCrtValue.toFixed(2); //redondear a 2 decimales
      }
    });

    // eliminar del carrito el producto elminiado
    cardItems = cardItems.filter((product) => {
      return product.id !== deleteId;
    });

    productCount--; //rebajamos la cantidad de productos del carrito
  }

  // verificar si el carro esta vacio
  if (cardItems.length === 0) {
    totalPrice.innerHTML = 0;
    productAmount.innerHTML = 0;
  }

  loadHTML();
  // actualizamos en el localstorage
  saveData();
}

// evento click para eliminar producto
cardContainer.addEventListener("click", deleteProduct);

//LOCAL STORAGE
function saveData() {
  // almancenamos los productos en el carrito
  localStorage.setItem("cartItems", JSON.stringify(cardItems));

  // almacenamos el precio total
  localStorage.setItem("totalCartValue", totalCrtValue);

  // almacenamos la cantidad de producto
  localStorage.setItem("productCount", productCount);
}

// cargar los datos del localstorage
function loadData() {
  // obtnemos los productos
  const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));

  // obtener el precio total del carrito desde el localstorage
  const storedTotalCartValue = localStorage.getItem("totalCartValue");

  // obtenemos la cantidad de productos
  const sportProductCount = localStorage.getItem("productCount");

  // comprobamos si los ddatos esta en el localstorage
  if (
    storedCartItems !== null &&
    storedTotalCartValue !== null &&
    sportProductCount !== null
  ) {
    // de existir actualizamos los valores
    cardItems = storedCartItems;
    totalCrtValue = storedTotalCartValue;
    productCount = sportProductCount;

    loadHTML();
  }
}

// cargar los datos del carro del localstorage
loadData();