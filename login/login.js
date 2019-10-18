
/*global $, document, window */
/**************************************************************************************************************************************/
$(document).ready(function() {
  //$('#header').hide();
  $('#errorText').html(getParameterByName('error'));

  if(getParameterByName('changeId')) {
    const changeId = getParameterByName('changeId');
    const username = getParameterByName("username");
    $('.confirm').show();
    $('#passwordLabel').text('New Password');
    //$('.changeId').show()
    $('.changePassword').hide
    $('#username').val(username);
    $('.login').html("Change Password");
    $('.login').click(function(){
      if($('#password').val() === $('#confirm').val()){
        userCompletePasswordChange(username, $('#password').val(),changeId);
      } else {
        alert("Password fields do not match.")
      }
    });
  } else {
    $('.login').click(function(){
      if($('.login').text() === 'Send') {
        userInitPasswordChange($('#username').val())
      } else {
        sessionStorage.username = $('#username').val();
        // login request
        login($('#username').val(), $('#password').val());
      }
    });

    $('.changePassword').click(function(){
      if($('.changePassword').text() === 'Reset Password') {
        $('.changePassword').text('Login');
        $('.password').hide()
        $('#password').hide()
        $('#errorText').text('Enter email to send a password reset link to')
        //$('.changePassword').hide()
        //$('.login').unbind("click")
        $('.login').text("Send")
        // $('.login').click(function(){
        //     userInitPasswordChange($('#username').val())
        // });
      } else {
        $('.changePassword').text('Reset Password');
        $('.login').text('Login');
        $('.password').show();
        $('#password').show();
        $('#errorText').text('');
      }
    });

    $("#password").keypress(function(e){
      if(e.which==13){
        sessionStorage.username = $('#username').val()
        login( $('#username').val(), $('#password').val())
      }
    });
  }
});

function login(username, password) {
  return $.ajax({
    async:false,
    type:"GET",
    url: api+"/Auth/Login",
    dataType:"json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    },
  })
  .done(function(data){
    if(data.login === "valid") {
      //localStorage.setItem("authId", data.authId);
      if((sessionStorage.destination || "login").toLowerCase().match("login")){
        console.log("The destination was login. Going to assets instead.")
        window.location.replace(home+"assets/list.shtml")
      } else {
        console.log("returning to "+sessionStorage.destination)
        window.location.replace(sessionStorage.destination)
      }
    } // else do nothing?
  })
  .fail(function(e){
    console.log(e);
    $('#errorText').text(e.responseText);
  })
}

function userCompletePasswordChange(username, password, changeId) {
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if(xhttp.readyState == 4 && xhttp.status == 200){
    //       var data = JSON.parse(xhttp.responseText);
    //       window.location.replace(home+'assets/list.shtml');
    //     }
    // }
    // xhttp.open("GET",api+"/Auth/Submit/"+changeId,true);
    // xhttp.setRequestHeader("Authorization", authhead);
    // xhttp.send();
    const authhead = "Basic " + btoa(username+':'+password);
    $.ajax({
      type: 'GET',
      url: api+'/auth/submit/'+changeId,
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", authhead);
      }
    })
    .done(function(data){
      if(data.login === 'valid') {
        window.location.replace(home+'assets/list.shtml');
      }
    })
    .fail(function(e){
      console.log(e);
      $('#errorText').text(e.responseText);
    })
}

function userInitPasswordChange(username){
    if(!username){
      if(getParameterByName("username")){
        username = getParameterByName("username")
      } else{
        username = prompt("Type your username here.",username)
      }
    }
    $.ajax({
      type: 'GET',
      url: api+'/auth/request/'+username,
      dataType: 'json'
    })
    .done(function(){
      alert("Check your email for a link to reset your passowrd");
    })
    .fail(function(e){
      console.log(e);
      alert(e.responseText);
    });
}
