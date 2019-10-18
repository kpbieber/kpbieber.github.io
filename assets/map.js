// Initialize and add the map
var map
var modalmap
var modalmarker
var infowindow
var markers = {}
var polys = {}
var bounds 

function initMap() {
    bounds = new google.maps.LatLngBounds();
var home = {lat: 29.7604, lng: -95.3698};
  map = new google.maps.Map(
      document.querySelector('#map'), {
          zoom: 2,
          center: home,
          mapTypeId: 'satellite'

      }
  );
  modalmap = new google.maps.Map(
      document.querySelector('#modalmap'), {
          zoom: 12,
          center: home
      });
infowindow = new google.maps.InfoWindow({
      content: "<p style='color:black'>Drag to place asset. Double click to save assets position.</p>"
    });
    
    
  // The marker, positioned at home
  //var marker = new google.maps.Marker({position: home, map: map});
    modalmarker = new google.maps.Marker({draggable:true, map: modalmap});
    google.maps.event.addListener(modalmarker, "dblclick", function() {
        var here = {lat:modalmarker.position.lat(),lng:modalmarker.position.lng()}
        if(confirm("Would you like to set the position of this asset to ("+here.lat+", "+here.lng+")?")){
            $.ajax({
                type:"POST",
                url:`${api}/assets/${modalmarker.assetId}/coordinates`,
                dataType:'json',
                contentType:"application/json",
                data:JSON.stringify({latitude:here.lat,longitude:here.lng}),
                success:function(data){
                    markers[modalmarker.assetId.toString()].setPosition(here)
                    console.log(data)
                }
            })
        }
    });
    infowindow.open(modalmap, modalmarker);
}

function placeMarkers(asset) {
            var latitude = asset.latitude;
            var longitude = asset.longitude;
            if(latitude != 0 && longitude!= 0){
                var coord = new google.maps.LatLng(latitude, longitude);
                var contentString = '<div id="content">'+
                    '<div>'+
                    `<a style="line-height:16px;vertical-align:middle;text-decoration:none;cursor:pointer;color:black;" href="/dashboard/index.html?assetDefinitionId=${asset.assetDefinitionId}&assetId=${asset.assetId}">${asset.assetAlias}</a>`+
                    `<i style="margin-left:4px;line-height:16px;vertical-align:middle;text-decoration:none;cursor:pointer;color:black;" onclick="setModalText(${asset.assetId}, '${asset.assetAlias}', '${asset.description}');modalGet(${asset.assetId});" class="markeredit tiny material-icons">edit</i>`+
                    '</div>'
                var infowindow1 = new google.maps.InfoWindow({
                    content: contentString
                });
                var location = {lat: latitude, lng: longitude};
                markers[asset.assetId.toString()] = new google.maps.Marker({
                    position: location, 
                    map: map
                });
                markers[asset.assetId.toString()].addListener('click', function() {
                    infowindow1.open(map,  markers[asset.assetId]);
                });
                
                bounds.extend(markers[asset.assetId.toString()].position);
                map.fitBounds(bounds);
                
                // var buffer = new ArrayBuffer(4);
                // var view = new DataView(buffer);
                // view.setFloat32(0, data[0].altitude);
                // if(view.getUint8(0) == 255){
                    // if(polys["poly"+view.getUint16(1)] == null){
                      // polys["poly"+view.getUint16(1)] = new google.maps.Polyline({
                      // strokeColor: '#000000',
                      // geodesic :true,
                      // strokeOpacity: 1.0,
                      // strokeWeight: 3
                      
                    // });
                        // polys["poly"+view.getUint16(1)].setMap(map)
                    // }
                    // var poly = polys["poly"+view.getUint16(1)]
                    // console.log(poly)
                    // var path = poly.getPath()
                    // coord.lmSeq=view.getUint8(3)
                    // path.push(coord)
                    // path.j.sort(function(a,b){return a.lmSeq - b.lmSeq})
                    // path[view.getUint8(3)] = coord
                    // //path.setPath(points)
                // }
            }
    map.fitBounds(bounds);
}

function placeModalMarker(lat,lng) {
  latitude = lat  !== 0 ? lat : 0;
  longitude = lng !== 0 ? lng : 0;
    var coord = new google.maps.LatLng(latitude, longitude);
    modalmarker.setPosition( coord)
    modalmap.panTo(coord);
}
