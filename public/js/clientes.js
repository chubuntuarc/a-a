$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosCliente()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  clientes = firebase.database().ref().child('clientes')
}

function enviarDatosCliente(){
  var nombre = $('#nombre').val()
  var correo = $('#correo').val()
  var telefono = $('#telefono').val()
  clientes.push({
    nombre: nombre,
    correo : correo,
    telefono : telefono
  })  
  $('#module-form').hide()
  $('#nuevo-cliente').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosCliente()
}

function editarDatosCliente(){
  var nombre = $('#nombre').val()
  var correo = $('#correo').val()
  var telefono = $('#telefono').val()
  elementoEditar.update({
      nombre: nombre,
      correo : correo,
      telefono : telefono
    })
  $('#module-form').hide()
  $('#nuevo-cliente').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosCliente()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosCliente(){
  clientes.on('value',function(snap){
    $("#clientes-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarCliente(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a class="red-text text-lighten-3" href="#!" onclick="borrarCliente(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#clientes-rows").append(nuevaFila)
    datatable()
  })
}

function borrarCliente(key){
  var checkstr =  confirm('Deseas eliminar el cliente?');
    if(checkstr === true){
      var elementoABorrar = clientes.child(key)
      elementoABorrar.remove()
      leerDatosCliente()
    }else{
    return false;
    }
}

function editarCliente(key){
  $('#module-form').show()
  $('#nuevo-cliente').hide()
  var elementoAEditar = clientes.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
    $('#correo').val(datos.correo)
    $('#telefono').val(datos.telefono)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}