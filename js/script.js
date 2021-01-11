//jQuery.support.cors = true;
/*
$.ajax({
    url: './js/data.json',
    dataType: 'json',
    success: function(data) {
        for (var i=0; i<data.length; i++) {
            var div = $('<div class="col-4"><div class="card"><img class="card-img-top" src='+ data[i].image + '><div class="card-body"> <h4>' + data[i].name+ '</h4>'+' <div class="aligncart"><div><b><strike> $ </b>' + data[i].price.actual + '<b></strike> $ ' + data[i].price.display + '</b></div><div></div><div><a href="#" class="btn btn-cart">Add to Cart</a></div></div></div></div></div>');
            $('#myTable').append(div);
        }
    },
    error: function(jqXHR, textStatus, errorThrown){
        alert('Error: ' + textStatus + ' - ' + errorThrown);
		console.log("textStatus",textStatus);
    }
});*/

$.ajax({
  url: './js/data.json',
  dataType: 'json',
  success: function(data) {
      for (var i=0; i<data.length; i++) {
          var div = $('<div class="col"><div class="card"><img class="card-img-top" src='+ data[i].image + ' alt='+ JSON.stringify(data[i].name) + '><h4 class="card-title">'+ JSON.stringify(data[i].name) + '</h4><div class="card-block"><p class="card-text"><span><strike><b>'+ data[i].price.actual +'</b></strike></span><br/> Price: $ '+ data[i].price.display + '</p><a href="#" data-name='+ JSON.stringify(data[i].name) + ' data-price='+ data[i].price.display + ' class="add-to-cart btn btn-primary">Add to cart</a></div></div></div>');
          $('#myTable').append(div);
      }
  },
  error: function(jqXHR, textStatus, errorThrown){
      alert('Error: ' + textStatus + ' - ' + errorThrown);
  console.log("textStatus",textStatus);
  }
});
// Shopping Cart API
var shoppingCart = (function() {
   // Private methods and propeties
  cart = [];
 
  // Constructor
  function Item(name, price, count) {
  this.name = name;
  this.price = price;
  this.count = count;
  }
  
  // Save cart
  function saveCart() {
  sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
  // Load cart
  function loadCart() {
  cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
  loadCart();
  }
  
  // Public methods and propeties
  
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(name, price, count) {
  for(var item in cart) {
    if(cart[item].name === name) {
    cart[item].count ++;
    saveCart();
    return;
    }
  }
  var item = new Item(name, price, count);
  cart.push(item);
  saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
  for(var i in cart) {
    if (cart[i].name === name) {
    cart[i].count = count;
    break;
    }
  }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
    for(var item in cart) {
    if(cart[item].name === name) {
      cart[item].count --;
      if(cart[item].count === 0) {
      cart.splice(item, 1);
      }
      break;
    }
  }
  saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
  for(var item in cart) {
    if(cart[item].name === name) {
    cart.splice(item, 1);
    break;
    }
  }
  saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
  cart = [];
  saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
  var totalCount = 0;
  for(var item in cart) {
    totalCount += cart[item].count;
  }
  return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
  var totalCart = 0;
  for(var item in cart) {
    totalCart += cart[item].price * cart[item].count;
  }
  return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function() {
  var cartCopy = [];
  for(i in cart) {
    item = cart[i];
    itemCopy = {};
    for(p in item) {
    itemCopy[p] = item[p];

    }
    itemCopy.total = Number(item.price * item.count).toFixed(2);
    cartCopy.push(itemCopy)
  }
  return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
$('body').on('click','.add-to-cart',(function(event) {
  event.preventDefault();
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
}));

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});


function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for(var i in cartArray) {
  output += "<tr>"
    + "<td>" + cartArray[i].name + "</td>" 
    + "<td>(" + cartArray[i].price + ")</td>"
    + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary 1' data-name=" + JSON.stringify(cartArray[i].name) + ">-</button>"
    + "<input type='text' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
    + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + JSON.stringify(cartArray[i].name) + ">+</button></div></td>"
    + "<td><button class='delete-item btn btn-danger' data-name=" + JSON.stringify(cartArray[i].name) + ">X</button></td>"
    + " = " 
    + "<td>" + cartArray[i].total + "</td>" 
    +  "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();