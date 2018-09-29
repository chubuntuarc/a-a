firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //console.log('Correcto')
    // User is signed in.
    //var displayName = user.displayName;
    var email = user.email;
    //var emailVerified = user.emailVerified;
    //var photoURL = user.photoURL;
    //var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    $('#userid').val(uid)
    //var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
    window.location.href = 'login.html'
  }
})

function salir(){
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
    window.location.href = 'login.html'
  }).catch(function(error) {
    // An error happened.
  });
}

//Check offline
setInterval(function() {
    if(!navigator.onLine)
{
  $('.message').show();
  $('.message').text('Modo sin conexión | Revisa tu conectividad');
  $('.message').css('background-color', '#f44336');
}else{
  $('.message').hide();
}
  }, 5000)