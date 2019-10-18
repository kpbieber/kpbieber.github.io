var pre = api;
const assetId = getParameterByName('assetId');
const url = {
        assetGet: `${pre}/Assets/${assetId}`,
        attrGet: `${pre}/Assets/${assetId}/attributes`
}

$(document).ready(function() {
  assetGet();
  attrGet();
})

function assetGet() {
    return $.ajax({
			type: "GET",
			url: url.assetGet,
			dataType: 'json'
    })
		.done(asset => {
      console.log(asset);
      $('#alias').text(asset.assetAlias);
      $('#serialNumber').text(asset.serialNumber);
      $('#assetDef').text(asset.assetDefinitionName);
      $('#description').text(asset.description);
		})
}

function attrGet() {
    return $.ajax({
			type: "GET",
			url: url.attrGet,
			dataType: 'json'
    })
		.done(data => {
      console.log(data);
      data.forEach((attr) => {
        addAttr(attr);
        // var marker = {lat: asset.latitude , lng: asset.longitude};
        // new google.maps.Marker({postition: marker, map: map});
      })

		})
}




function addAttr(attr) {
    var newAttr = $("<tr>" +
                        "<td class='delCol'> <a><i class='delBtn small material-icons'>delete</i></a></td>" +
                        "<td class='delCol'> <a><i class='editAttrBtn small material-icons'>edit</i></a></td>" +
                        "<td class='assetId attrName' assetId=" + attr.assetId + ">" + attr.attributeName + "</td>" +
                        "<td class='attrValue edit'>" + attr.attributeValue + "</td>" +
                   "</tr>");
    $("#attrTable").append(newAttr);
}
