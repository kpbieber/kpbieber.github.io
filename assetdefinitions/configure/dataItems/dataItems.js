
/*global $, document, window, alert */
/**************************************************************************************************************************************/
// modelTable/modelId/dataItems/?modelId= + model.modelId
var ID;
var dataItemForm = document.querySelector("#dataItemForm");

$(document).ready(function() {
    // call and set html
    var call = getCall(); // get model ID from url
    $("#modelId").html(ID); //set model id at top of page
    $("#backBtn").attr("href", "assetdefinitions/configure/?assetDefinitionId=" + ID); //set go back href

    $.getJSON(api+"/assetDefinitions/" + ID, function(data) { //set model name
        //console.log(data.Models[0].modelNumber);
        $("#modelName").html(data.assetDefinitionName);
    });

    getDataItems(call);
    // set event listeners
    $("#createBtn").on("click", function() {  //toggle form hide
        if($("#dataItemForm").is(":hidden")) {
            $("#dataItemForm").slideDown();
        } else {
            $("#dataItemForm").slideUp();
        }
    });

    $("#dataitemSubmit").on("click", function(event) { // create dataitem button listener
      event.preventDefault();
       if(!dataItemForm.checkValidity()) {
          var tmpSubmit = document.createElement('button') // creates 'fake' submit button to trigger form validation
          dataItemForm.appendChild(tmpSubmit)
          tmpSubmit.click()
          dataItemForm.removeChild(tmpSubmit)
      } else {
          postDataitem(); // api POST call and row append
      }
    });

    $('#addAll').on('click', (e) => {
      e.preventDefault();
      // GET /api/assetDefinition/${assetDefinitionId}/DetectDataItemDefinitions
      $.ajax({
          type: "GET",
          url: `api/assetdefinitions/${ID}/DetectDataItemDefinitions`,
          contentType: 'application/json',
          datatype: "json",
      })
      .done((data) => {
        location.reload();
      })
      .catch((e) => {
        alert("Something went wrong! Please try again.");
      })
    })

    $("#dataitemsList").on("click", "a.delBtn", function(event) {
        event.stopPropagation();
        var row = $(this).parents('tr');
        var dataitemId = $(this).parents('tr').find('.dataitemId').attr("value");
        deleteDataitem(dataitemId, row);
    });
});
/* DOM MANIPULATION FUNCTIONS */
function getCall() {
    //var url = window.location.href
    //var captured = /\/assetDefinitions\/([0-9]+)\//i.exec(url)[1]; // Value is in [1] ('384' in our case)
    //ID = captured ? captured : '0';
    ID = getParameterByName("assetDefinitionId")
    var call = api+"/assetDefinitions/" + ID + "/DataItemDefinitions";
    return call;
}

function addRow(dataItem) { //builds html for each table row in the model list
    var newRow = $("<tr>" +
                        "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +

                        "<td class='dataitemId' value=" + dataItem.dataItemId + ">" + dataItem.label + "</td>" +
                        "<td >" + dataItem.unit + "</td>" +
                        "<td >" + dataItem.defaultValue + "</td>" +

                   "</tr>");
    $("tbody").append(newRow);
}

function clearForm() {
    $("#userLabel").val("");
    $("#userUnit").val("");
    $("#defaultValue").val("");
}
/*************************** API AJAX CALLS ********************** */
function getDataItems(call) {
    $.getJSON(call, function(data) { //make api call to specific model Id
      data.forEach(function(dataitem) { //loops through addRow function to generate alarm list
          addRow(dataitem);
      });
    });
}

function postDataitem() {
    var postUrl = api+"/assetDefinitions/" + ID + "/DataItemDefinitions";
    var dataitem = {
            modelId: ID,
            label: $("#userLabel").val(),
            unit: $("#userUnit").val(),
            defaultValue: $("#defaultValue").val()
    };
    $.ajax({
        type: "POST",
        url: postUrl,
        data: JSON.stringify(dataitem),
        contentType: 'application/json',
        datatype: "json",
    })
    .done((data) => {
      addRow(dataitem);
      clearForm();
    })
    .catch((e) => {
      alert("Something went wrong! Please try again.");
    })
}

function deleteDataitem(dataitemId, row) {
    var deleteUrl = api+"/assetDefinitions/" + ID + "/DataItemDefinitions/" + dataitemId;
    $.ajax({
      type: "DELETE",
      url: deleteUrl,
      contentType: 'application/json',
    })
    .done((data) => {
      console.log("Delete Successful");
      row.remove();
    })
    .catch((e) => {
      console.log(data.error);
      alert("Something went wrong! Please try again.");
    })
}
