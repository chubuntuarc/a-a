function login(){
  var usuario = $('#email').val()
  var pass = $('#pass').val()
  
  firebase.auth().signInWithEmailAndPassword(usuario, pass)
  .then(function(result){
    //If login ok
    M.toast({html: 'Bienvenido!', classes: 'rounded'})
    window.location.href = '/'
  })
  .catch(function(error) {
    M.toast({html: 'Acceso denegado!', classes: 'rounded'})
  })
  
}