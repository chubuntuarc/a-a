$(document).ready(function(){
  $('#goback').hide()
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
})

var formulario
var condos
var submit = $('#enviardata').text()
var elementoEditar

function inicializar(){
  condos = firebase.database().ref().child('condos')
}

function enviarDatos(){
  var nombre = $('#first_name').val()
  var direccion = $('#address').val()
  condos.push({
    nombre: nombre,
    direccion: direccion
  })  
  $('#module-form').hide()
  $('#nuevo-condominio').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
  var nombre = $('#first_name').val()
  var direccion = $('#address').val()
  elementoEditar.update({
      nombre: nombre,
      direccion: direccion
    })
  $('#module-form').hide()
  $('#nuevo-condominio').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  $("#condominios-rows > tr").remove()
  condos.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td>'+datos[key].direccion+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrar(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#condominios-rows").append(nuevaFila)
    }
  })
  //$('#condominios-rows').fadeIn().delay(2000);
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar el condominio?');
    if(checkstr === true){
      var elementoABorrar = condos.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
  $('#module-form').show()
  $('#nuevo-condominio').hide()
  var elementoAEditar = condos.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#first_name').val(datos.nombre)
    $('#address').val(datos.direccion)
  })
  $('#enviardata').hide()
  $('#editardata').show()
}