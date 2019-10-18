
/*global $, document, window, alert */
/**************************************************************************************************************************************/
var authId = localStorage.getItem("authId");
var pre = api;
var url = {
        get: `${pre}/Assets`,
        del: `${pre}/Assets/`,
        put: `${pre}/Assets/`
}
var form = document.querySelector("#attrForm");

$(document).ready(function() {
    $('#lcNav').css('box-shadow', 'none');
    init();
    $("#assetTable").on("click", "a.delBtn", function(event) { //DELETE BUTTON
        event.stopPropagation();
        var row = $(this).parents("tr");
        var id = $(this).parents("tr").find(".assetId").attr("assetId");
        del(id, row);
    });

    $("#assetTable").on("click", "a.editBtn", function(event) { // EDIT BUTTON / OPEN MODAL
        event.stopPropagation();
        event.stopPropagation();
        var id = $(this).parents("tr").find(".assetId").attr("assetId");
        var name = $(this).parents("tr").find(".assetId").text();
        var desc = $(this).parents("tr").find(".desc").html();
        setModalText(id, name, desc);
        modalGet(id);
    });

    $("#modal1").on("click", "a.assetSubmitBtn", function() { // modal form buttons?
        // put for asset alias and desc
        put();
    });

    $("#modal1").on("click", "#attrSubmit", function(event) {
        event.preventDefault();
        if(!form.checkValidity()) {
          var tmpSubmit = document.createElement('button') // creates 'fake' submit button to trigger form validation
          form.appendChild(tmpSubmit);
          tmpSubmit.click();
          form.removeChild(tmpSubmit);
        } else {
          attrPut(); // api POST call and row append
        }
    });
    toggleTableEdit() // modal edit btn
});

function init() {
  var tableOptions = {
    paging:true,
    searching: true,
    pageLength:7,
    dom: "rti<'table-controls'p>"
  }
  get().then(() => {
    var table = $('.table-assets').DataTable(tableOptions);
    $('#search').on( 'keyup', function () {
    table.search( this.value ).draw();
    });
    $("#page-length").on('change', () => {
      table.page.len(+$('#page-length').val()).draw();
    })
    $('select').formSelect();
  });
  modalInit();
}
                /********************************** ASSET API CALLS ******************************************/
function put() {
  var id = $("#assetName").attr("assetid");
  var asset = {
          "assetId": parseInt(id),
          "assetAlias": $("#assetAlias").val(),
          "modelId":0,
          "modelNumber":"",
          "serialNumber":"",
          "description": $("#assetDescription").val(),
          "loggingLevel":0,
          "connected":false,
          "severity":0,
          "lastContactHttp":"",
          "latitude":29.75,
          "longitude":-95.5,
          "lastContactGsm":"",
          "lastContactIridium":""
  }
  $.ajax({
      type: "PUT",
      url: `${url.put}${id}`,
      data: JSON.stringify(asset),
      datatype: "json",
      contentType: 'application/json',
      fail: function(){console.log("fail")},
      success: function() {
          //clear form and set new name and desc
          var alias = $("#assetTable .alias").filter(function() {
              return $(this).attr("href") == 'dashboard/?assetId=' + id
          });
          //console.log(alias);
          var desc = $("#assetTable td").filter(function() {
              return $(this).attr("desc") == id
          });
          alias.text($("#assetAlias").val());
          desc.text($("#assetDescription").val());
          clearForm();
      }
  });
}

function del(id, row) {
    $.ajax({
        url: url.del + id,
        type: "DELETE",
        datatype: "json",
        contentType: 'application/json',
        fail: function() { console.log("failed"); },
        success: function() {
            console.log("Delete Succesful");
            row.remove();
        }
    });
}

function get() {
    return $.ajax({
			type: "GET",
			url: url.get,
			dataType: 'json'
    })
		.done(data => {
			data.forEach(async function(asset) {
        let dashboardId;
      // const request = $.getJSON(api+'/assetDefinitions/'+asset.assetDefinitionId+'/dashboards');
      addRow(asset, dashboardId);
      var marker = {lat: asset.latitude , lng: asset.longitude};
      //new google.maps.Marker({postition: marker, map: map});
			});
        map.fitBounds(bounds);
		})
}

function addRow(asset, dashboardId) {
    var isConnected = asset.connected ?
      "<i class='small material-icons' style='color:#558b2f'>power</i>" :
      "<i class='small material-icons' style='color:#ff5252'>power</i>" ;
    var newRow = $("<tr style='background: " + alarmColor(asset.severity) + "'>" +
      "<td class='delCol'> <a class='delBtn'> <i class='small material-icons'>delete</i> </a> </td>" +
      "<td class='editCol'> <a class='editBtn modal-trigger'>" +
          "<i class='small material-icons'>edit</i></a></td>" +
      "<td class='assetId' assetId=" + asset.assetId + "> <a class='alias' href='/dashboard/index.html?assetDefinitionId="+asset.assetDefinitionId+"&assetId=" + asset.assetId + "'>" +  asset.assetAlias + "</a></td>" +
      "<td >" + asset.serialNumber + "</td>" +
      "<td >" + asset.assetDefinitionName + "</td>" +
      "<td>" + isConnected + "</td>" +
     "<td>" + asset.lastContactHttp+"</td>" +
      "<td class=desc desc=" + asset.assetId + ">" + asset.description + "</td>" +
   "</tr>");
  //newRow.css('background', alarmColor(asset.severity));
    $("#assetTable").append(newRow);
    placeMarkers(asset);
}

function alarmColor(severity) {
  var color
  if (severity === 1 || severity === 0) {
      color = "linear-gradient(to bottom, rgba(85,139,47,0) 0%,rgba(85,139,47, .15) 150%)"
  } else if (severity == 2) {
      color = "linear-gradient(to bottom, rgba(255,235,59, 0) 0%, rgba(255,235,59, .15) 150%)"//'rgba(255, 235, 59, .5)'
  } else if (severity == 5) {
      color = "linear-gradient(to bottom, rgba(255,69,0, 0) 0%, rgba(255,152,0, .15) 150%)"//color = 'rgb(255, 152, 0, .1)'
  } else if (severity == 10) {
      color = "linear-gradient(to bottom, rgba(255,82,82, 0) 0%, rgba(255,82,82, .15) 150%)"//'rgba(255, 82, 82 , .5)'
  } else {
      color = '#303030';
  }
  return color
}

function clearForm() {
    $("#assetAlias").val("");
    $("#assetDescription").val("");
}
/*************************************************** MODAL/ATTRIBUTE STUFF *************************************************/
function modalInit() {
    $('.modal').modal({ //modal init
        onCloseEnd: function() {
            $("#modalTable tr").each(function(){
                $(this).remove();
            });
        }
    });
    $(".createBtn").on("click", function() {  //toggle form hide
        if($("#attrForm").is(":hidden")) {
            $("#attrForm").slideDown();
        } else {
            $("#attrForm").slideUp();
        }
    });
    $("#modalTable").on("click", "i.delBtn", function(event) { //DELETE BUTTON
        event.stopPropagation();
        var row = $(this).parents("tr");
        var id = $(this).parents("tr").find(".assetId").attr("assetId");
        var name = $(this).parents("tr").find(".assetId").html();
        //console.log(id + name);
        attrDel(row, id, name);
    });
}
/********************************** ATTR API CALLS ******************************************/
function modalGet(id) {
  var attrUrl = `${url.get}/${id}/Attributes`
  modalmarker.assetId =id
  $.getJSON(attrUrl, function(data) {
    data.forEach(function(attr) {
      addAttr(attr);
    });
    $("#modal1").modal("open");
  });
  var coorUrl =`${url.get}/${id}/Coordinates`
   $.getJSON(coorUrl, function(data) {
     if(data.length == 0){
       placeModalMarker(0,0)
       infowindow.setContent("<p style='color:black'>No position set for this asset. Drag marker and double click to set position.</p>")
       infowindow.open(modalmap, modalmarker);
         modalmap.setZoom(1)
     }
    data.forEach(function(coord) {
      infowindow.setContent("<p style='color:black'>Drag marker and double click to set position.</p>")
      modalmarker.assetId = coord.assetId
      placeModalMarker(coord.latitude,coord.longitude)
         modalmap.setZoom(10)
    });
  });
}

function attrDel(row, id, name) {
    var attrUrl = `${url.get}/${id}/Attributes/${name}`;
    //console.log(attrUrl);
    $.ajax({
        type:"DELETE",
        url: attrUrl,
        datatype: "json",
        fail: function(){console.log("failed")},
        success: function() {
            console.log("Delete Success");
            row.remove();
        }

    });
}

function attrPut() {
    var id = $("#assetName").attr("assetid");
    var name = $("#attrName").val();
    var value = $("#attrValue").val();
    var newUrl = `${url.get}/${id}/Attributes/${name}`;

    var attribute = {
      assetId: id,
      attributeName: name,
      attributeValue: value
    }
    $.ajax({
        type: "PUT",
        url: newUrl,
        data: JSON.stringify(attribute),
        dataType: "json",
        contentType: 'application/json',
        fail: function() {console.log("error")},
        success: function() {
            addAttr(attribute);
            clearAttr();
        }
    });
}

function attrEdit(name, value) {
  var id = $("#assetName").attr("assetid");
  var newUrl = `${url.get}/${id}/Attributes/${name}`;

  var attribute = {
    assetId: id,
    attributeName: name,
    attributeValue: value
  }
  $.ajax({
      type: "PUT",
      url: newUrl,
      data: JSON.stringify(attribute),
      datatype: "json",
      contentType: 'application/json',
      fail: function() {console.log("error")}
  })
  .done(() => {})
}
            /************************************  DOM/HELPER FUNCTINS ******************************************/
function addAttr(attr) {
    var newAttr = $("<tr>" +
                        "<td class='assetId attrName' assetId=" + attr.assetId + ">" + attr.attributeName + "</td>" +
                        "<td class='attrValue edit'>" + attr.attributeValue + "</td>" +
                        "<td class='delCol'> <a><i class='editAttrBtn small material-icons'>edit</i></a></td>" +
                        "<td class='delCol'> <a><i class='delBtn small material-icons'>delete</i></a></td>" +
                   "</tr>");
    $("#modalTable").append(newAttr);
}

function clearAttr() {
    $("#attrName").val("");
    $("#attrValue").val("");
}

function setModalText(id, name, desc) {
    $("#assetName").html(name);
    $("#assetName").attr("assetId", id);
    $("#assetAlias").val(name);
    $("#assetAliasLabel").addClass("active");
    $("#assetDescription").val(desc);
    $("#assetDescriptionLabel").addClass("active");
}

function toggleTableEdit() {
    $("#modalTable").on("click", "i.editAttrBtn", function(event) {
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
        var attrName = $(this).parents('tr').find('.attrName').text();
        var attrValue = $(this).parents('tr').find('.attrValue').text();
        attrEdit(attrName, attrValue);
        $(this).text("edit"); //do last
      }
    });
}
