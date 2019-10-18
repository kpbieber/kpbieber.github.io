
/*global $, document, window */
/***************************************************************************************************************/
var form = document.querySelector("#modelForm");
var modelForm = $("#modelForm");
var submitBtn = $("#submit");
var authId = localStorage.getItem("authId");

$(document).ready(function() {
  $(".createBtn").on("click", function() {
      if( modelForm.is(":hidden")) {
        modelForm.slideDown();
      } else {
        modelForm.slideUp();
      }
  });

  submitBtn.on("click", function(event) { // POST
    event.preventDefault();
    //console.log("hi");
    if(!form.checkValidity()) {
        var tmpSubmit = document.createElement("button");
        form.appendChild(tmpSubmit);
        tmpSubmit.click();
        form.removeChild(tmpSubmit);
    } else {
        post();
    }
  });

  $("#assetDefTable").on("click", "a.delBtn", function(event) { //on delete click
    event.stopPropagation();
    var row = $(this).parents('tr');
    var assetDefinitionId = $(this).parents('tr').find('.assetDefinitionId').attr("value");
    //console.log(assetDefinitionId);
    if(confirm('Are you sure you want to delete this Asset Definition?')) {
      del(assetDefinitionId, row);
    }
  });

  $.getJSON(api+"/assetDefinitions", function(data) {
    data.forEach(function(assetDef) { //loops through addRow function to generate model list table and stores ids in array
        addRow(assetDef);
    });
  });
});

function addRow(assetDef) {
    var newRow = $("<tr>" +
      "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
      `<td> <a class='modelLink' href='assetdefinitions/configure/?assetDefinitionId=${assetDef.assetDefinitionId}'>View</a> </td>` +
      "<td class='modelName assetDefinitionId' value="+assetDef.assetDefinitionId+">" + assetDef.assetDefinitionName + "</td>" +
    "</tr>");
    $("tbody").append(newRow);
}

function post() {
  var model = {assetDefinitionName: $("#name").val()}

  $.ajax({
    type: "POST",
    url: api+"/AssetDefinitions",
    dataType: "json",
    contentType: 'application/json',
    data: JSON.stringify(model),
    headers: {"authId": authId}
  })
  .done(data => {
    addRow(data);
    //clear form
    $("#name").val("");
  })
  .fail(e => {
    console.log(e);
  })
}

function del(assDefId, row) {
  $.ajax({
    type: 'DELETE',
    url: `${api}/AssetDefinitions/${assDefId}`,
    dataType: 'json',
    contentType: 'applicatin/json',
    headers: {'authId': authId}
  })
  .done(data => {
    console.log('del success');
    row.remove();
  })
  .fail(e => {
    console.log(e);
  })
}
