
//var api="/api" //where the api endpoint is
//var home="/ass" // where the static content's root is hosted

//sessionStorage.destination = window.location.href
//loginStatus()

var cntrlIsPressed = false;
var upIsPressed = false;
var downIsPressed = false;
var leftIsPressed = false;
var rightIsPressed = false;
var shiftIsPressed = false;
loginStatus()
$(document).keydown(function(event){
    if(event.which=="17")
        cntrlIsPressed = true;
    else if(event.which=="37")
        leftIsPressed = true;
    else if(event.which=="38")
        upIsPressed = true;
    else if(event.which=="39")
        rightIsPressed = true;
    else if(event.which=="40")
        downIsPressed = true;
    else if(event.which=="16")
        shiftIsPressed = true;
});

$(document).keyup(function(event){
    cntrlIsPressed = false;
    upIsPressed = false;
    downIsPressed = false;
    leftIsPressed = false;
    rightIsPressed = false;
    shiftIsPressed = false;
});


$(document).ajaxError(function(e,jqxhr) {
  if(jqxhr.status == 401){
      console.log("Saving destination: "+window.location.href)
      sessionStorage.destination = window.location.href;
      if(!window.location.href.toLowerCase().match("login")){
        window.location.href=('login/?error=Unauthorized. Please login.')
      }
  }
  else if(jqxhr.status == 403){
      alert(jqxhr.responseText);
  }
});

function merge(x,y){
    for(var a in x){
        if(y[a] != null){y[a] = x[a]}
    }
    return y
}

(function ($) {
    $.fn.contrastingText = function () {
        var el = this,
            transparent;
        transparent = function (c) {
            var m = c.match(/[0-9]+/g);
            if (m !== null) {
                return !!m[3];
            }
            else return false;
        };
        while (transparent(el.css('background-color'))) {
            el = el.parent();
        }
        parts = el.css('background-color').match(/[0-9]+/g);
        this.lightBackground = !!Math.round(
            (
                parseInt(parts[0], 10) + //
                parseInt(parts[1], 10) + // green
                parseInt(parts[2], 10) // blue
            ) / 765 // 255 * 3, so that we avg, then normalise to 1
        );
        if (this.lightBackground) {
            this.css('color', 'black');
        } else {
            this.css('color', 'white');
        }
        return this;
    };
}(jQuery));
String.prototype.formatMyString = function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(){
        return args[arguments[1]];
    });
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4();
}

function getIntsBetween(a,b){
    var ints=[]
    if(a>b){
        ints.push(b)
        while(a>b+1){
            b++
            ints.push(b)
        }
        ints.push(a)
    }
    else if(b>a){
        ints.push(a)
        while(b>a+1){
            a++
            ints.push(a)
        }
        ints.push(b)
    }
    return ints
}

function buildAlarmTypeSelector(alarmTypes){
    var sel = $('.alarmTypesSelect')
    sel.children().remove()
    for(var i = 0; i < alarmTypes.length; i++){
        sel.append('<option alarmId={0}>{1}</option>'.formatMyString(alarmTypes[i].alarmId,alarmTypes[i].name))
    }
}



function logout() {
  $.ajax({async:false,type:"GET",url:'/api/Auth/Logout'});
  window.location.href='/login/logout.shtml'
}

function loginStatus(){
    if(!window.location.href.toLowerCase().match("login")){
        sessionStorage.destination = window.location.href
        $.ajax(api+'/Auth/Status'+window.location.search, function(data){
          if(data.login === 'valid') {
            sessionStorage.destination = window.location.href
            //window.location.replace('?error='+data.error.source)
          }
          else{
               window.location.href = home+'/login/index.html?error=Authentication expired. Please login.';
          }
        },'json')
    }
}

function alarmColor(severity) {
  var color
  if (severity === 1 || severity === 0) {
      color = "linear-gradient(to bottom, rgba(85,139,47,0) 0%,rgba(85,139,47, .15) 150%)"
  } else if (severity == 2) {
      color = "linear-gradient(to bottom, rgba(255,235,59, 0) 0%, rgba(255,235,59, .30) 150%)"//'rgba(255, 235, 59, .5)'
  } else if (severity == 5) {
      color = "linear-gradient(to bottom, rgba(255,69,0, 0) 0%, rgba(255,152,0, .30) 150%)"//color = 'rgb(255, 152, 0, .1)'
  } else if (severity == 10) {
      color = "linear-gradient(to bottom, rgba(255,82,82, 0) 0%, rgba(255,82,82, .30) 150%)"//'rgba(255, 82, 82 , .5)'
  } else {
      color = 'linear-gradient(to bottom, rgba(85,139,47,0) 0%,rgba(85,139,47, 15) 150%)';
  }
  return color
}
function errorHandle(error){
    switch(error.code){
        case 5001:
          window.location.replace(home+'/Login/index.html?error=Unexected error. Try logging in again.')
          break;
        case 56:
          console.log(error.source)
          break;
        /*case 5002:
            if(confirm("Your password reset link has expired. Would you like to request a new one?")){
                userInitPasswordChange()
            }
        break;*/
        default:
          alert(error.source);
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
