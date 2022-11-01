function deleteProduct() {
    $('#selectId').modal("show");
    $('#idForm').empty();
    $('#idForm').append("<form id=idrequestForm action=sample.php> <div class=form-group> <label for=id>Id</label> <input type=text class=form-control id=idNumber2 > </div> <button id=searchId2 class='btn btn-primary'>Remove selected Id</button> </form>")
    $('#searchId2').click(function (e) {
      product_id = document.getElementById("idNumber2").value;
      $('#selectId').modal("hide");
      e.preventDefault();
      $.ajax({
        url: host + '/products/' + product_id,
        type: 'DELETE',
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (data) {
          showProducts();
        }
      })
    });
  }
  
  function editProduct() {
    $("#selectId").modal("show");
    $("#idForm").empty();
    $("#idForm").append("<form id=idrequestForm action=sample.php> <div class=form-group> <label for=id>Id</label> <input type=text class=form-control id=idNumber > </div> <button id=searchId class='btn btn-primary'>Edit selected Id</button> </form>");
    $("#searchId").click(function (e) {
      product_id = document.getElementById("idNumber").value;
      $("#selectId").modal("hide");
      e.preventDefault();
      $("#redigeraModal").modal("show");
      $("#rForm").empty();
      $("#rForm").append("<form id=addForm action=sample.php> <div class=form-group> <label for=name>Name</label> <input type=text class=form-control id=name > </div><div class=form-group> <label for=tag>Tag</label> <input type=text class=form-control id=tag > </div> <div class=form-group> <label for=description>Description</label> <input type=text class=form-control id=description> </div> <div class=form-group> <label for=amount>Amount</label> <input type=text class=form-control id=amount> <div class=form-group> <label for=image>Image</label> <input type=text class=form-control id=image> </div><button type=button class='btn btn-secondary' data-dismiss=modal>Close</button> <button id=saveChange class='btn btn-primary'>Edit</button> </form>");
      $.ajax({
        url: host + "/products/" + product_id,
        type: "GET",
        success: function (product) {
          var modal = $("#redigeraModal");
          modal.find(".modal-body input#name").val(product.name);
          modal.find(".modal-body input#description").val(product.description);
          modal.find(".modal-body input#amount").val(product.amount);
          modal.find(".modal-body input#image").val(product.image);
          modal.find(".modal-boy input#tag").val(product.tag)
          $("#saveChange").click(function (e) {
            e.preventDefault();
            $.ajax({
              url: host + "/products/" + product_id,
              type: "PUT",
              datatype: "JSON",
              contentType: "application/json",
              data: JSON.stringify({
                name: document.getElementById("name").value,
                description: document.getElementById("description").value,
                amount: document.getElementById("amount").value,
                image: document.getElementById("image").value,
                tag: document.getElementById("tag").value,
              }),
              success: function (data) {
                showProducts();
                $("#redigeraModal").modal("hide");
              },
            });
          });
        },
      });
    });
  }
  
  function addProduct() {
    $("#aForm").empty();
    $("#addModal").modal("show");
    $("#aForm").append(
      "<form id=addForm action=sample.php> <div class=form-group> <label for=name>Name</label> <input type=text class=form-control id=name > </div> <div class=form-group> <label for=typ>Typ</label> <input type=text class=form-control id=typ> </div> <div class=form-group> <label for=description>Description</label> <input type=text class=form-control id=description> </div> <div class=form-group> <label for=amount>Amount</label> <input type=text class=form-control id=amount> <div class=form-group> <label for=image>Image</label> <input type=text class=form-control id=image> </div><button type=button class='btn btn-secondary' data-dismiss=modal>Close</button> <button id=sparaNy class='btn btn-primary'>Lägg till</button> </form>"
    );
    $("#sparaNy").click(function (h) {
      h.preventDefault();
      $.ajax({
        url: host + "/products",
        type: "POST",
        datatype: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
          name: document.getElementById("name").value,
          description: document.getElementById("description").value,
          amount: document.getElementById("amount").value,
          image: document.getElementById("image").value,
          typ: document.getElementById("typ").value,
        }),
        success: function (product) {
          showProducts();
          $("#addModal").modal("hide");
        },
      });
    });
  }