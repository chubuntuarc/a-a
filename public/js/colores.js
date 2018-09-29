$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosColor()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  colores = firebase.database().ref().child('colores')
}

function enviarDatosColor(){
  var nombre = $('#nombre').val()
  colores.push({
    nombre: nombre
  })  
  $('#module-form').hide()
  $('#nuevo-color').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosColor()
}

function editarDatosColor(){
  var nombre = $('#nombre').val()
  elementoEditar.update({
      nombre: nombre
    })
  $('#module-form').hide()
  $('#nuevo-color').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosColor()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosColor(){
  colores.on('value',function(snap){
    $("#colores-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarColor(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarColor(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#colores-rows").append(nuevaFila)
    }
  })
  //$('#condominios-rows').fadeIn().delay(2000);
}

function borrarColor(key){
  var checkstr =  confirm('Deseas eliminar el color?');
    if(checkstr === true){
      var elementoABorrar = colores.child(key)
      elementoABorrar.remove()
      leerDatosColor()
    }else{
    return false;
    }
}

function editarColor(key){
  $('#module-form').show()
  $('#nuevo-color').hide()
  var elementoAEditar = colores.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}