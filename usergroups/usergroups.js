/*global $, document, window */
/**************************************************************************************************************************************/

var UserGroups=[];
var usergroupForm = document.querySelector("#userGroupForm");
var url = {
        get: api+"/UserGroups",
        post: api+"/UserGroups",
        delete: api+"/UserGroups/"
}
var authId = localStorage.getItem("authId");

$(document).ready(function() {
    getUserGroups();

    $(".createBtn").on("click", function(event) {  //toggle alarm form hide
        if($("#userGroupForm").is(":hidden")) {
            $("#userGroupForm").slideDown();
        } else {
            $("#userGroupForm").slideUp();
        }
		})

    $("#usergroupSubmit").on("click", function(event) {
        event.preventDefault();
        if(!usergroupForm.checkValidity()) {
            var tmpSubmit = document.createElement('button') // creates 'fake' submit button to trigger form validation
            usergroupForm.appendChild(tmpSubmit)
            tmpSubmit.click()
            usergroupForm.removeChild(tmpSubmit)

        } else {
            postUsergroup(); // api POST call and row append
        }
    });
    $("#userGroupTable").on("click", "a.delBtn", function(event) {
        event.stopPropagation();
        var row = $(this).parents("tr");
        var id = row.find('.usergroupId').attr("value");
        if (confirm("Are you sure you want to delete this User Group?")) {
          deleteUsergroup(id, row);
        }
    });
});
/********************************* USER GROUP FUNCTIONS *******************************/
function getUserGroups(){ // GET

    $.ajax({
			type: "GET",
			url: url.get,
			headers: {"authId": authId},
			dataType: "json",
		})
		.done(data => {
			data.forEach(function(userGroup) {
            addRow(userGroup);
        });
		})
}

function postUsergroup() { // POST
    var userGroup = {
            userGroupId: 0,
            userGroupName : $("#name").val(),
            description : $("#description").val(),
            parentGroupId: 1
    }
    $.ajax({
      type: "POST",
      url: url.post,
			headers: {"authId": authId},
      data: JSON.stringify(userGroup),
      contentType: 'application/json',
      datatype: "json",
    })
		.done(data => {
			//console.log(data);
			addRow(data);
			clearForm();
		})
}

function deleteUsergroup(id, row) { //DELETE
    $.ajax({
        type: "DELETE",
        url: url.delete + id,
				headers: {"authId": authId},
        datatype: "json",
        contentType: 'application/json'
    })
		.done(data => row.remove())
}
            /************************************ UI FUNCTIONS *************************************/
function addRow(userGroup) {
    var newRow = $("<tr>" +
                        "<td> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
                        "<td> <a class='viewBtn' href='usergroups/group/?groupId=" + userGroup.userGroupId + " ' >View</a> </td>" +

                        "<td class='usergroupId' value=" + userGroup.userGroupId + ">" + userGroup.userGroupName + "</td>" +
                        "<td>" + userGroup.description + "</td>" +
                  "</tr>");

    $("#userGroupTable tbody").append(newRow);
}

function clearForm() {
    $("#name").val("");
    $("#description").val("");
}

/************************************** OTHER FUNCTIONS ********************************************/

//$('#newAlertDialog').dialog({
//    hide:{effect:"fade"},
//      show:{effect:"fade"},
//    autoOpen:false,
//    title:"New Alert",
//    buttons:[
//        {
//            text:"Create",
//            click:function(){
//                genericAlertCreate()
//                $(this).dialog("close")
//            }
//        },
//        {
//            text:"Cancel",
//            click:function(){$(this).dialog("close")}
//        }
//    ]
//});
//
// function genericAlertCreate(){
//     jqGet('/api/GenericAlertCreate',
//     {
//         assetGroupId:$('.assetGroupSelect').val(),
//         userGroupId: window['userGroupId'],
//         severityMin:$('#sevMin').val(),
//         severityMax:$('#sevMax').val(),
//         status:$('#alarmStatus').val(),
//         Online:$('#alertOn').prop("checked"),
//         Offline:$('#alertOff').prop("checked")
//     },function(data,status,xhr){
//         if(!data.error.status){
//           loadAlertTable(data)
//         }
//         else{
//              errorHandle(data.error)
//              $('.ugDash').show("fade")
//         }
//     },'json')
// }
//
// function userGroupGetAlerts(userGroupId,userGroupName){
//     $('.ugTab').hide("fade")
//     $('.ugEditAlerts > h1').html(userGroupName)
//     $.get(
//         api+'/UserGroups/'+userGroupId+'/Alerts',
//         {},
//         function(data,status,xhr){
//              if(!data.error.status){
//                  loadAlertTable(data)
//             }
//             else{
//                  errorHandle(data.error)
//                  $('.ugDash').show("fade")
//             }
//         },
//         'json'
//     )
// }
//
//
//
// function userGroupGetPermissions(userGroupId){
//      var userGroup = UserGroup(userGroupId)
//     $('.ugTab').hide("fade")
//     $('.ugEditPermissions > h1').html(userGroup.userGroupName)
//     $('#ugApplyPermissionsChanges').unbind()
//     $('#ugApplyPermissionsChanges').attr("onclick","userGroupSetPermissions("+userGroupId+")")
//     $.get(
//         api+'/UserGroups/'+userGroupId+'/Permissions',
//         {},
//         function(data,status,xhr){
//              if(data.error.status==false){
//                  buildConnectedLists("ugPermConnected","permissionId","permissionName",data.inPermissions,data.outPermissions)
//             }
//             else{
//                 errorHandle(data.error)
//                 $('.ugTab').show("fade")
//             }
//         },
//         'json'
//     )
// }
//
//
// function userGroupGetAssetGroups(userGroupId,userGroupName){
//     $('.ugTab').hide("fade")
//     $('.ugEditAg > h1').html(userGroupName)
//     $('#ugApplyAgChanges').unbind()
//     $('#ugApplyAgChanges').click(function(){userGroupSetAssetGroups(userGroupId)})
//     $.get(
//         api+'/UserGroups/'+userGroupId+'/AssetGroups',
//         {},
//         function(data,status,xhr){
//              if(!data.error.status){
//                  buildConnectedLists("ugAgConnected","assetGroupId","assetGroupName",data.inAssetGroups,data.outAssetGroups)
//             }
//             else{
//                  errorHandle(data.error)
//                  $('.ugDash').show("fade")
//             }
//         },
//         'json'
//     )
// }
//
//
//
// function userGroupGetDashboard(userGroupId){
//     var userGroup = UserGroup(userGroupId)
//     if(userGroup.userGroupName){$('.dashBody > h1').html(userGroup.userGroupName)}
//     $.get(
//         api+'/UserGroups/'+userGroupId+'/Info',{},
//         function(data){
//             $('#ugAgTable > table').children().remove()
//             $('#ugAgTable > button').unbind("click")
//             $('#ugAgTable > button').bind("click",function(){userGroupGetAssetGroups(userGroupId)})
//             $('#ugAgTable > table').append('<tr><th>Asset Groups</th></tr>')
//             for(var i = 0 ; i < data.AssetGroups.length; i++){
//                 $('#ugAgTable > table').append('<tr><td>{0}</td></tr>'.formatMyString(data.AssetGroups[i].assetGroupName))
//             }
//             $('#ugUserTable > table').children().remove()
//             $('#ugUserTable > button').unbind("click")
//             $('#ugUserTable > button').bind("click",function(){userGroupGetUsers(userGroupId)})
//             $('#ugUserTable > table').append('<tr><th>Users</th></tr>')
//             for(var i = 0 ; i < data.Users.length; i++){
//                 $('#ugUserTable > table').append('<tr><td>{0}</td></tr>'.formatMyString(data.Users[i].username))
//             }
//             $('#ugPermTable > table').children().remove()
//             $('#ugPermTable > button').unbind("click")
//             $('#ugPermTable > button').bind("click",function(){userGroupGetPermissions(userGroupId)})
//             $('#ugPermTable > table').append('<tr><th>Permissions</th></tr>')
//             for(var i = 0 ; i < data.Permissions.length; i++){
//                 $('#ugPermTable > table').append('<tr><td>{0}</td></tr>'.formatMyString(data.Permissions[i].permissionName))
//             }
//             $('#ugJobTable > table').children().remove()
//             $('#ugJobTable > button').unbind("click")
//             $('#ugJobTable > button').bind("click",function(){userGroupGetJobs(userGroupId)})
//             $('#ugJobTable > table').append('<tr><th>Jobs</th></tr>')
//             for(var i = 0 ; i < data.Jobs.length; i++){
//                 $('#ugJobTable > table').append('<tr><td>{0}</td></tr>'.formatMyString(data.Jobs[i].jobName))
//             }
//             $('#ugAlertTable > table').children().remove()
//             $('#ugAlertTable > button').unbind("click")
//             $('#ugAlertTable > button').bind("click",function(){userGroupGetAlerts(userGroupId)})
//             $('#ugAlertTable > table').append('<tr><th colspan="2">Alerts</th></tr>')
//             try {
//                 for(var i = 0 ; i < data.GenericAlerts.length; i++){
//                     $('#ugAlertTable > table').append('<tr><td>{0}</td><td>{1}</td></tr>'.formatMyString(window['assetGroups_index'][data.GenericAlerts[i].assetGroupId].assetGroupName,data.GenericAlerts[i].status))
//                 }
//             }
//             catch(e){console.log("Generic Alerts are not supported.")}
//             $('.ugTab').hide()
//             $('.ugDash').show('fade')
//         },'json'
//     )
// }
// function userGroupSetAssetGroups(userGroupId){
//     var inAssetGroups=getSelectedFromList("ugAgConnected")
//     $.ajax({
//         type:"PUT",
//         url:api+'/UserGroups/'+userGroupId+'/AssetGroups',
//         data:JSON.stringify({userGroupId:parseInt(userGroupId),assetGroupIds:inAssetGroups}),
//         success:function(data){
//             if(data.error.status){
//                 errorHandle(data.error)
//             }
//             else{
//             userGroupGetDashboard(userGroupId)
//             }
//         },
//         dataType:'json'
//         })
// }
//
//
//
// function userGroupSetPermissions(userGroupId){
//     var inPermissions=getSelectedFromList("ugPermConnected")
//     $.ajax({
//         url:api+"/UserGroups/"+userGroupId+"/Permissions",
//         type:"PUT",
//         data:JSON.stringify({permissionIds:inPermissions,userGroupId:userGroupId}),
//         success:function(data){console.log(data)
//             if(data.error.status){
//                 errorHandle(data.error)
//             }
//             else{
//             userGroupGetDashboard(userGroupId)
//             }
//         },
//         dataType:'json'
//     })
// }
