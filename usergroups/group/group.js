/*global $, document, window */
/**************************************************************************************************************************************/
var id = window.location.href.split("=").pop();
var url = api+"/UserGroups/" + id;

$(document).ready(function() {
    $.getJSON(url, function(data) { //make api call to specific model Id
        addId(data); //fill in html with approriate modelID content
        addName(data);
    });
});
function addId() { // add model id to html and button links
    $("#usersBtn").attr("href", "usergroups/group/users/?usergroup=" + id);
    $("#permissionsBtn").attr("href", "usergroups/group/permissions/?usergroup=" + id);
    $("#assetgroupsBtn").attr("href", "usergroups/group/assetgroups/?usergroup=" + id);
    $("#alertsBtn").attr("href", "usergroups/group/alerts/?usergroup=" + id);
}

function addName(usergroup) { // add model name to html
    var name = usergroup.userGroupName;
    $("#usergroupName").text(name);
}
