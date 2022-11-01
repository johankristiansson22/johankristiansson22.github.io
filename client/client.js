//Some global variables
var host = "http://127.0.0.1:5000";
var currentUserEmail = null;
let show_checked_array = [];

function carbonCounter() { //Shows total amount of emission allowances bought in kg on front page
  totCarbAmount = 0;
  $.ajax({
    url: host + "/purchases",
    type: "GET",
    success: function (purchases) {
      for (i in purchases) {
        if (purchases[i].payed){
          totCarbAmount += purchases[i].amount;
        }
      }
      $("#information").empty()
      $("#information").append(
        ` 
        <br>  <br>  <br>  <br>  <br>
        Biomass feature a more sustainable filament that is made out of bio-waste materials, easily sourced and even more easily recycled. Our filament makes 3D printing easier, by offering customizable solutions. Bespoke filament creation processes mean consumers can pick the thickness, length, color, and strength, anything they can imagine, we can do. Filaments made from bio-waste exhibit stronger tensile strength. It is the premier choice for 3D printing enthusiasts.
        <div class="invoiceClass"
          <br>
          <br>
        </div>`
        );
    }
  });  
};

function onHover() { //Diffrent icon when mouse is over
  $("#profile_button_pic").attr("src", "creativecontent/Profilelogo.png");
  $("#search_button_pic").attr("src", "creativecontent/Searchlogo.png");
  $("#shoppingcart_button_pic").attr("src", "creativecontent/Shoppingcart_icon.png");
  $("#profile_button_pic2").attr("src", "creativecontent/Profilelogo.png");

};
function offHover() { //Diffrent icon when mouse is over
  $("#profile_button_pic").attr("src", "creativecontent/Profilelogo_white.png");
  $("#search_button_pic").attr("src", "creativecontent/Searchlogo_white.png");
  $("#shoppingcart_button_pic").attr("src", "creativecontent/Shoppingcart_icon_white.png");
  $("#profile_button_pic2").attr("src", "creativecontent/Profilelogo_white.png");
}

function ValidateEmail(input) { //Validates characters in email
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.match(validRegex)) {
    return true;
  }
}

$(document).ready(function () {
  sessionStorage.setItem("auth", "");
  if (window.location.href.indexOf("thankyou") > -1) {
    showThankYou()
  } else {
    showHome();
    cartCounter();
  }
});

function showNameLoggedin() { // FUNCTION TO SHOW NAME WHILE LOGGED IN
  orderHistory();
  var user_id = null;
  $.ajax({
    url: host + "/users",
    type: "GET",
    success: function (users) {
      for (x in users) {
        if (currentUserEmail === users[x].email) user_id = users[x].id;
      }
      $.ajax({
        url: host + "/users/" + user_id,
        type: "GET",
        success: function (user) {
          $("#showName").empty();
          var newCard =
            `<div class="text"> 
                  <h5>` +
            user.firstname + ` ` + user.lastname +
            `</h5>`;
          $("#showName").append(newCard);

          //PUTS THE NAME OF THE USER IN MYPAGES
          $("#myAccountInfoDiv").append(
            `<h3>` + user.firstname + ` ` + user.lastname + `</h3>` 
          );
        },
      });
    },
  });
}

function menuToggle() { //Toggles what is shown on the menu depending on if you are logged in or logged in as an admin
  if ((sessionStorage.getItem('auth').length == 0) || (sessionStorage.getItem('auth') == null)) {
    var signedIn = false;
    var isAdmin = false;
  } else {
    var signedIn = true;
    $.ajax({
      url: host + "/users",
      type: "GET",
      success: function (user) {
        for (i in user) {
          if ((user[i].email == currentUserEmail) && (user[i].is_admin)) {
            isAdmin = true;
            $("#product-manager").toggleClass('d-none', !isAdmin);
          }
        }
      }
    })
  }
  $("#register-link").toggleClass('d-none', signedIn);
  $("#profile_button").toggleClass('d-none', signedIn);
  $("#profile_button2").toggleClass('d-none', !signedIn);
  $("#showName").toggleClass('d-none', !signedIn);
  $("#logut").toggleClass('d-none', !signedIn);
  $("#mypages").toggleClass("d-none", !signedIn);
  $("#product-manager").toggleClass('d-none', !isAdmin);
};
 
function showProducts() { //Show product cards on the product page
  $('#Products').empty();
  $.ajax({
    url: host + '/products',
    type: 'GET',
    success: function (products) {
      for (x in products) {
        if (!(products[x].typ == "egen")) {
          var newCard = `<div class="card productCardHeight" style = "width:24rem;" data-typ = ` + products[x].typ + `> 
                     <div class = "card-body d-flex flex-column">
                        <div class = "imagebody">
                        <img src=` + products[x].image + ` style="width:100%" class = "productimg"> 
                        </div>
                        <h3 class =product-name>` +  products[x].name + "-paketet" + `</h3>
                        <p class="productprice">`+ products[x].amount * products[x].price + "kr" + ` </p> <p class= "description">` + products[x].description + ", motsvarande (" + products[x].amount + " KG CO2 utsläpp)" + ` </p>
                        <p><button onclick='AddToCart(` + products[x].id + `)'> Klimatkompensera</button></p> </div>` 
          $("#Products").append(newCard);
         }
      };
    }
  })
}

function FilterFunction() {
  var input, filter, cards, cardContainer, h5, title, i;
  input = document.getElementById("myFilter");
  filter = input.value.toUpperCase();
  cardContainer = document.getElementById("Products");
  cards = cardContainer.getElementsByClassName("card");
  for (i = 0; i < cards.length; i++) {
    title = cards[i].querySelector(".card-body h3.product-name");
    if (title.innerText.toUpperCase().indexOf(filter) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function FilterCheckbox(currentBox) {
  cardContainer = document.getElementById("Products");
  cards = cardContainer.getElementsByClassName("card");

  if ($(currentBox).is(':checked')) {
    show_checked_array.push(currentBox.id);
  } else if (!$(currentBox).is(':checked')) {
    for (l = 0; l < show_checked_array.length; l++) {
      if (currentBox.id == show_checked_array[l]) {
        show_checked_array.splice(l, 1);
      }
    }
  }

  for (i = 0; i < cards.length; i++) {
    for (j = 0; j < show_checked_array.length; j++) {
      if ($(cards[i]).data('typ') == show_checked_array[j]) {
        cards[i].style.display = "";
        j = show_checked_array.length;
      } else {
        cards[i].style.display = "none";
      }
    }
  }

  if (!$('input[type=checkbox]').is(':checked')) {
    for (i = 0; i < cards.length; i++) {
      cards[i].style.display = "";
    }
  }
}

function editUser() {
  var user_id = null;
  $.ajax({
    url: host + "/users", //user.id
    type: "GET",
    success: function (users) {
      for (x in users) {
        //look if email is already registerd
        if (currentUserEmail.toUpperCase() === users[x].email.toUpperCase()) user_id = users[x].id;
      }
      $("#rForm").append(
        "<form id=addForm action=sample.php> <div class=form-group> <label for=name>Förnamn</label> <input type=text class=form-control id=firstname > </div> <div class=modal-body id=change_nofirstname> </div> <div class=form-group> <label for=price>Efternamn</label> <input type=text class=form-control id=lastname> </div> <div class=modal-body id=change_nolastname> </div> <div class=form-group> <label for=description>E-postadress</label> <input type=text class=form-control id=email> </div> <div class=modal-body id=change_noemail> </div> <button type=button id=closeButton class='btnTemplateClose' data-dismiss=modal>Stäng</button> <button id=saveChange class='btnTemplateBlack' data-dismiss= modal aria-label=Close >Spara</button> </form>"
      );

      $.ajax({
        url: host + "/users/" + user_id,
        type: "GET",
        success: function (user) {
          var modal = $("#editUser");
          modal.find(".modal-body input#firstname").val(user.firstname);
          modal.find(".modal-body input#lastname").val(user.lastname);
          modal.find(".modal-body input#email").val(user.email.toLowerCase());
          $("#saveChange").click(function (e) {
            e.preventDefault();
            var wrongInputCounter = 0;
            var emailExist = null;
            $("#change_nofirstname").empty();
            $("#change_nolastname").empty();
            $("#change_noemail").empty();
            $("#showName").empty();
            for (x in users) {
              //look if email is already registerd
              if (document.getElementById("email").value.toUpperCase() !== currentUserEmail) {
                if (document.getElementById("email").value.toUpperCase() === users[x].email) {
                  emailExist = users[x].email;
                }
              }
            }

            if (document.getElementById("firstname").value.length == 0) {
              $("#change_nofirstname").append(
                "<p style= color:red>Ange ett namn!</p>"
              );
              wrongInputCounter++;
            }
            if (document.getElementById("lastname").value.length == 0) {
              $("#change_nolastname").append(
                "<p style= color:red>Ange ett efternamn!</p>"
              );
              wrongInputCounter++;
            }

            if (document.getElementById("email").value.length == 0) {
              $("#change_noemail").append(
                "<p style= color:red>Ange email!</p>"
              );
              wrongInputCounter++;
            } else if (emailExist !== null) {
              alert("Email exists har värde");
              $("#change_noemail").append(
                "<p style= color:red>Email redan registrerad!</p>"
              );
              wrongInputCounter++;
            }
            if (wrongInputCounter > 0) {
              return;
            } else {
              $.ajax({
                url: host + "/users/" + user_id, //user.id
                type: "PUT",
                datatype: "JSON",
                contentType: "application/json",
                data: JSON.stringify({
                  firstname: document.getElementById("firstname").value,
                  lastname: document.getElementById("lastname").value,
                  email: document.getElementById("email").value.toUpperCase(),
                }),

                success: function (data) {
                  currentUserEmail = document.getElementById("email").value;
                  $("#editUser").modal("hide");
                  showNameLoggedin();
                  showMyPages();
                },
              });
            }
          }); // save changes button clicked

          $("#closeButton").click(function (e) {
            e.preventDefault();
            $("#editUser").modal("hide");
            showNameLoggedin()
            showMyPages();
          });
        },
      });
    },
  });
}

function orderHistory() { //Shows order history on my pages when logged in
  var user_id = null;
  var purchase_id = null;
  var title_showing = 0;
  
  $.ajax({
    url: host + "/users",
    type: "GET",
    success: function (users) {
          $.ajax({
            url: host + "/purchases", 
            type: "GET",
            success: function (purchases) {
              var carbondioxideamount = 0;
              for (x in users) {
                if (currentUserEmail === users[x].email) {
                  user_id = users[x].id;
                  break;
                }
              }
              for (x in purchases) {
                if (purchases[x].payed) {
                  if (user_id === purchases[x].buyer){
                    purchase_id = purchases[x].id;
                    $.ajax({
                      url: host + "/purchases/" + purchase_id,
                      type: "GET",
                      success: function (recipt) {
                        cart = JSON.parse(recipt.contains);
                        carbondioxideamount += recipt.amount;
                        var header = `<h3>Dina tidigare köp</h3> <br>`
                        title_showing ++;                  
                        var output = `<div class="card" id="orderHistoryCard "style = "width:24rem;" data-typ="resa" 
                                      <div class = "card-body d-flex flex-column">
                                      <h6 class =product-name>` + recipt.day  + "/"+ recipt.month + "-"+ recipt.year + `</h6>
                                      <h6 class= "description"> Ordernummer: ` + recipt.id + `</h6><p id="productHistory`+ recipt.id + `" class="description"></p><div class="cardTotalCost"><h6 id = "orderSum` + recipt.id + `" > </h6> </div></div>`

                        if(title_showing == 1) {$("#orderHistoryHeader").append(header)}              
                        $("#orderHistory").append(output)

                        $.ajax({
                          url: host + "/products",
                          type: "GET",
                          success: function (products) {
                            cart = JSON.parse(recipt.contains);
                            var totC = 0;
                            
                            for(i in cart){
                              for(j in products){
                                if (products[j].id == cart[i].id){
                                  var line = `<div class="text"> <h6>` + cart[i].count + ` st ` + products[j].name + ` för ` + cart[i].count * products[j].price * products[j].amount + ` kr <br> </h6> </div>`
                                  $("#productHistory" + recipt.id).append(line);
                                  totC += cart[i].count * products[j].price * products[j].amount;
                                }
                              }
                            }
                          
                        var sum = "Total kostnad: " + totC + "kr"
                        $("#orderSum" + recipt.id).append(sum);

                        if (x == purchases.length - 1) {
                          $("#cabonAmountAccount").empty();
                          var carbonamount = `<div class="carbonaccountamount"
                          <br>
                          <h3> Ditt handlande har sparat jorden </h3>
                          <h2>` + carbondioxideamount + ` kg </h2>
                          <h3>koldioxid </h3>
                          </div>`
                          $("#cabonAmountAccount").append(carbonamount);
                        } 

                      }
                    });
                  },
                });
              }
            }
          }
          
          if (purchase_id == null) {
            $("#noOrderHistory").append(
              `<h3> Du har inga tidigare köp!</h3>`,
              `<div class="samelineerrormessage">
                  <br>
                  <h4> Gå in på produkter för att köpa utsläppsrätter</h4>
                </div>`
            );
          }
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      document.getElementById('navbarprim').classList.add('fixed-top');
      // add padding top to show content behind navbar
      navbar_height = document.querySelector('.navbar').offsetHeight;
      document.body.style.paddingTop = navbar_height + 'px';
    } else {
      document.getElementById('navbarprim').classList.remove('fixed-top');
      // remove padding top from body
      document.body.style.paddingTop = '0';
    }
  });
});

$(window).scroll(function () {
  if (window.scrollY > 30) {
    $("#search_container").css({ "marginTop": (($(window).scrollTop()) - 20) + "px", "marginLeft": ($(window).scrollLeft()) + "px" }, "slow");
  } else {
  }
});

// CALCULATOR FOR CO2
function calcCO2() {
  document.querySelector("#calcErrorMessege").classList.add("hidden")
  if(document.getElementById('vehicle-selector').value.length == 0 || document.getElementById('distance').value.length == 0 || document.getElementById('trips').value.length == 0) {
    document.querySelector("#calcErrorMessege").classList.remove("hidden")
    return;
  }

  $('#tripComp').empty();
  $('#weekComp').empty();
  $('#yearComp').empty();
  document.querySelector("#calcResults").classList.remove("hidden")
  
  var resultkm = document.getElementById("resultkm");
  var resulttrip = document.getElementById("resulttrip");
  var resultweek = document.getElementById("resultweek");
  var resultyear = document.getElementById('resultyear');

  var vehicle = document.getElementById('vehicle-selector');
  var distance = document.getElementById('distance');
  var trips = document.getElementById('trips');

  var name = "";
  name = vehicle.value + " " + trips.value + " gånger i veckan";
  

  var vehiclevalue = vehicle.value;
  var distancevalue = distance.value;
  var tripsvalue = trips.value;
  
  $("#noVehicle").empty()

  if (vehiclevalue == "Flyg") {
    vehiclevalue = 255;
  } else if (vehiclevalue == "Tåg") {
    vehiclevalue = 6;
  } else if (vehiclevalue == "Bil") {
    vehiclevalue = 192;
  } else {
    vehiclevalue = NaN;
    $("#noVehicle").append(
      "<p style=color:red>Du har inte registrerat ett fordon</p>"
    );
  }

  var calckm = vehiclevalue;
  var calctrip = (calckm * distancevalue) / 1000;
  var calcweek = (calctrip * tripsvalue);
  var calcyear = (calcweek * 52);

   calckm = calckm.toFixed(3);
   calctrip = calctrip.toFixed(3);
   calcyear = calcyear.toFixed(3);
   calcweek = calcweek.toFixed(3);

  resultkm.innerHTML = calckm + " g CO2 / km";
  resulttrip.innerHTML = calctrip + " kg CO2";
  resultweek.innerHTML = calcweek + " kg CO2";
  resultyear.innerHTML = calcyear + " kg CO2";

  $("#tripComp").append("<button class='btnTemplate' onclick='AddToCartSupport(`" + Math.ceil(calctrip) + "`, `" + name + "`)'> Kompensera för en resa!</button>");
  $("#weekComp").append("<button class='btnTemplate' onclick='AddToCartSupport(`" + Math.ceil(calcweek) + "`, `" + name + "`)'> Kompensera för en vecka!</button>");
  $("#yearComp").append("<button class='btnTemplate' onclick='AddToCartSupport(`" + Math.ceil(calcyear) + "`, `" + name + "`)'> Kompensera för ett år!</button>");
}
