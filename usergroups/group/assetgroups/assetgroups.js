
/*global $, document, window */
/**************************************************************************************************************************************/
var id = window.location.href.split("=").pop();
var authId = localStorage.getItem("authId");
var dataId;
var url = {
        get: "api/UserGroups/" + id + "/AssetGroups",
        post: "api/UserGroups/" + id + "/AssetGroups",
        put: "api/UserGroups/" + id + "/AssetGroups"
    }

var displayTable = $("#agTable");
var submitBtn = $("#agSubmit");
//var ins = "inAssetGroups";
//var outs = "outAssetGroups";
var classId = "agId";
var inGroups;


$(document).ready(function() {
    setText();
    get();
    $('select').formSelect();

    submitBtn.on("click", function(event) { //PUT CLICK LISTENER
			event.preventDefault();
			var idsArray = $('select').formSelect('getSelectedValues');
			for (var i=0; i < idsArray.length; i++) {
					idsArray[i] = +idsArray[i];
			}
      put(idsArray);
    });

    displayTable.on("click", "a.delBtn", function(event) { //DELETE CLICK LISTENER
			event.preventDefault();
			var row = $(this).parents('tr');
			var toBeRemoved = $(this).parents('tr').find("." + classId).attr("value");
			del(toBeRemoved, row);
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
			inGroups = data;
			data.forEach(function(assetgroup) {
					addRow(assetgroup);
			});
		})
		.then(() => {
			resetDropdown();
			getOutGroups();
		})
}

function getOutGroups() {
	$.ajax({
		type: "GET",
		url: "/api/AssetGroups",
		headers: {"authId": authId},
		dataType: 'json'
	})
	.done(data => {
		var contains;
		data.forEach(group => {
			contains = inGroups.some(ingroup => {
				return JSON.stringify(group) === JSON.stringify(ingroup)
			})
			if(!contains) {
				addOption(group);
			}
		});
	})
}

function put(idsArray) {
    $.ajax({
        type: "PUT",
        url: url.put,
        data: JSON.stringify(idsArray),
        datatype: "json",
        contentType: 'application/json',
    })
		.done(data => {
      // add row to table for each group added
				idsArray.forEach(toAdd => {
					data.forEach(assetgroup => {
						if (assetgroup.assetGroupId === toAdd) {
							inGroups.push(assetgroup);
							addRow(assetgroup);
						}
					});
				});
		})
		.then(() => {
			resetDropdown();
			getOutGroups();
		})
}

function del(toBeRemoved, row) {
	var assetGroup = [];
	assetGroup.push(+toBeRemoved);

	$.ajax({
		type: "DELETE",
		url: `/api/UserGroups/${id}/AssetGroups`,
		headers: {"authId": authId},
		data: JSON.stringify(assetGroup),
		dataType: 'json',
    contentType: 'application/json'
	})
	.done(data => {
		inGroups = inGroups.filter(group => {
			return group.assetGroupId !== +toBeRemoved
		})
		row.remove();
		resetDropdown();
		getOutGroups();
	})
}

function addRow(data) {
    var newRow = $("<tr>" +
        "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
        "<td class='" + classId + "' value=" + data.assetGroupId + ">" + data.assetGroupName + "</td>" +
    "</tr>");
    displayTable.append(newRow);
}

function addOption(data) {
    var newOption = $("<option></option>", {value: data.assetGroupId, text: data.assetGroupName});
    $("#outAgs").append(newOption);
    $('select').formSelect();
}

function resetDropdown() {
    $("select").empty();
    var def = $("<option disabled> Choose AssetGroup </option>");
    $("select").append(def);
    $('select').formSelect();
}

function setText() {
    $("a.goBack").attr("href", "usergroups/group/index.shtml?groupId=" + id);
    $.getJSON("/api/UserGroups/" + id, function(data) {
        $("#usergroupName").text(data.userGroupName);
    });
}
