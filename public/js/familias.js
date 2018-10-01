$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerDatosFamilia()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  familias = firebase.database().ref().child('familias')
}

function enviarDatosFamilia(){
  var nombre = $('#nombre').val()
  familias.push({
    nombre: nombre
  })  
  $('#module-form').hide()
  $('#nueva-familia').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosFamilia()
}

function editarDatosFamilia(){
  var nombre = $('#nombre').val()
  elementoEditar.update({
      nombre: nombre
    })
  $('#module-form').hide()
  $('#nueva-familia').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosFamilia()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatosFamilia(){
  familias.on('value',function(snap){
    $("#familias-rows > tr").remove()
    var datos = snap.val()
     var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarFamilia(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          //nuevaFila+='<td><a href="#!" onclick="borrarFamilia(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a class="red-text text-lighten-3" href="#!" onclick="borrarFamilia(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='</tr>'
          
    }
    $("#familias-rows").append(nuevaFila)
    datatable()
  })
}

function borrarFamilia(key){
  var checkstr =  confirm('Deseas eliminar la familia?');
    if(checkstr === true){
      var elementoABorrar = familias.child(key)
      elementoABorrar.remove()
      leerDatosFamilia()
    }else{
    return false;
    }
}

function editarFamilia(key){
  $('#module-form').show()
  $('#nueva-familia').hide()
  var elementoAEditar = familias.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#nombre').val(datos.nombre)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}