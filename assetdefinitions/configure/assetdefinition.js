//$.ajax({
//  dataType: "json",
//  url: url,
//  data: data,
//  success: success
//});
/*global $, document */
/******************************************************************************************************************/
var ID = getParameterByName('assetDefinitionId');
var assetDefinition;
var asset;
var dashboard;
$(document).ready(function() {
  getAssetDefinition()
  .then(() => {
    getAsset()
    .then(() => {
      getDashboard()
      .then(() => {
        addName();
        addLinks();
      });
    })
  })
})
// function getCall() {
//     var call = api+"/assetDefinitions/" + ID;
//     return call;
// }

function getAssetDefinition() {
  return $.getJSON(api+"/assetDefinitions/"+ID, function(data) {
      assetDefinition = data;
  });
}

function getAsset() {
  return $.getJSON(api+'/assetDefinitions/'+ID+'/assets', (data) => {
    asset = data[0];
  })
}

function getDashboard() {
  return $.getJSON(api+'/assetDefinitions/'+ID+'/dashboards', (data) => {
    if(data.length !== 0) {
      dashboard = data[0];
    } else {
      postNewDashboard();
    }
  });
}

function postNewDashboard() {
  const dash = {
    "dashboardId": 0,
    "dashboardName": 'assetDef'+ID+'dashboard',
    "systemDefinitionId": null,
    "assetDefinitionId": ID,
    "config": ''
  }
  const url = api+'/dashboards';
  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(dash),
    dataType: 'json',
    contentType: 'application/json'
  })
  .then( (data) => {
    dashboard = data;
  });
}

function addLinks() { // add model id to html and button links

  $("#modelId").text(ID);
	$("#alarmIcon").attr("href", "assetdefinitions/configure/alarms/?assetDefinitionId="+ID);
	$("#alarmButton").attr("href", "assetdefinitions/configure/alarms/?assetDefinitionId="+ID);

  $("#dataitemsButton").attr("href", "assetdefinitions/configure/dataItems/?assetDefinitionId="+ID);
  $("#dataIcon").attr("href", "assetdefinitions/configure/dataItems/?assetDefinitionId="+ID);

  $("#dashButton").attr("href", "dashboard/index.html?dashboardId="+dashboard.dashboardId+"&assetDefinitionId="+ID+"&assetId="+asset.assetId+"&mode=builder");
	$("#dashboardIcon").attr("href", "dashboard/index.html?dashboard="+dashboard.dashboardId+"&assetDefinitionId="+ID+"&assetId="+asset.assetId+"&mode=builder");
}

function addName() { // add model name to html
    var name = assetDefinition.assetDefinitionName;
    $("#modelName").text(name);
}
