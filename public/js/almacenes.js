$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosAlmacen()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  almacenes = firebase.database().ref().child('almacenes')
}

function enviarDatosAlmacen(){
  var nombre = $('#nombre').val()
  var direccion = $('#direccion').val()
  almacenes.push({
    nombre: nombre,
    direccion : direccion
  })  
  $('#module-form').hide()
  $('#nuevo-almacen').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosAlmacen()
}

function editarDatosAlmacen(){
  var nombre = $('#nombre').val()
  var direccion = $('#direccion').val()
  elementoEditar.update({
      nombre: nombre,
      direccion : direccion
    })
  $('#module-form').hide()
  $('#nuevo-almacen').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosAlmacen()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosAlmacen(){
  almacenes.on('value',function(snap){
    $("#almacenes-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarAlmacen(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarAlmacen(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#almacenes-rows").append(nuevaFila)
  })
}

function borrarAlmacen(key){
  var checkstr =  confirm('Deseas eliminar el almacén?');
    if(checkstr === true){
      var elementoABorrar = almacenes.child(key)
      elementoABorrar.remove()
      leerDatosAlmacen()
    }else{
    return false;
    }
}

function editarAlmacen(key){
  $('#module-form').show()
  $('#nuevo-almacen').hide()
  var elementoAEditar = almacenes.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
    $('#direccion').val(datos.direccion)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}