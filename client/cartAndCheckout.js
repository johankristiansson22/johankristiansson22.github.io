var shoppingCart = (function () {
    cart = [];
    totalC = 0;
  
    // Constructor
    function Item(id, count) {
      this.id = id;
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
  
    var obj = {};
  
    // Add to cart
    obj.addItemToCart = function (id, count) {
      for (var item in cart) {
        if (cart[item].id == id) {
          cart[item].count++;
          saveCart();
          return;
        }
      }
      var item = new Item(id, count);
      cart.push(item);
      saveCart();
    }
  
    // Set count from item
    obj.setCountForItem = function (id, count) {
      for (var i in cart) {
        if (cart[i].id == id) {
          cart[i].count = count;
          break;
        }
      }
    }
  
    // Remove item from cart
    obj.removeItemFromCart = function (id) {
      for (var item in cart) {
        if (cart[item].id == id) {
          cart[item].count--;
          if (cart[item].count == 0) {
            cart.splice(item, 1);
          }
          break;
        }
      }
      saveCart();
    }
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function (id) {
      for (var item in cart) {
        if (cart[item].id == id) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
    // Clear cart
    obj.clearCart = function () {
      cart = [];
      saveCart();
    }
  
    // Count cart 
    obj.totalCount = function () {
      var totalCount = 0;
      for (var i in cart) {
        totalCount += cart[i].count;
      }
      return totalCount;
    }
  
    // List cart
    obj.listCart = function () {
      var cartCopy = [];
      for (i in cart) {
        cartCopy[i] = cart[i];
      }
      return cartCopy;
    }
    return obj;
  })();
  
  // Add item
  function AddToCart(id) {
    popUp();
    shoppingCart.addItemToCart(id, 1);
    displayCart();
    cartCounter()
  };
  
  // Clear items
  function clearShoppingCart() {
    shoppingCart.clearCart();
    displayCart();
  };
  
  function displayCart() {
    $('.total-cart').empty();
    $('.show-cart').empty();
    $('#shoppingCartCheckout.modal-footer').empty();
    var cartArray = shoppingCart.listCart();
    var totalC = 0;
    var linkCheckout = "";
    for (var i in cartArray) {
      $.ajax({
        url: host + "/products/" + cartArray[i].id,
        type: "GET",
        success: function (product) {
          var count;
          for (j in cartArray) {
            if (product.id == cartArray[j].id) {
              count = cartArray[j].count;
            }
          }
          var output = "<tr>"
              + "<td> <img src=" + product.image + " style=width:30px;height:30px;> </td>"
              + "<td>" + product.name + "</td>"
              + "<td>(" + product.price * product.amount + ")</td>"
              + "<td><div class='input-group'><button class='btnIncreaseDecrease' onclick=decrementItem('" + product.id + "')>-</button>"
              + "<input type='number' style='width: 8em' class='item-count form-control' data-id='" + product.id + "' value='" + count + "'>"
              + "<button class='btnIncreaseDecrease' onclick=incrementItem('" + product.id + "')>+</button></div></td>"
              + "<td><button class='btnTemplateClose' onclick=DeleteItem('" + product.id + "')>X</button></td>"
              + " = " 
              + "<td>" + product.price * product.amount * count + "</td>" 
              +  "</tr>";
              totalC += product.price * product.amount * count;
              linkCheckout = "<button type='button' class='btnTemplateClose' data-dismiss='modal'>Stäng</button>"
              + "<button onclick=createOrder() class='btnTemplateBlack'>Beställ nu</button>";
              $('#shoppingCartCheckout.modal-footer').empty();
              $('#shoppingCartCheckout.modal-footer').append(linkCheckout);
  
              $('.show-cart').append(output);
              $('.total-cart').empty();
              $('.total-cart').html(totalC);
            
              output ="";
        }
      });
    }
    $('.total-count').html(shoppingCart.totalCount());
  }
  
  // Delete item button
  function DeleteItem(id) {
    shoppingCart.removeItemFromCartAll(id);
    cartCounter();
    $('.total-cart').empty();
    displayCart();
  }
   
  // -1
  function decrementItem(id) {
    shoppingCart.removeItemFromCart(id);
    displayCart();
    cartCounter();
  }
  
  // +1
  function incrementItem(id) {
    shoppingCart.addItemToCart(id, 1);
    displayCart();
    cartCounter();
  }
  
  function createOrder() {
    var cartArray = shoppingCart.listCart();
    $.ajax({
      url: host + "/products",
      type: "GET",
      success: function (products) {
        var totalCost = 0;
        var totalCarb = 0;
        for (j in cartArray) {
          for (i in products) {
            if (products[i].id == cartArray[j].id) {
              totalCost += products[i].price * products[i].amount * cartArray[j].count;
              totalCarb += products[i].amount * cartArray[j].count;
            }
          }
        }
        var today = new Date();
        var user_id = null;
        $.ajax({
          url: host + "/users",
          type: "GET",
          success: function (users) {
            for (x in users) {
              if (currentUserEmail === users[x].email) user_id = users[x].id;
            }
            $.ajax({
              url: host + "/purchases",
              type: "POST",
              datatype: "JSON",
              contentType: "application/json",
              data: JSON.stringify({
                price: totalCost,
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate(),
                buyer: user_id,
                contains: JSON.stringify(cartArray),
                amount: totalCarb
              }),
              success: function (purchase) {
                window.location = 'http://127.0.0.1:5000/create-checkout-session/' + purchase.id;
              }
            });
          }
        });
      }
    });
  }
  
  function changeToPayed() {
    $.ajax({
      url: host + "/purchases",
      type: "GET",
      success: function (purchases) {
        var lastPost = purchases.length
        $.ajax({
          url: host + "/purchases/" + purchases.length,
          type: "PUT",
          datatype: "JSON",
          contentType: "application/json",
          data: JSON.stringify({
            "payed": true
          }),
          success: function () { }
        });
        $('.total-cart').empty();
        shoppingCart.empty;
      }
    })
  }
  
  function cartCounter() {
    if (shoppingCart.totalCount() != 0) {
      $('#shoppingcart_button').append('<div class="navigation-primary__icon--cart_count">' + shoppingCart.totalCount() + '</div>');
    } else {
      $('.navigation-primary__icon--cart_count').hide();
  
    }
  }
  
  function AddToCartSupport(value, prodName) {
    $.ajax({
      url: host + "/products",
      type: "POST",
      datatype: "JSON",
      contentType: "application/json",
      data: JSON.stringify({
        name: prodName,
        description: "Kompensera för din egenuträknade påverkan",
        amount: value,
        typ: "egen",
        image: "creativecontent/isberg.jpeg",  
      }),
      success: function (product) {
        showProducts();
        AddToCart(product.id);
      },
    })
  }
  
  function popUp() {
    var x = $(".popuptext");
    x.show();
    setTimeout(function () {
      x.hide();
    }, 1500);
  }

  displayCart();