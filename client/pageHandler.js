function showHome() {
    $('#information').empty();
    $("div.container-fluid").html($("#view-home").html());
    document.querySelector("#footer").classList.add("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    carbonCounter();
    menuToggle();
    document.getElementById('navbarprim').style.backgroundColor = '';
  }
  
  function showInfoPage() {
    $("div.container-fluid").html($("#view-InfoPage").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showClimateGoal() {
    $("div.container-fluid").html($("#view-ClimateGoal").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showContact() {
    $("div.container-fluid").html($("#view-Contact").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showFAQ() {
    $("div.container-fluid").html($("#view-FAQ").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showProductsView() {
    $("div.container-fluid").html($("#view-products").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showCheckout() {
    $("div.container-fluid").html($("#view-checkout").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showBuy() {
    $("div.container-fluid").html($("#view-buy").html());
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showCalculator() {
    $("div.container-fluid").html($("#view-calculator").html());
    document.querySelector("#calcResults").classList.add("hidden");
    document.querySelector("#footer").classList.remove("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  
  function showThankYou() {
    $("div.container-fluid").html($("#view-thanks").html());
    document.querySelector("#footer").classList.add("hidden");
    window.history.replaceState(null, null, window.location.pathname);
    $.ajax({
      url: host + "/purchases",
      type: "GET",
      success: function (purchases) {
        var lastOrder = purchases.length
        $.ajax({
          url: host + "/purchases/" + lastOrder,
          type: "GET",
          success: function (purchase) {
            var totalCarbon = `<div class="invoiceClass"> <h2> Ditt köp har resulterat i ` + purchase.amount + ` kg sparade koldioxidutsläpp` + ` </h2> </div>`
            $("#coldioxid").empty();
            $("#coldioxid").append(totalCarbon);
            purchasedProducts = JSON.parse(purchase.contains)
            for (i in purchasedProducts) {
              $.ajax({
                url: host + "/products/" + purchasedProducts[i].id,
                type: "GET",
                success: function (yourProducts) {
                  prodcount = 0;
                  for (x in purchasedProducts) {
                    if (purchasedProducts[x].id == yourProducts.id){
                      prodCount =  purchasedProducts[x].count;
                    }
                  }
                  var purchaseInfo1 = `<div class="invoiceClass"
                                        <h6>` + prodCount + `st ` + yourProducts.name + ` </h6>
                                      </div>`
                  $("#co2").append(purchaseInfo1);
                }      
              }) 
            }
              var purchaseInfo2 = `<div class="invoiceClass"
                                              <br>
                                              <h5> Summa (SEK) </h5>
                                              <h6>`+ purchase.price + `</h6>
                                              <h5> Ordernummer </h5>
                                              <h6>` + purchase.id + ` </h6>
                                              <h5> Dina produkter </h5>
                                              </div>`
            
            $("#co2").append(purchaseInfo2);
            clearShoppingCart()
            $('.total-cart').empty();
          }
        })
      }
    })
    menuToggle();
    changeToPayed();
    menuToggle();
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }

  function showManage() {
    $("div.container-fluid").html($("#view-manage").html());
    $("#Rubrik").append("<button class='btn btn-primary' onclick='addProduct()'>Add Product</button>");
    $("#Rubrik").append("<button class='btn btn-primary' onclick='editProduct()'>Edit Product</button>");
    $("#Rubrik").append("<button class='btn btn-primary' onclick='deleteProduct()'>Delete Product</button>");
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }

  function showMyPages() {
    $("div.container-fluid").html($("#view-mypages").html());
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showUserInfo() {
    $("div.container-fluid").html($("#view-userinfo").html());
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }

  function showChangePassword() {
    $("div.container-fluid").html($("#view-changePassword").html());
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }
  
  function showTellAFriend() {
    //alert("Sidan laddades");
    $("div.container-fluid").html($("#view-tellafriend").html());
    document.getElementById('navbarprim').style.backgroundColor = "#87a6ad84";
  }