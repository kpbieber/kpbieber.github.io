/*global $, document, window */
/**************************************************************************************************************************************/
var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(40, -100),
        zoom: 4
    });


if ($('.main').width() < 700) {
    showList();
}

$('#assetTable').show()
getAssets('','','')


$(window).resize(function() {
    // (the 'map' here is the result of the created 'var map = ...' above)
    google.maps.event.trigger(map, "resize");
  });

 $("#list").resizable({
   handles:{e:$('#slider')}
 });

 $('#list').resize(function() {
    // (the 'map' here is the result of the created 'var map = ...' above)
    google.maps.event.trigger(map, "resize");
  });

 google.maps.event.trigger(map, "resize");


function showList() {
    $('.show').removeClass('active')
    $('.show.list').addClass('active')
    $('#mapcontainer').hide()
    $('#list').width("100%")
    $('#list').show()
    google.maps.event.trigger(map, "resize");
}

function showMap() {
    $('.show').removeClass('active')
    $('.show.map').addClass('active')
    $('#list').hide()
    $('#list').width("0%")
    $('#mapcontainer').show()
    google.maps.event.trigger(map, "resize");
}

function showBoth() {
    $('.show').removeClass('active')
    $('.show.both').addClass('active')
    $('#list').show()
    $('#list').width("50%")
    $('#mapcontainer').show()
    google.maps.event.trigger(map, "resize");
}

function search() {
    getAssets($('#salias').val(),$('#smodel').val(),$('#sserial').val());
}

var markersArray=[]

function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}




/******************************************************** DIALOGS ***********************************************************************/

function openAttributeEditor(attributeName,attributeValue){
    $('.attribute.dialog').find('.new.name').val(attributeName)
    $('.attribute.dialog').find('.new.value').val(attributeValue) 
    $('.attribute.dialog').dialog("open")
}

$('.assetEdit').dialog({
        autoOpen:false,
        modal:true,
        hide:{effect:"fade"},
          show:{effect:"fade"},
        title:"Edit Asset",
        buttons:[
            {text:"Apply",
             click:function(){
                 assetSetAliasAndDescription(
                     $(this).attr('assetId'),
                     $('.alias').val(),
                     $('textarea.description').val()

                 )
             }
            },{
            text:"Cancel",
            click:function(){
                $( this ).dialog( "close" );
            }
            }
        ]
})

$('.attribute.dialog').dialog({
        autoOpen:false,
        modal:true,
        hide:{effect:"fade"},
        show:{effect:"fade"},
        title:"Edit Attribute",
        buttons:[
            {text:"Apply",
             click:function(){
                 assetSetAttribute(
                     $('.assetEdit').attr('assetId'),
                     $(this).find('.new.name').val(),
                     $(this).find('.new.value').val() 
                 )
                 $( this ).dialog( "close" );
             }
            },{
            text:"Cancel",
            click:function(){
                $( this ).dialog( "close" );
            }
            }
        ]
    })

/**************************************************** FROM LIME JS ************************************************************/


//function getAssets(alias,model,serial){
// $.get(
//        '/LimeWeb/Assets',
//        {Alias:alias,Model:model,Serial:serial},
//        function(data){
//             if(!data.error.status){
//                 window['info']=data.Assets
//                 loadAssetTable(data.Assets)
//            }
//            else{
//                 errorHandle(data.error)
//            }
//        },
//        'json'
//    )
//}
//
//function getAssetGroups(){
//    $.get(
//        '/LimeWeb'+'/AssetGroups',
//        {},
//        function(data){
//            if(!data.error.status){
//                loadAssetGroupTable(data.AssetGroups)
//                window['assetGroups']=data.AssetGroups
//                window['assetGroups_index']={}
//                for(var i = 0; i <data.AssetGroups.length; i++){
//                    window['assetGroups_index'][data.AssetGroups[i].assetGroupId]=data.AssetGroups[i]
//                }
//            }
//            else{
//                errorHandle(data.error)
//            }
//        },
//        'json'
//    )
//}
//
//function assetSetAliasAndDescription(assetId,assetAlias,description){
//    $.ajax({
//        type:"PUT",
//        url:'/LimeWeb'+"/Assets/"+assetId,
//        success:function(data){
//        if(!data.error.status){
//             loadAssetTable(data.Assets);$('.assetEdit').dialog("close")
//        }
//        else{
//             errorHandle(data.error)
//        }
//        },
//        data:JSON.stringify(Asset({assetId:parseInt(assetId),assetAlias:assetAlias,description:description})),
//        dataType:'json'
//    })
//}
//
//function assetDelete(assetId,assetAlias){
//    if(confirm("Are you sure you want to delete "+assetAlias+"? This may affect the experience of users with access to this asset.")){
//    $.ajax({
//        type:"DELETE",
//        url:'/LimeWeb'+"/Assets/"+assetId,
//        success:function(data){
//            if(!data.error.status){
//                 loadAssetTable(data.Assets);$('.assetEdit').dialog("close")
//            }
//            else{
//                 errorHandle(data.error)
//            }
//        },
//        dataType:'json'
//    })
//    }
//}
//
//
//function loadAssetTable(assets){
//    
//    try{
//        clearOverlays();
//    } catch(e) {
//        console.log("failed to clear overlays");
//    }
//    
//    var table = $('#assetTable');
//    
//    table.children().remove();
//    
//    table.append('<thead><tr><th></th><th>Last Contact</th><th>Edit</th><th>Alias</th><th>Serial Number</th><th>Model Number</th><th class="minimize">Description</th><th>Delete</th></tr></thead>');
//    
//    for( var i = 0; i < assets.length; i++){
//   
//        var row = 
//            $('<tr assetId="{0}" assetAlias="{1}"><td>{2}</td><td>{3}</td><td class="description minimize">{4}</td></tr>'.formatMyString(assets[i].assetId,assets[i].assetAlias,assets[i].serialNumber,assets[i].modelNumber,assets[i].description));
//        
//        var editButton = $("<td><a> <i class='tiny material-icons'>settings</i> </a></td>");
//        
//        row.attr('asset',JSON.stringify(assets[i]));
//        
//        editButton.click(function(){
//            loadAssetEditDialog(
//                $(this).closest('tr').attr('assetId')
//            )
//        });
//        
//        // <span class="ui-icon ui-icon-trash"></span>
//        
//        var deleteButton = $("<td > <a> <i class='tiny material-icons'>delete</i> </a> </td>");
//         
//        deleteButton.bind("click",function(){
//            assetDelete(
//                $(this).closest('tr').attr('assetId'),
//                $(this).closest('tr').attr('assetAlias')
//            )
//        });
//        
//        var dashButton=$('<td ><a>{0}</a></td>'.formatMyString(assets[i].assetAlias));
//        
//        dashButton.click(function(){
//            sessionStorage.assetId=$(this).closest('tr').attr('assetId');
//            sessionStorage.asset=$(this).closest('tr').attr('asset');
//            sessionStorage.dashType='asset'
//            window.location.replace('/dashboard/')
//        });
//        
//        var imageURL = assets[i].connected ? "/css/images/online.gif" : "/css/images/offline.gif"
//        var connected=$('<td><img src="{0}"></td>'.formatMyString(imageURL))
//        var lastcontact
//        var contact = []
//        
//        if (!isNaN(new Date(assets[i].lastContactHttp))){
//            contact.push({ts:new Date(assets[i].lastContactHttp),tp:" (HTTP)"});
//        }
//        
//        if(!isNaN(new Date(assets[i].lastContactGsm))){
//            contact.push({ts:new Date(assets[i].lastContactGsm),tp:" (Cell)"});
//        }
//        
//        if(!isNaN(new Date(assets[i].lastContactIridium))){
//            contact.push({ts:new Date(assets[i].lastContactIridium),tp:" (Sat)"});
//        }
//        
//        contact = contact.sort(function(a, b){return b.ts-a.ts});
//        
//        try{
//            lastcontact=$('<td>{0}</td>'.formatMyString(contact.sort()[0].ts.toJSON().replace('T',' ')+contact.sort()[0].tp))
//        } catch(e){
//            var lastcontact='<td></td>'
//        }
//    
//        row.append(deleteButton);
//        row.prepend(dashButton);
//        row.prepend(editButton);
//        row.prepend(lastcontact);
//        row.prepend(connected);
//
//        if (assets[i].severity) {
//            row.css('box-shadow', 'inset 0 0 20px ' + alarmColor(assets[i].severity))
//        }
//        
//        table.append(row);
//        
//        if(assets[i].latitude != 0 && assets[i].longitude != 0){
//            try{
//                var content = '<div><a class="map" href = "/dashboard/?assetId={0}">{1}</a></div>'.formatMyString(assets[i].assetId,assets[i].assetAlias)
//                var infowindow = new google.maps.InfoWindow()
//                var marker = new google.maps.Marker({
//                    icon:"/css/images/marker_"+alarmColor(assets[i].severity)+'.png',
//                    map: map,
//                    title: assets[i].assetAlias,
//                    position:{lat:assets[i].latitude,lng:assets[i].longitude}
//                });
//                markersArray.push(marker)
//                
//                google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
//                    return function() {
//                       infowindow.setContent(content);
//                       infowindow.open(map,marker);
//                    };
//                })(marker,content,infowindow)); 
//                
//            } catch(e){}
//        }
//        
//        try { 
//            google.maps.event.trigger(map, "resize");
//        } catch(e){}
//        
//    }
//    
//    table.tablesort();
//    hideLongTableElements();
//    
//}
