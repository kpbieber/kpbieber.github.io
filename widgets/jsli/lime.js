function download(url){
    window.location.href = url
}
function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function enableLoadingOverlay(){
	$.LoadingOverlay("show",{"imageColor":"rgb(112, 190, 67)","background":"rgba(0, 0, 0, 0.8)"})
}
function disableLoadingOverlay(){
	$.LoadingOverlay("hide")
}

function getJsonTime() {
    return (new Date()).toJSON()
}
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function keypadInputs(){
    $('.keypad input.jqx-numeric-text-box-component').keyboard({
        layout: "custom",
        customLayout: {
            "default": ["7 8 9 {b}", "4 5 6 {clear}", "1 2 3 {sign}", "0 {dec} {accept}"]
        }
    });
}

function keyboardInputs(){
    $("textarea.ni-text-field").keyboard({
        stayOpen : true,
        layout   : 'qwerty'
    });
}

function setUpButton(){
    $('.openKeyboard').click(function(){
        openKeypad("Please gimme something", console.log)
    })
}
function timestampToSeconds(timestamp){
    return (new Date(timestamp) - new Date('1904-01-01T00:00:00Z'))/1000
}
function setPlotLabel(index,label){
    $('.ni-plot-title')[index].innerHTML=label
}
function openKeypad(message, handler){
    message = message || "Enter a value";
    var dialog = $(`<div title="${message}" id="keyboarddialog"><input type="numeric"></input></div>`)
    $('body').append(dialog)
    var keypad = dialog.find('input')
    keypad.keyboard({
        layout: "custom",
        customLayout: {
            "default": ["7 8 9 {b}", "4 5 6 {clear}", "1 2 3 {sign}", "0 {dec} {accept}"]
        }
    });
    dialog.dialog({
        modal:true,
        buttons: [
            {
              text: "OK",
              click: function() {
                handler($(this).find("input").val());
                $(this).dialog("close");
                $(this).remove();
              }
            }]
    });
}

(function () {
    'use strict';
    const loginDialog = async function() {
          var defer = $.Deferred();
          $(`<div id="loginBox" class="loginBox">
                <form style="box-shadow:none; margin-bottom: 0; padding-bottom: 0">
                  <div class="input-field">
                      <input id="username" type="text" class="">
                      <label for="username" id="usernameLabel" class="">Username</label>
                  </div>
                  <div class="input-field">
                      <input id="password" type="password" class="">
                      <label for="password" id="passwordLabel" class="password">Password</label>
                  </div>
                </form>
              </div>`).dialog({
            modal: true,
            title: "Please Enter your portal username and password.",
            buttons: {
              'Login': function() {
                  var username = $(this).find('#username').val()
                   var password = $(this).find('#password').val()
                $(this).dialog('close');
                defer.resolve(JSON.stringify({username:username,password:password}));
              },
              'Cancel': function() {
                $(this).dialog('close');
                defer.resolve("false");
              }
            }
          });
          return defer.promise();
    }
    const openKeyboardAsync = async function(selector){
        var defer = $.Deferred();
        var elem = $('<input></input>')
        elem.keyboard({
		openOn : null,
		stayOpen : true,
		layout : 'qwerty',
            accepted:function(e, keyboard, el){
                console.log('The content "' + el.value + '" was accepted!');
                defer.resolve(el.value)
                elem.remove();
            }
	     })
        
        $(selector).append(elem)
        var kb = elem.getkeyboard();
        if ( kb.isOpen ) {
            kb.close();
        } else {
            kb.reveal();
        }
        return defer.promise();
    }
    const setMaintenanceDropdown = async function(json){
        var x = document.getElementsByClassName("available-maintenance");
        for(var i = 1; i < x.length; i++){
            if(JSON.stringify(x[i].dataSource) != json){
                x[i].dataSource = JSON.parse(json)
            }
            
        }
    }
     const openKeypadAsync = async function(selector){
        var defer = $.Deferred();
        var elem = $('<input></input>')
        elem.keyboard({
		openOn : null,
		stayOpen : true,
		 layout: "custom",
        customLayout: {
            "default": ["7 8 9 {b}", "4 5 6 {clear}", "1 2 3 {sign}", "0 {dec} {accept}"]
        },
            accepted:function(e, keyboard, el){
                console.log('The content "' + el.value + '" was accepted!');
                defer.resolve(el.value)
                elem.remove();
            }
	     })
        
        $(selector).append(elem)
        var kb = elem.getkeyboard();
        if ( kb.isOpen ) {
            kb.close();
        } else {
            kb.reveal();
        }
        return defer.promise();
    }
    window.loginDialog = loginDialog;
    window.openKeypadAsync = openKeypadAsync;
    window.setMaintenanceDropdown = setMaintenanceDropdown;
    window.openKeyboardAsync = openKeyboardAsync;
}());
