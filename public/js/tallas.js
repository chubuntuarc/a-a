$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosTalla()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  tallas = firebase.database().ref().child('tallas')
}

function enviarDatosTalla(){
  var nombre = $('#nombre').val()
  tallas.push({
    nombre: nombre
  })  
  $('#module-form').hide()
  $('#nueva-talla').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
    leerDatosTalla()
}

function editarDatosTalla(){
  var nombre = $('#nombre').val()
  elementoEditar.update({
      nombre: nombre
    })
  $('#module-form').hide()
  $('#nueva-talla').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosTalla()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosTalla(){
  tallas.on('value',function(snap){
    $("#tallas-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarTalla(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarTalla(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#tallas-rows").append(nuevaFila)
    datatable()
  })
}

function borrarTalla(key){
  var checkstr =  confirm('Deseas eliminar la talla?');
    if(checkstr === true){
      var elementoABorrar = tallas.child(key)
      elementoABorrar.remove()
      leerDatosTalla()
    }else{
    return false;
    }
}

function editarTalla(key){
  $('#module-form').show()
  $('#nueva-talla').hide()
  var elementoAEditar = tallas.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}