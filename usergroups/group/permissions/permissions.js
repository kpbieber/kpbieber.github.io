
/*global $, document, window */
/**************************************************************************************************************************************/
var id = window.location.href.split("=").pop();
var authId = localStorage.getItem('authId');
var userId;
var url = {
        get: "/api/UserGroups/" + id + "/Permissions",
        post: "/api/UserGroups/" + id + "/Permissions",
        put: "/api/UserGroups/" + id + "/Permissions"
    }
var inPerms;

$(document).ready(function() {
    setText();
    getPerms();
    $('select').formSelect();
    $("#permSubmit").on("click", function(event) { //PUT CLICK LISTENER
        event.preventDefault();
        var idsArray = $('select').formSelect('getSelectedValues');
        for (var i=0; i < idsArray.length; i++) {
            idsArray[i] = parseInt(idsArray[i]);
        }
        putPerm(idsArray);
    });

    $("#permTable").on("click", "a.delBtn", function(event) { //DELETE CLICK LISTENER
        event.preventDefault();
        var row = $(this).parents('tr');
        var toBeRemoved = $(this).parents('tr').find('.permId').attr("value");
        del(toBeRemoved, row);
    });
});

function getPerms() {
    $.ajax({
      url: url.get,
      type: 'GET',
      headers: {"authId": authId},
      dataType: 'json'
    })
    .done(data => {
      inPerms = data.sort(function(a,b) {
          if (a.permissionName < b.permissionName)
            return -1;
          if (a.permissionName > b.permissionName)
            return 1;
          return 0;
        });
      inPerms.forEach(function(perm) {
          addRow(perm);
      });
    })
    .then(() => {
      resetDropdown();
      getOutPerms();
    })
}

function getOutPerms() {
  $.ajax({
      type: "GET",
      url: "/api/Permissions",
      headers: {"authId": authId},
      dataType: 'json'
    })
    .done(data => {
      data=data.sort(function(a,b) {
          if (a.permissionName < b.permissionName)
            return -1;
          if (a.permissionName > b.permissionName)
            return 1;
          return 0;
        })
      var contains;
      data.forEach(function(perm) {
        contains = inPerms.some(inperm => {
          return JSON.stringify(perm) === JSON.stringify(inperm)
        })
        if(!contains) {
          addOption(perm);
        }
      });
    })
}

function putPerm(idsArray) {
  console.log(idsArray);
    $.ajax({
        type: "PUT",
        url: url.put,
        headers: {"authId": authId},
        data: JSON.stringify(idsArray),
        contentType: 'application/json',
        datatype: "json",
    })
    .done(data => {
      idsArray.forEach(add => {
        data.forEach(perm => {
          if (perm.permissionId === add) {
            inPerms.push(perm);
            addRow(perm);
          }
        })
      })
    })
    .then(() => {
      resetDropdown();
      getOutPerms();
    })
}

function del(toBeRemoved, row) {
  var perms = [];
  perms.push(+toBeRemoved);
  $.ajax({
    type: "DELETE",
    url: `/api/UserGroups/${id}/Permissions`,
    headers: {"authId": authId},
    data: JSON.stringify(perms),
    dataType: 'json',
    contentType: 'application/json'
  })
  .done(data => {
    inPerms = inPerms.filter(perm => {
      return perm.permissionId !== +toBeRemoved
    })
    row.remove();
    resetDropdown();
    getOutPerms();
  })
}

function addRow(perm) {
    var newRow = $("<tr>" +
        "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
        "<td class='permId' value=" + perm.permissionId + ">" + perm.permissionName + "</td>" +
    "</tr>");
    $("#permTable").append(newRow);
}

function addOption(perm) {
    var newOption = $("<option></option>", {value: perm.permissionId, text: perm.permissionName});
    $("#outPerms").append(newOption);
    $('select').formSelect();
}

function resetDropdown() {
    $("select").empty();
    var def = $("<option disabled> Choose Permission </option>");
    $("select").append(def);
    $('select').formSelect();
}

function setText() {
    $("a.goBack").attr("href", "usergroups/group/index.shtml?groupId=" + id);
    $.getJSON("/api/UserGroups/" + id, function(data) {
        $("#usergroupName").text(data.userGroupName);
    });
}
