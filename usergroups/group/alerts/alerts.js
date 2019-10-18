/*global $, document, window */
/**************************************************************************************************************************************/
var id = window.location.href.split("=").pop();
var authId = localStorage.getItem("authId");
var dataId;
var url = {
        get: "/api/UserGroups/" + id + "/GenericAlerts",
        post: "/api/UserGroups/" + id + "/GenericAlerts",
        delete: "/api/UserGroups/" + id + "/GenericAlerts/",
    }
var table = $("#alertTable");
var form = document.querySelector("#alertForm");
var alertForm = $("#alertForm");
var submitBtn = $("#alertSubmit");
var classId = "alertId";

$(document).ready(function() {
    setText();
    setPage(); // get() is run as a callback function
    $('#assetgroup').formSelect();
    $('#status').formSelect();
    $('#online').formSelect();
    $(".createBtn").on("click", function() {
        if( alertForm.is(":hidden")) {
            alertForm.slideDown();
        } else {
            alertForm.slideUp();
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

    table.on("click", "a.delBtn", function(event) { // DELETE
        // delete alert and remove row
        event.stopPropagation();
        var row = $(this).parents('tr');
        var alertId = $(this).parents("td").attr("value");
        //console.log(alertId);
        del(alertId, row);
    });
});

function get() {
  $.ajax({
    type: "GET",
    url: url.get,
    headers: {"authId": authId},
    dataType: 'json'
  })
  .done(data => {
    data.forEach(function(dataObj) {
        addRow(dataObj);
    });
  })
  .fail(e => console.log(e))
}

function post() {
    var alert = {
      assetGroupId: +$("#assetgroup").val(),
      severityMin: +$("#minsev").val(),
      severityMax: +$("#maxsev").val(),
      status: $("#status").val(),
      online: ($("#online").val() === 'true') ? true : false,
      offline: false
    }
    $.ajax({
        type: "POST",
        url: url.post,
        headers: {"authId": authId},
        contentType: "application/json",
        data: JSON.stringify(alert),
        dataType: "json",
        contentType: 'application/json'
    })
    .done(data => {
        addRow(data);
        clearForm();
    })
    .fail(e => console.log(e))
}

function del(alertId, row) {
    $.ajax({
        type: "DELETE",
        url: url.delete + alertId,
        datatype: "json",
        headers: {"authId": authId},
        contentType: 'application/json'
    })
    .done(data => {
      row.remove();
    })
    .fail(e => console.log(e))
}

function addRow(data) {
    //var label = $("#assetgroup option[value=" + data.assetGroupId + "]").html();
    $.ajax({
      type: "GET",
      url: `/api/assetGroups/${data.assetGroupId}`,
      dataType: 'json',
      headers: {"authId": authId}
    })
    .done(assetgroup => {
      var newRow = $("<tr>" +
        "<td class='delCol " + classId + "' value=" + data.genericAlertId + "> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
        "<td value=" + data.assetGroupId + ">" + assetgroup.assetGroupName + "</td>" +
        "<td>" + data.severityMin + "</td>" +
        "<td>" + data.severityMax + "</td>" +
        "<td>" + data.status + "</td>" +
        "<td>" + data.Online + "</td>" +
      "</tr>");
      table.append(newRow);
    })
    .fail(e => console.log(e))
}

function addOption(data) {
    var newOption = $("<option value=" + data.assetGroupId + ">" + data.assetGroupName + "</option>");
    $("#assetgroup").append(newOption);
}

function clearForm() {
    $("#assetgroup").val("");
    $("#minsev").val("");
    $("#maxsev").val("");
    $("#status").val("");
    $("#online").val("");
}

function setPage() {
    $.ajax({
      type: "GET",
      url: "/api/UserGroups/" + id + "/AssetGroups",
      headers: {"authId": authId},
      dataType: 'json'
    })
    .done(data => {
      data.forEach(function(ag) {
          addOption(ag);
          $('#assetgroup').formSelect();
          $("select[required]").css({display: "inline", height: 0, padding: 0, width: 0, position: 'absolute'});
      });
    })
    .then(function() {
      get();
    })
    .fail(e => console.log(e));
}

function setText() {
    $("a.goBack").attr("href", "usergroups/group/index.shtml?groupId=" + id);
    $.ajax({
      url: `/api/UserGroups/${id}`,
      type: "GET",
      dataType: 'json',
      headers: {"authId": authId}
    })
    .done(data => {
      $("#usergroupName").text(data.userGroupName);
    })
}
