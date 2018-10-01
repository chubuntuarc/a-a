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
  
  function datatable(){
  $('table').DataTable({
    retrieve: true,
      "language": {
                    "sProcessing":     "Procesando...",
                    "sLengthMenu":     "Mostrar _MENU_ registros",
                    "sZeroRecords":    "No se encontraron resultados",
                    "sEmptyTable":     "Ningún dato disponible en esta tabla",
                    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix":    "",
                    "sSearch":         "Buscar:",
                    "sUrl":            "",
                    "sInfoThousands":  ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst":    "Primero",
                        "sLast":     "Último",
                        "sNext":     "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                }
    });
  $("select").val('10');
  //$('select').addClass("browser-default");
  $('select').formSelect()
}