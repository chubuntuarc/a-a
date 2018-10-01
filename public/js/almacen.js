$(document).ready(function(){
  $('#goback').hide()
  $('#stock-table').hide()
  $('.fixed-action-btn').floatingActionButton()
  $('.fixed-action-btn').hide()
  $('.tooltipped').tooltip()
  inicializar()
  listadoAlmacenes()
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
    nombre: nombre
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
      nombre: nombre
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

function listadoAlmacenes(){
  almacenes.on('value',function(snap){
    $("#almacenes-select > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="" disabled selected>Elige un almacén</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#almacenes-select").append(nuevaFila)
    $('select').formSelect()
  })
}

function leerDatosAlmacen(key){
  $('.fixed-action-btn').show()
  $('#id_almacen').val(key)
  almacen = firebase.database().ref().child('almacenes').child(key)
  almacen.on('value',function(snap){
    var datos = snap.val()
    $('#nombre_almacen').text(datos.nombre)
    if(datos.direccion){
      $('#direccion_almacen').text(datos.direccion)
    }else{
      $('#direccion_almacen').text('')
    }
  })
  
  //Stock del almacen
  stock = firebase.database().ref().child('stock').child(key)
  stock.on('value',function(snap){
    $("#stock-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila 
    for(var key in datos){
      nuevaFila+= '<tr>'
      nuevaFila+= '<td id="'+key+'"></td>'
      nuevaFila+= '<td>'+datos[key]+'</td>'
      nuevaFila+= '</tr>'
    }
    $("#stock-rows").append(nuevaFila)
    
    //Codigos de productos
    productos = firebase.database().ref().child('productos')
    productos.on('value',function(snap){
    var datos = snap.val()
      for(var key in datos){
        $('#'+key).text(datos[key].codigo)
    }
    })
    datatable()
    $('#stock-table').show()
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
  })
  $('#enviardata').hide()
  $('#editardata').show()
  M.updateTextFields();
}