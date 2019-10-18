
/*global $, document, window */
/**************************************************************************************************************************************/
var ID;
var alarmForm = document.querySelector("#alarmForm");
var calcForm = document.querySelector("#calcForm");
var confirmText = "Are you sure want to delete this ";

$(document).ready(function() {
  init();
  $("#newalarmSubmit").on("click", function(event) { // on click for submit button, creating new alarm
    event.preventDefault();
    if(!alarmForm.checkValidity()) {
      var tmpSubmit = document.createElement('button') // creates 'fake' submit button to trigger form validation
      alarmForm.appendChild(tmpSubmit)
      tmpSubmit.click()
      alarmForm.removeChild(tmpSubmit)
    } else {
      postAlarm(); // api POST call and row append
    }
  });

  $("#alarmList").on("click",  "a.delBtn", function(event) { //on click for delete button
    event.stopPropagation();
    //select row and corresponding alarmDefinitionId
    var row = $(this).parents('tr');
    var alarmDefinitionId = $(this).parents('tr').find('.alarmDefinitionId').attr("value");
    if (confirm(confirmText + "alarm?")) {
      deleteAlarm(alarmDefinitionId, row); // DELETE request and remove corresponding row
    }
  });

  /* CLICK LISTENERS FOR CALCULATION */
  // $("#alarmList").on("click", "a.calcDialog", function(event) { // on click open calculation dialog for alarm
  //   event.stopPropagation();
  //   var alarmDefinitionId = $(this).parents('tr').find('.alarmDefinitionId').attr("value");
  //   var alarmName = $(this).parents('tr').find('.alarmDefinitionId').html();
  //   var calcCall = getCalcCall(alarmDefinitionId);
  //   var createdialog = new Promise(function(resolve, reject) {
  //     getDataPoints();
  //     resolve("success");
  //   });
  //   createdialog.then(function(result) {
  //     getCalcs(calcCall);
  //   });
  //   $("#calcAlarmDefinitionId").attr("value", alarmDefinitionId);
  //   $("#calcAlarmDefinitionId").text(alarmName);
  //   $("#calculationDialog").dialog("open");
  // });

  $("#alarmList").on("click", "a.calcDialog", function(event) { // on click open calculation dialog for alarm
    event.stopPropagation();
    var alarmDefinitionId = $(this).parents('tr').find('.alarmDefinitionId').attr("value");
    var alarmName = $(this).parents('tr').find('.alarmDefinitionId').html();
    var calcCall = getCalcCall(alarmDefinitionId);
    var createdialog = new Promise(function(resolve, reject) {
      getDataPoints();
      resolve("success");
    });
    createdialog.then(function(result) {
      getCalcs(calcCall);
    });
    $("#calcAlarmDefinitionId").attr("value", alarmDefinitionId);
    $("#calcAlarmDefinitionId").text(alarmName);
    $(".modal").modal("open");
    //$("#calculationDialog").dialog("open");
  });

  $("#newCalcSubmit").on("click", function(event) { // POST NEW CALC BUTTON
    event.preventDefault();
    if(!calcForm.checkValidity()) {
      var tmpSubmit = document.createElement('button'); // creates 'fake' submit button to trigger form validation
      calcForm.appendChild(tmpSubmit);
      tmpSubmit.click();
      calcForm.removeChild(tmpSubmit);
    } else {
      postCalc(); // api POST call and row append
    }
  });

  $("#calcList").on("click",  "a.delBtn", function(event) { //on click for Calculation delete button
    event.stopPropagation();
    //select row and corresponding alarmDefinitionId
    var row = $(this).parents('tr');
    var calcId = $(this).parents('tr').find('.calcId').attr("value"); //return first value of td with .edit class, Alarm ID column
    deleteCalc(calcId, row); // DELETE request and remove corresponding row
  });
});
/* ***************************** DOM MANIPULATION / OTHER FUNCTIONS ******************************* */

function init() {
  var call = getAlarmCall(); // get model ID from url and create api call string
  $("#modelId").text(ID); // set model id at top of page
  $("#backBtn").attr("href", "assetdefinitions/configure/?assetdefinitionid=" + ID) // set go back href
  $("#selfAck").formSelect();

  $.getJSON("/api/assetdefinitions/" + ID, function(data) { //set model name
    $("#modelName").html(data.assetDefinitionName);
  });
  getAlarms(call); // call api and make table
      /* SETTING ONCLICK LISTENERS */
  $("#createBtn").on("click", function(event) {  //toggle alarm form hide
    if($("#alarmForm").is(":hidden")) {
      $("#alarmForm").slideDown();
    } else {
      $("#alarmForm").slideUp();
    }
  });
  toggleTableEdit(); // set on click for edit/save button
}

function getAlarmCall() {
  ID = getParameterByName("assetDefinitionId")
  var call = api+"/assetdefinitions/" + ID + "/alarmdefinitions";
  return call;
}

function addAlarmRow(alarm) { //builds html for each table row in the model list
    var newRow = $("<tr>" +
      "<td class='delCol'> <a class='delBtn' > <i class='small material-icons'>delete</i> </a></td>" +
      "<td class='editCol'> <a class=''><i class='editBtn small material-icons'>edit</i></a> </td>" +
      "<td class='edit alarmDefinitionId' contenteditable='false' value=" + alarm.alarmDefinitionId + ">" + alarm.name + "</td>" +
      "<td class='edit' contenteditable='false' >" + alarm.reason + "</td>" +
      "<td class='edit' contenteditable='false' >" + alarm.severity + "</td>" +
      "<td class='edit' contenteditable='false' >" + alarm.escalation + "</td>" +
      "<td class='edit' contenteditable='false' >" + alarm.expiration + "</td>" +
      "<td class='edit' contenteditable='false' >" + alarm.selfAck + "</td>" +
      "<td > <a class='calcDialog'>View</a> </td>" +
    "</tr>");
    $("#alarmList").append(newRow);
}

function clearForm() {
  $("#name").val("");
  $("#severity").val("");
  $("#escalation").val("");
  $("#expiration").val("");
  $("#selfAck").val("");
  $("#reason").val("");
}

function toggleTableEdit() {
  $("#alarmList").on("click", "i.editBtn", function(event) {
    event.stopPropagation();
    var TDs = $(this).parents('tr').find('.edit'); //grabs all tds in a row
    if ($(this).text() === "edit" ) { // change edit button text
      $(this).text("save");
      $.each(TDs, function() {
        $(this).prop("contenteditable", true);
        $(this).css({"background-color": "white", "color": "black"});
      });
    } else if ($(this).text() === "save") {
      $.each(TDs, function() {
        $(this).prop("contenteditable", false);
        $(this).css({"background-color": "", "color": ""});
      });
        var alarm = {
          alarmDefinitionId: $(TDs[0]).attr("value"),
          name: $(TDs[0]).html(),
          reason: $(TDs[1]).html(),
          severity: $(TDs[2]).html(),
          escalation: $(TDs[3]).html(),
          expiration: $(TDs[4]).html(),
          selfAck: $(TDs[5]).html()
        };
      editAlarm(alarm);
      $(this).text("edit"); //do last
    }
  });
}

/* ***************************** AJAX CALLS *************************************************** */
function getAlarms(call) {
  $.getJSON(call, (data) => { //make api call to specific model Id
    data.forEach(function(alarm) { //loops through addRow function to generate alarm list
      addAlarmRow(alarm);
    });
  });
}

function postAlarm() { // Post new alarm to DB and append row to bottom of table
  var url = api+"/assetdefinitions/" + ID + "/alarmdefinitions";
  var alarm = {
    name: $("#name").val(),
    reason: $("#reason").val(),
    severity: $("#severity").val(),
    escalation: $("#escalation").val(),
    expiration: $("#expiration").val(),
    selfAck: ($("#selfAck").val() === 'true') ? 1 : 0,
      jobId:0
  };
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(alarm),
    datatype: "json",
    contentType: 'application/json'
  })
  .done(data => {
    addAlarmRow(data);
    clearForm();
  })
  .fail(e => {
    console.log("failed :(");
  })
}

function deleteAlarm(alarmDefinitionId, row) { // Delete alarm in DB and remove corresponding ro
  var deleteUrl = api+"/assetdefinitions/"+ID+"/alarmdefinitions/" + alarmDefinitionId;
  $.ajax({
    type: "DELETE",
    url: deleteUrl,
    contentType: 'application/json',
  })
  .done(data => {
    row.remove();
  })
  .fail(e => {
    alert("something went wrong");
  })
}

function editAlarm(alarm) {
  var editUrl = api+"/alarmdefinitions/edit/" + alarm.alarmDefinitionId;
  $.ajax({
    type: "PUT",
    url: editUrl,
    data: alarm,
    datatype: "json",
    contentType: 'application/json',
  })
  .done((data) => {
  })
  .fail(e => {
    alert("Something went wrong :( Please try again!");
  })
}
