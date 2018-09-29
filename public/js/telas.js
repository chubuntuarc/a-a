$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosTela()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  telas = firebase.database().ref().child('telas')
}

function enviarDatosTela(){
  var nombre = $('#nombre').val()
  telas.push({
    nombre: nombre
  })  
  $('#module-form').hide()
  $('#nueva-familia').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosTela()
}

function editarDatosTela(){
  var nombre = $('#nombre').val()
  elementoEditar.update({
      nombre: nombre
    })
  $('#module-form').hide()
  $('#nueva-tela').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosTela()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatosTela(){
  telas.on('value',function(snap){
    $("#telas-rows > tr").remove()
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarTela(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarTela(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
          $("#telas-rows").append(nuevaFila)
    }
  })
  //$('#condominios-rows').fadeIn().delay(2000);
}

function borrarTela(key){
  var checkstr =  confirm('Deseas eliminar la tela?');
    if(checkstr === true){
      var elementoABorrar = telas.child(key)
      elementoABorrar.remove()
      leerDatosTela()
    }else{
    return false;
    }
}

function editarTela(key){
  $('#module-form').show()
  $('#nueva-familia').hide()
  var elementoAEditar = telas.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}