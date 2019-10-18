
/*global $, document, window */
/**************************************************************************************************************************************/
var id = window.location.href.split("=").pop();
var userId;
var url = {
        get: "/LimeWeb/UserGroups/" + id + "/Users",
        post: "/LimeWeb/UserGroups/" + id + "/Users",
    }

$(document).ready(function() {   
    setText();    
    getUsers();
    $('select').formSelect();
       
    $("#userSubmit").on("click", function(event) { //PUT CLICK LISTENER
        event.preventDefault();
        var userIdsArray = $('select').formSelect('getSelectedValues');
        $('#userTable').children('tbody').find("td").each(function() {
            
            if( $(this).hasClass("userId")) {
                userIdsArray.push($(this).attr("value"));
            }
        });
        
        for (var i=0; i < userIdsArray.length; i++) {
            userIdsArray[i] = parseInt(userIdsArray[i]);
        }
        
        putUser(userIdsArray);
    });
    
    $("#userTable").on("click", "a.delBtn", function(event) { //DELETE CLICK LISTENER
        event.preventDefault();
        var toBeRemoved = $(this).parents('tr').find('.userId').attr("value");
        var userIdsArray = [];
        
        $('#userTable').children('tbody').find("td").each(function() {         
            if( $(this).hasClass("userId")) {
                if($(this).attr("value") !== toBeRemoved) {
                    userIdsArray.push($(this).attr("value"));
                }               
            }
        });
        
        for (var i=0; i < userIdsArray.length; i++) {
            userIdsArray[i] = parseInt(userIdsArray[i]);
        }
        console.log(userIdsArray);
        putUser(userIdsArray);
    });
    
});


function getUsers() {
    $.getJSON(url.get, function(data) {
        var users = data["inUsers"] || data["Users"];
        users.forEach(function(user) {
            addRow(user);
        });
        
        resetDropdown();
        data["outUsers"].forEach(function(user) {
            addOption(user);
        });
        
    });
}

function putUser(userIdsArray) {
    
    var inUsers = [];
    for (var i = 0; i < userIdsArray.length; i++) {       
        var a = {
            userId : userIdsArray[i],
        }
        inUsers.push(a);
    }    
    console.log(inUsers);
    $.ajax({
        type: "PUT",
        url: "/LimeWeb/UserGroups/" + id + "/Users",
        data: JSON.stringify(userIdsArray),
        datatype: "json",
        fail: function() {console.log("failed :(")},
        success: function(data) {
            $("#userTable").children("tbody").find("tr").remove();
            getUsers();
        } 
    });
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
    $("a.goBack").attr("href", "../?groupId=" + id);
    $.getJSON("/LimeWeb/UserGroups/" + id, function(data) {
        $("#usergroupName").text(data["UserGroup"].userGroupName);
    });
}



//function userGroupGetUsers(userGroupId){
//     var userGroup = UserGroup(userGroupId)
//    $('.ugTab').hide("fade")
//    $('.ugEdit > h1').html(userGroup.userGroupName)
//    $('#ugApplyChanges').unbind()
//    $('#ugApplyChanges').attr("onclick","userGroupSetUsers("+userGroupId+")")
//     $.get(
//        LimeWeb_host+'/UserGroups/'+userGroupId+'/Users',
//        {},
//        function(data,status,xhr){
//             if(data.error.status==false){
//                 buildConnectedLists("ugUserConnected","userId","username",data.inUsers,data.outUsers)
//            }
//            else{
//                 errorHandle(data.error)
//            }
//        },
//        'json'
//    )
//}

//function userGroupSetUsers(userGroupId){
//    var inUsers=getSelectedFromList("ugUserConnected")
//    $.ajax({
//        type:"PUT",
//        url:"/LimeWeb/UserGroups/"+userGroupId+"/Users",
//        data:JSON.stringify({userGroupId:userGroupId,userIds:inUsers}),
//        success:function(data){
//            userGroupGetDashboard(userGroupId)
//        },
//        dataType:'json'
//    })
//}