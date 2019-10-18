/*global $, document, window */

$('.modal').modal({ //modal init
  onCloseEnd: function() {
    $("#calcTable tr").each(function(){
      $(this).remove();
    });
  }
});

// $('#calculationDialog').dialog({
//   autoOpen:false,
//   modal:true,
//   width: 525,
//   height: 600,
//   hide:{effect:"fade"},
//   show:{effect:"fade"},
//   title:"Calculations",
//   close: function() {
//     //remove rows
//     $("#calcList tr").each(function() {
//       $(this).remove();
//     });
//   }
// });

$("#calcCreateBtn").on("click", function(event) {  //toggle calculation form hide
  if($("#calcForm").is(":hidden")) {
    $("#calcForm").slideDown();
  } else {
    $("#calcForm").slideUp();
  }
});

function getCalcCall(alarmDefinitionId) {
  var call = api+"/alarmdefinitions/" + alarmDefinitionId + "/alarmcalculations";
  return call;
}

function getCalcs(call) {
  $.getJSON(call, function(data) { //make api call to specific model Id
    data.forEach(function(calc) { //loops through addRow function to generate alarm list
      addCalcRow(calc);
    });
  });
}

function postCalc() {
  var postUrl = api+"/alarmcalculations";
  var calc = {
    alarmDefinitionId: $("#calcAlarmDefinitionId").attr("value"),
    dataItemId: $("#dataPointSelect").val(),
    operator: $("#operator").val(),
    value: $("#value").val(),
    maxFreq: $("#maxFreq").val()
  }
  $.ajax({
    type: "POST",
    url: postUrl,
    data: JSON.stringify(calc),
    datatype: "json",
    contentType: 'application/json'
  })
  .done(data => {
    addCalcRow(data);
    clearFormCalc();
  })
}

function deleteCalc(calcId, row) {
  var delUrl = api+"/alarmcalculations/" + calcId;
  $.ajax({
    type: "DELETE",
    url: delUrl,
    contentType: 'application/json'
  })
  .done(data => {
    console.log("Delete Successful");
    row.remove();
  })
}

function getDataPoints() {
  dataPointUrl = api+"/assetdefinitions/" + ID + "/dataitemdefinitions";
  $.getJSON(dataPointUrl, function(data) {
    data.forEach(function(dataPoint) {
      addOption(dataPoint);
    });
    $('select').formSelect();
  });
}
/**********************************************************************************************/
function addCalcRow(calc) { //builds html for each table row in the model list
  var label = $("#dataPointSelect option[value=" + calc.dataItemId + "]").html();
  var newRow = $("<tr>" +
      "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a></td>" +
      "<td class='calcId' value=" + calc.alarmCalculationId + ">" + label + "</td>" +
      "<td class='edit' >" + calc.operator + "</td>" +
      "<td class='edit' >" + calc.value + "</td>" +
      "<td class='edit' >" + calc.maxFreq + "</td>" +
    "</tr>");
  $("#calcList").append(newRow);
}

function addOption(dataPoint) {
  var newOption = $("<option  value=" + dataPoint.dataItemId + ">" + dataPoint.label + "</option>");
  $("#dataPointSelect").append(newOption);
}

function clearFormCalc() {
  $("#dataPointSelect option:first").prop('selected', true);
  $("#operator option:first").prop('selected', true);
  $("#value").val("");
  $("#maxFreq").val("");
}
