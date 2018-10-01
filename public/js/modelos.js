$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosModelo()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  modelos = firebase.database().ref().child('modelos')
}

function enviarDatosModelo(){
  var nombre = $('#nombre').val()
  modelos.push({
    nombre: nombre
  })  
  $('#module-form').hide()
  $('#nuevo-modelo').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosModelo()
}

function editarDatosModelo(){
  var nombre = $('#nombre').val()
  elementoEditar.update({
      nombre: nombre
    })
  $('#module-form').hide()
  $('#nuevo-modelo').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosModelo()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosModelo(){
  modelos.on('value',function(snap){
    $("#modelos-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarModelo(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          //nuevaFila+='<td><a href="#!" onclick="borrarModelo(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a class="red-text text-lighten-3" href="#!" onclick="borrarModelo(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#modelos-rows").append(nuevaFila)
    datatable()
  })
}

function borrarModelo(key){
  var checkstr =  confirm('Deseas eliminar el modelo?');
    if(checkstr === true){
      var elementoABorrar = modelos.child(key)
      elementoABorrar.remove()
      leerDatosModelo()
    }else{
    return false;
    }
}

function editarModelo(key){
  $('#module-form').show()
  $('#nuevo-modelo').hide()
  var elementoAEditar = modelos.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}