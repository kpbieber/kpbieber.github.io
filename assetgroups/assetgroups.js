/*global $, document, window */
/**************************************************************************************************************************************/
var authId = localStorage.getItem("authId");
var assetgroupForm = document.querySelector("#assetgroupForm");
var addAssetForm = document.querySelector("#addAssetGroup");
var outAssetSelect = document.querySelector("#outAssets");
var id;
var name;
var inAssets;

$(document).ready(function() {
  getAssetGroups();
  $("select").formSelect(); //initialize form select
  /* SETTING ONCLICK LISTENERS */
  $(".createBtn").on("click", function(event) {
    //toggle form hide for both assetGroup and in/out assets
    if (!$("#main").is(":hidden")) {
      if ($("#assetgroupForm").is(":hidden")) {
        $("#assetgroupForm").slideDown();
      } else {
        $("#assetgroupForm").slideUp();
      }
    } else {
      if ($("#addAssetForm").is(":hidden")) {
        $("#addAssetForm").slideDown();
      } else {
        $("#addAssetForm").slideUp();
      }
    }
  });

  $("#assetgroupSubmit").on("click", function(event) {
    // form submit button
    if (!assetgroupForm.checkValidity()) {
      var tmpSubmit = document.createElement("button"); // creates 'fake' submit button to trigger form validation
      assetgroupForm.appendChild(tmpSubmit);
      tmpSubmit.click();
      assetgroupForm.removeChild(tmpSubmit);
    } else {
      assetGroupCreate();
    }
  });

  $("#assetGroupTable").on("click", "a.delBtn", function(event) {
    // DELETE assetGroup btn listener
    event.stopPropagation();
    var row = $(this).parents("tr");
    id = row.find(".assetGroupId").attr("value");
    name = row.find(".assetGroupId").text();
    if(confirm('Are you sure you want to delete this Asset Group?')) {      
      del(id, row);
    }
  });

  $("#assetGroupTable").on("click", "i.editBtn", function(event) {
    // Edit
    event.stopPropagation();
    var row = $(this).parents("tr");
    id = row.find(".assetGroupId").attr("value");
    name = row.find(".assetGroupId").text();
    $("#main").hide();
    $("#editList").removeClass("hide");
    $("#assetGroupName").text(name);
    getAssetGroupAssets();
    //populate asset dropdown
  });

  $("#assetGroupAssetsList").on("click", "a.delBtn", function(event) {
    event.stopPropagation();
    // remove asset from inAssets and put in outAssets
    var row = $(this).parents("tr");
    var toBeRemoved = $(this).parents("tr").find(".assetId").attr("value");
    delAsset(toBeRemoved, row);
  });

  $("#assetSubmit").on("click", function(event) {
    event.preventDefault();
    var assetIdsArray = $("select").formSelect("getSelectedValues");
    //grab asset id's of assets in table
    $("#assetGroupAssetsList")
      .children("tbody")
      .find("td")
      .each(function() {
        if ($(this).hasClass("assetId")) {
          assetIdsArray.push($(this).attr("value"));
        }
      });
    for (var i = 0; i < assetIdsArray.length; i++) {
      assetIdsArray[i] = parseInt(assetIdsArray[i]);
    }
    putAsset(assetIdsArray);
  });
});
/***************************************************** ASSET GROUP FUNCTIONS *******************************************************/
function addRow(assetGroup) {
  var newRow = $(
    "<tr>" +
      "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
      "<td class='editCol'> <a class=''><i class='editBtn small material-icons'>edit</i></a> </td>" +
      "<td class='assetGroupId' value=" + assetGroup.assetGroupId + ">" + assetGroup.assetGroupName + "</td>" +
      "<td class='description'>" + assetGroup.description + "</td>" +
    "</tr>"
  );
  $("#assetGroupTable").append(newRow);
}

function backToMain() {
  $("#editList").addClass("hide");
  $("#main").show();
  $("#assetGroupAssetsList")
    .children("tbody")
    .find("tr")
    .remove();
}

function assetGroupCreate() {
  var assetGroup = {
    assetGroupId: 0,
    assetGroupName: $("#name").val(),
    parentGroupId: 1, //parseInt($('.assetGroupSelect').val()),
    adminId: 1,
    description: $("#description").val()
  };

  $.ajax({
    type: "POST",
    url: "/api/AssetGroups",
    headers: { authId: authId },
    data: JSON.stringify(assetGroup),
    dataType: "json",
    contentType: "application/json",
    fail: function() {
      console.log("failed :(");
    }
  })
  .done(data => {
    addRow(assetGroup);
  })
  .fail(e => console.log(e));
}

function getAssetGroups() {
  $.ajax({
    url: "/api/AssetGroups",
    type: "GET",
    headers: { authId: authId },
    datatype: "json"
  }).done(data => {
    data.forEach(function(assetGroup) {
      addRow(assetGroup);
    });
  })
  .fail(e => console.log(e));
}

function del(agId, row) {
  $.ajax({
    type: "DELETE",
    url: api+"/AssetGroups/" + agId,
    headers: { authId: authId },
    contentType: 'application/json',
    datatype: "json",
    fail: function() {
      console.log("failed");
    }
  }).done(data => {
    console.log("delete successful");
    row.remove();
  })
  .fail(e => console.log(e));
}
/***************************************************** IN/OUT ASSET FUNCTIONS *******************************************************/
function getAssetGroupAssets() {
  var url = api+"/AssetGroups/" + id + "/Assets/";
  $.ajax({
    type: "GET",
    url: url,
    headers: { authId: authId },
    dataType: "json"
  })
    .done(data => {
      //console.log(data["inAssets"]);
      inAssets = data;
      data.forEach(function(asset) {
        var newAsset = $(
          "<tr>" +
            "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
            "<td class='assetId' value=" +
            asset.assetId +
            ">" +
            asset.assetAlias +
            "</td>" +
            "</tr>"
        );
        $("#assetGroupAssetsList").append(newAsset);
      });
      resetDropdown();
    })
    .then(data => {
      getOutAssetGroupAssets();
    })
    .fail(e => console.log(e));
}

function getOutAssetGroupAssets() {
  $.ajax({
    type: "GET",
    url: api+"/assets",
    headers: { authId: authId },
    dataType: "json"
  })
    .done(data => {
      data.forEach(function(asset) {
        var contains = inAssets.some(inasset => {
          return JSON.stringify(asset) === JSON.stringify(inasset);
        });
        if (!contains) {
          console.log("hello from out group assets");
          var newOption = $("<option></option>", {
            value: asset.assetId,
            text: asset.assetAlias
          });
          $("#outAssets").append(newOption);
          $("select").formSelect();
        }
      });
    })
    .fail(e => console.log(e));
}

function putAsset(assetIdsArray) {
  //console.log(assetIdsArray);
  $.ajax({
    type: "PUT",
    url: api+"/AssetGroups/" + id + "/Assets/",
    data: JSON.stringify(assetIdsArray),
    datatype: "json",
    fail: function() {
      console.log("failed :(");
    }
  }).done(data => {
    $("#assetGroupAssetsList")
      .children("tbody")
      .find("tr")
      .remove();
    getAssetGroupAssets();
  })
  fail(e => console.log(e));
}

function delAsset(toBeRemoved, row) {
  var asset = [];
  asset.push(+toBeRemoved);

  $.ajax({
    type: "DELETE",
    url: `${api}/AssetGroups/${id}/Assets`,
    data: JSON.stringify(asset),
    dataType: "json"
  }).done(data => {
    inAssets = inAssets.filter(asset => {
      return asset.assetId !== +toBeRemoved;
    });
    row.remove();
    resetDropdown();
    getOutAssetGroupAssets();
  })
  fail(e => console.log(e));
}

function resetDropdown() {
  $("select").empty();
  var def = $("<option disabled> Choose Asset </option>");
  $("select").append(def);
  $("select").formSelect();
}
