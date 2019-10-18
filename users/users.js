/*global $, document, window */
/**************************************************************************************************************************************/

var url = {
        get: api+"/Users",
        post:api+"/Users",
        delete: api+"/Users/"
}
var authId = localStorage.getItem("authId");
var classId = "userId";
var table = $("#userTable");
var userForm = $("#userForm");
var form = document.querySelector("#userForm");

$(document).ready(function() {
    get();
    getUserGroups();
    $(".createBtn").on("click", function() {
        if( userForm.is(":hidden")) {
            userForm.slideDown();
        } else {
            userForm.slideUp();
        }
    });

    $("#userSubmit").on("click", function(event) {
        event.preventDefault();
        if(!form.checkValidity()) {
            var tmpSubmit = document.createElement("button");
            form.appendChild(tmpSubmit);
            tmpSubmit.click();
            form.removeChild(tmpSubmit);
        } else {
            post();
        }
    });

    $("#userTable").on("click", "a.delBtn", function(event) {
        event.stopPropagation();
        var row = $(this).parents('tr');
        var userId = $(this).parents("td").attr("value");
        if(confirm('Are you sure you want to delete this User?')) {
          del(userId, row);
        }
    });
});

function del(userId, row) {
    $.ajax({
        type: "DELETE",
        url: url.delete + userId,
				headers: {"authId": authId},
        contentType: 'application/json',
        datatype: "json",
        fail: function() {console.log("failed")},
    })
		.done(data => row.remove())
}

function post() {
    var user = {
            userId: 0,
            username:$('#username').val(),
            password: "",
            adminId: 1,
            email: true
    }

    if(confirm('Would you like to create a user account for '+user.username+'? Clicking OK will send an email to '+user.username+' with a link to set their password. You will need to add their account to a usergroup to give them more access.')){
      $.ajax({
        type: "POST",
        url: url.post,
				headers: {"authId": authId},
        contentType: 'application/json',
        data: JSON.stringify(user),
        datatype: "json",
        fail: function() {console.log("failed")},
      })
			.done(data => {
				addRow(data);
        addToUserGroup(data);
        clearForm();
			})
      // .then() add user to selected user group
    }
}

function get() {
    $.ajax({
			type: "GET",
			url: url.get,
			headers: {"authId": authId},
			dataType: 'json',
		})
		.done(data => {
			data.forEach(function(user) {
        addRow(user);
    	})
		});
}

function addRow(data) {
    var newRow = $("<tr>" +
        "<td class='delCol " + classId + "' value=" + data.userId + "> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
        "<td >" +  data.username + "</td>" +
      "</tr>");

    table.append(newRow);
}

function clearForm() {
    $("#username").val("");
}

function addToUserGroup(user) {
  const usergroupId = $('#usergroups').find(':selected').val();
  const userIdsArray = [user.userId];

  $.ajax({
      type: "PUT",
      url: "/api/UserGroups/" + usergroupId + "/Users",
      headers: {"authId": authId},
      data: JSON.stringify(userIdsArray),
      contentType: "application/json",
      datatype: "json",
  })
  .done(data => {
    console.log('success')
  })
  .fail(e => {
    console.log(e);
  })
}

function getUserGroups() {
  $.ajax({
    type: 'GET',
    url: `${api}/UserGroups`,
    dataType: 'json',
  })
  .done((data) => {
    data.forEach(usergroup => {
      addOption(usergroup);
    })
    $('#usergroups').formSelect();
  })
  .fail(e => {
    console.log(e);
  })
}

function addOption(usergroup) {
    var newOption = $("<option></option>", {value: usergroup.userGroupId, text: usergroup.userGroupName});
    $("#usergroups").append(newOption);
    //$('select').formSelect();
}
