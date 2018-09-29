$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosLinea()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  lineas = firebase.database().ref().child('lineas')
}

function enviarDatosLinea(){
  var nombre = $('#nombre').val()
  lineas.push({
    nombre: nombre
  })  
  $('#module-form').hide()
  $('#nueva-linea').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosLinea()
}

function editarDatosLinea(){
  var nombre = $('#nombre').val()
  elementoEditar.update({
      nombre: nombre
    })
  $('#module-form').hide()
  $('#nueva-linea').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosLinea()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosLinea(){
  lineas.on('value',function(snap){
    $("#lineas-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarLinea(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarLinea(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#lineas-rows").append(nuevaFila)
    }
  })
  //$('#condominios-rows').fadeIn().delay(2000);
}

function borrarLinea(key){
  var checkstr =  confirm('Deseas eliminar la linea?');
    if(checkstr === true){
      var elementoABorrar = lineas.child(key)
      elementoABorrar.remove()
      leerDatosLinea()
    }else{
    return false;
    }
}

function editarLinea(key){
  $('#module-form').show()
  $('#nueva-linea').hide()
  var elementoAEditar = lineas.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}