
/*global $, document, window */
/**************************************************************************************************************************************/
var id = window.location.href.split("=").pop();
var userId;
var url = {
  get: "/api/UserGroups/" + id + "/Users",
  post: "/api/UserGroups/" + id + "/Users",
}
var authId = localStorage.getItem("authId");
var allUsers = [];
var inUsers = [];

$(document).ready(function() {
    setText();
    getInUsers();
    $('select').formSelect();

    $("#userSubmit").on("click", function(event) { //PUT CLICK LISTENER
        event.preventDefault();
        var userIdsArray = $('select').formSelect('getSelectedValues');
        for (var i=0; i < userIdsArray.length; i++) {
        	userIdsArray[i] = parseInt(userIdsArray[i]);
        }
				//console.log(userIdsArray);
        putUser(userIdsArray);
    });

    $("#userTable").on("click", "a.delBtn", function(event) { //DELETE CLICK LISTENER
        event.preventDefault();
				var row = $(this).parents('tr');
        var toBeRemoved = $(this).parents('tr').find('.userId').attr("value");
				del(toBeRemoved, row)
    });
});

function getInUsers() {
    $.ajax({
			type: "GET",
    	url: url.get,
			headers: {"authId": authId},
			dataType: 'json'
    })
		.done(data => {
			inUsers = data;
			//console.log(inUsers);
			data.forEach(function(user) {
					addRow(user);
			});
			resetDropdown();
		})
		.then(() => getOutUsers())
}

function getOutUsers() {
	$.ajax({
			type: "GET",
    	url: "/api/Users",
			headers: {"authId": authId},
			dataType: 'json'
    })
		.done(data => {
			//allUsers = data;
			var contains;
			data.forEach(function(user) {
				contains = inUsers.some(inuser => {
					return JSON.stringify(user) === JSON.stringify(inuser)
				})
				if(!contains) {
					addOption(user);
				}
			});
		})
}

function putUser(userIdsArray) {
    $.ajax({
        type: "PUT",
        url: "/api/UserGroups/" + id + "/Users",
				headers: {"authId": authId},
        data: JSON.stringify(userIdsArray),
				contentType: "application/json",
        datatype: "json",
    })
		.done(data => {
      // add row to table for each user added
				userIdsArray.forEach(toAdd => {
					data.forEach(user => {
						if (user.userId === toAdd) {
							inUsers.push(user);
							addRow(user);
						}
					});
				});
		})
		.then(() => {
			resetDropdown();
			getOutUsers();
		})
}

function del(toBeRemoved, row) {
	var user = []
	user.push(+toBeRemoved)
	$.ajax({
		type: "DELETE",
		url: `/api/UserGroups/${id}/Users`,
		headers: {"authId": authId},
		data: JSON.stringify(user),
		contentType: "application/json",
		datatype:'json'
	})
	.done(data => {
    inUsers = inUsers.filter(user => {
      return user.userId !== +toBeRemoved
    })
		row.remove();
    resetDropdown();
    getOutUsers();
	})
}

function addRow(user) {
    var newRow = $("<tr>" +
                        "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
                        "<td class='userId' value=" + user.userId + ">" + user.username + "</td>" +
                    "</tr>");
    $("#userTable").append(newRow);
}

function addOption(user) {
    var newOption = $("<option></option>", {value: user.userId, text: user.username});
    $("#outUsers").append(newOption);
    $('select').formSelect();
}

function resetDropdown() {
    $("select").empty();
    var def = $("<option disabled> Choose User </option>");
    $("select").append(def);
    $('select').formSelect();
}

function setText() {
    $("a.goBack").attr("href", "usergroups/group/index.shtml?groupId=" + id);
    $.getJSON("/api/UserGroups/" + id, function(data) {
        $("#usergroupName").text(data.userGroupName);
    });
}
