$("#search_button").click(function (e) {
    e.preventDefault();
    showProductsView();
    showProducts();
  });
  
  $("#InfoAboutCompany").click(function (e) {
    e.preventDefault();
    showInfoPage();
    $("#FAQ_button").click(function (e) {
      e.preventDefault();
      showFAQ();
    });
  });
  
  $("#InfoAboutClimate").click(function (e) {
    e.preventDefault();
    showClimateGoal();
  });
  
  $("#FAQInDropdown").click(function (e) {
    e.preventDefault();
    showFAQ();
  });
  
  $("#ContactUsInDropdown").click(function (e) {
    e.preventDefault();
    showContact();
  });
  
  $("#ContactUsLink").click(function (e) {
    e.preventDefault();
    showContact();
  });
  
  $('#logo').click(function (e) {
    e.preventDefault();
    clearShoppingCart();
    showHome();
  });
  
  $('#home').click(function (e) {
    e.preventDefault();
    showHome();
  });
  
  $("#products").click(function (e) {
    e.preventDefault();
    showProductsView()
    showProducts();
  });
  
  //Show Calculator
  $('#calculator').click(function (e) {
    e.preventDefault();
    showCalculator();
  });
  
  //Register user
  $("#register-link").click(function (e) {
    e.preventDefault();
  
    $.ajax({
      url: host + "/users",
      type: "GET",
      success: function (user) {
        $("#submitreg").click(function (e) {
          e.preventDefault();
          $("#alreadyRegEmail").empty();
          $("#nofirstname").empty();
          $("#nolastname").empty();
          $("#nopassword").empty();
          $("#villkoren").empty();
  
          var exists = null;
          var wrongInputCounter = 0;
          // Bestämmer vad lösenordet måste och får innehålla 
          var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,21}.$/;
          var password = document.getElementById("registerpassword").value
          var correctformat = password.match(passw)
  
  
          for (x in user) {
            //look if email is already registerd
            if (document.getElementById("registermail").value.toUpperCase() === user[x].email)
              exists = user[x].email;
          }
  
          if (document.getElementById("registermail").value.length == 0) {
            $("#alreadyRegEmail").append("<p style= color:red>Ange email!</p>");
            wrongInputCounter++;
          } else if (!ValidateEmail(document.getElementById("registermail").value.toUpperCase())) {
            $("#alreadyRegEmail").append(
              "<p style= color:red>Ange en korrekt mailaddress!</p>"
            );
            wrongInputCounter++
  
          } else if (exists !== null) {
            $("#alreadyRegEmail").append(
              "<p style= color:red>Email redan registrerad!</p>"
            );
            wrongInputCounter++;
          }
          if (document.getElementById("registerfirstname").value.length == 0) {
            $("#nofirstname").append("<p style= color:red>Ange ett namn!</p>");
            wrongInputCounter++;
          }
          if (document.getElementById("registerlastname").value.length == 0) {
            $("#nolastname").append(
              "<p style= color:red>Ange ett efternamn!</p>"
            );
            wrongInputCounter++;
          }
          if (password.length == 0) {
            $("#nopassword").append("<p style= color:red>Ange ett lösenord!</p>");
            wrongInputCounter++;
          } else if (password !== document.getElementById("confirmpassword").value) {
            $("#nopassword").append("<p style= color:red>Lösenorden matchar inte</p>");
            wrongInputCounter++;
          } else if (correctformat == null) {
            $("#nopassword").append("<p style= color:red>Lösenord måste innehålla 6-20 karaktärer varav minst 1 gemen, 1 versal och 1 siffra</p>");
            wrongInputCounter++;
          }
  
          if (!$(terms).is(':checked')) {
            $("#villkoren").append(
              "<p style= color:red>Godkänn villkoren!</p>"
            );
            wrongInputCounter++;
          }
  
  
          if (wrongInputCounter > 0) {
            return;
          } else {
            var email = document.getElementById("registermail").value.toUpperCase();
            var password = document.getElementById("registerpassword").value;
            $.ajax({
              url: host + "/sign-up",
              type: "POST",
              datatype: "JSON",
              contentType: "application/json",
              data: JSON.stringify({
                firstname: document.getElementById("registerfirstname").value,
                lastname: document.getElementById("registerlastname").value,
                email: email,
                password: password,
              }),
  
              success: function () {
                e.preventDefault();
                $("#modalRegForm").modal("hide");
                $("#modalRegSuccess").modal();
                $("#okButton").click(function (e) {
                  $("#modalRegSuccess").modal("hide");
                });
  
                $.ajax({
                  url: host + "/login",
                  type: "POST",
                  datatype: "JSON",
                  contentType: "application/json",
                  data: JSON.stringify({
                    email: email,
                    password: password,
                  }),
                  success: function (token) {
                    showNameLoggedin();
                    currentUserEmail = email;
                    e.preventDefault();
                    sessionStorage.setItem("auth", JSON.stringify(token));
                    showHome();
                  },
                });
              },
            });
          }
        });
      },
    });
  });
  
  
  //Login user
  $("#profile_button").click(function (e) {
    e.preventDefault();
    $.ajax({
      url: host + "/users",
      type: "GET",
      success: function (user) {
        //If press enter to login
        $('input').on('keypress', (event) => {
          if (event.which === 13) {
            enterLogin();
          }
        });
        //If press "Logga in"-button
        $("#submitlog").click(function (e) {
          enterLogin();
        });
  
        //Function that is called to do the login
        function enterLogin() {
  
  
          $("#notRegEmail").empty();
          $("#notRightpassword").empty();
          e.preventDefault();
          var equal = null;
          var emailUpper = document.getElementById("loginemail").value.toUpperCase(); 
          for (x in user) {
            //look if email is registerd or not
            if (emailUpper == user[x].email)
              equal = user[x].email;
          }
          if (equal === null) {
            $("#notRegEmail").append(
              "<p style= color:red>Email inte registrerad!</p>"
            );
            return;
          } else {
            $.ajax({
              url: host + "/login",
              type: "POST",
              datatype: "JSON",
              contentType: "application/json",
              data: JSON.stringify({
                email: document.getElementById("loginemail").value.toUpperCase(),
                password: document.getElementById("loginpassword").value,
              }),
              success: function (token) {
                e.preventDefault();
                showNameLoggedin();
                $("#notRightpassword").empty();
                //$("#notRightpassword").empty();
                currentUserEmail = document.getElementById("loginemail").value.toUpperCase();
                sessionStorage.setItem("auth", JSON.stringify(token));
                $("#modalLoginForm").modal("hide");
                showHome();
              },
              error: function (user) {
                e.preventDefault();
                $("#notRightpassword").empty();
                $("#notRightpassword").append(
                  "<p style= color:red>Fel lösenord!</p>"
                );
                showProducts();
              },
            });
          }
        }
      },
    });
  });
  
  $("#logut").click(function (e) {
    e.preventDefault();
    sessionStorage.setItem("auth", "");
    currentUserEmail = null;
    showHome();
    $("#showName").empty();
  });
  
  $('#product-manager').click(function (e) {
    e.preventDefault();
    showManage();
  });
  
  $('#checkout').click(function (e) {
    e.preventDefault();
    showCheckout();
  });
  
  $('#t').click(function (e) {
    e.preventDefault();
    showCheckout();
  });
  
  $('#buy').click(function (e) {
    e.preventDefault();
    showBuy();
  });
  
  //FUNCTION TO GET TO MY PAGES WHILE LOGGED IN
  $('#showName').click(function (e) {
    e.preventDefault();
    showNameLoggedin();
    showMyPages();
  });

  $('#tellafriendLink').click(function (e) {
    // e.preventDefault();
     showTellAFriend();
     $("#tellafriendbutton").click(function (e) { //"skicka"-knapp on page 
       var inputEmail = document.getElementById("friendemail").value;
       var inputMessage = document.getElementById("messagetofriend").value;
   
       //window.open('mailto:inputEmail?body=inputMessage');
   
       $("#modalTellFriendSuccess").modal(); //pop up for sent mail
       $("#okFriendButton").click(function (e) {   //ok button for pop up
         $("#modalTellFriendSuccess").modal("hide"); //hide the pop up
         showTellAFriend();
       });
       e.preventDefault();
     });
   });

   $("#userinfochange").click(function (e) {
    e.preventDefault();
    showUserInfo();
    editUser();
  });
  
  $("#userCangePasswordButton").click(function (e) {
    e.preventDefault();
    showChangePassword();
    $("#oldPassword").empty();
    $("#newPassword").empty();
    $("#newPasswordConfirm").empty();
    $("#notRightOldPassword").empty();
    $("#notSameNewPassword").empty();
    $("#saveChangedPassword").click(function (e) {
      e.preventDefault();
      $("#notSameNewPassword").empty();
      $("#notRightOldPassword").empty();
  
      var exists = null;
      var wrongInputCounter = 0;
      // Bestämmer vad lösenordet måste och får innehålla 
      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,21}.$/;
      var password = document.getElementById("newPassword").value
      var correctformat = password.match(passw)
  
      
      if (password.length == 0) {
        $("#notOkNewPassword").empty();
        $("#notOkNewPassword").append("<p style= color:red>Ange ett lösenord!</p>");
        wrongInputCounter++;
      } else if (password !== document.getElementById("newPasswordConfirm").value) {
        $("#notOkNewPassword").empty();
  
        $("#notOkNewPassword").append("<p style= color:red>Lösenorden matchar inte</p>");
        wrongInputCounter++;
      } else if (correctformat == null) {
        $("#notOkNewPassword").empty();
  
        $("#notOkNewPassword").append("<p style= color:red>Lösenord måste innehålla 6-20 karaktärer varav minst 1 gemen, 1 versal och 1 siffra</p>");
        wrongInputCounter++;
      }
      else if (document.getElementById("newPassword").value === document.getElementById("newPasswordConfirm").value){
        $.ajax({
          url: host + "/users",
          type: "GET",
          success: function (users) {
            e.preventDefault();
            for (x in users) {
              //look if email is already registerd
              if (currentUserEmail === users[x].email) user_id = users[x].id;
            }
            $.ajax({
              url: host + "/users/changepassword/" + user_id, //user.id
              type: "PUT",
              datatype: "JSON",
              contentType: "application/json",
              data: JSON.stringify({
                oldpassword: document.getElementById("oldPassword").value,
                newpassword: document.getElementById("newPassword").value,
              }),
              success: function (data) {
                showHome();
              },
              error: function (user) {
                e.preventDefault();
                $("#notRightOldPassword").empty();
                $("#notRightOldPassword").append(
                  "<p style= color:red>Fel lösenord!</p>"
                );
              }
            })
          }
        })
      } else {
        $("#notSameNewPassword").empty();
        $("#notSameNewPassword").append(
          "<p style= color:red>Lösenord stämmer inte överrens!</p>"
        );
      }
      if (wrongInputCounter > 0) {
        return;
      }
    });
  });