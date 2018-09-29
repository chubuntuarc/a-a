$(document).ready(function(){
  $('#goback').show()
  $('select').formSelect()
  inicializar()
  leerDatosProducto()
  $('#module-form').hide()
  $('#editardata').hide()
  catalogosSelect()
})

var elementoEditar

function inicializar(){
  productos = firebase.database().ref().child('productos')
  familias = firebase.database().ref().child('familias')
  modelos = firebase.database().ref().child('modelos')
  lineas = firebase.database().ref().child('lineas')
  telas = firebase.database().ref().child('telas')
  colores = firebase.database().ref().child('colores')
  tallas = firebase.database().ref().child('tallas')
}

function enviarDatosProducto(){
  var familia = $('#familia').val()
  var modelo = $('#modelo').val()
  var linea = $('#linea').val()
  var tela = $('#tela').val()
  var color = $('#color').val()
  var talla = $('#talla').val()
  var codigo = $('#codigo').val()
  var docena = $('#docena').val()
  var media = $('#media').val()
  productos.push({
    familia: familia,
    modelo : modelo,
    linea : linea,
    tela : tela,
    color : color,
    talla : talla,
    codigo : codigo,
    docena : docena,
    media : media
  })  
  $('#module-form').hide()
  $('#nuevo-producto').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatosProducto()
}

function editarDatosProducto(){
  var familia = $('#familia').val()
  var modelo = $('#modelo').val()
  var linea = $('#linea').val()
  var tela = $('#tela').val()
  var color = $('#color').val()
  var talla = $('#talla').val()
  var codigo = $('#codigo').val()
  var docena = $('#docena').val()
  var media = $('#media').val()
  elementoEditar.update({
      familia: familia,
      modelo : modelo,
      linea : linea,
      tela : tela,
      color : color,
      talla : talla,
      codigo : codigo,
      docena : docena,
      media : media
    })
  $('#module-form').hide()
  $('#nuevo-producto').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatosProducto()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
   M.updateTextFields();
}

function leerDatosProducto(){
  productos.on('value',function(snap){
    $("#productos-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila 
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].codigo+'</td>'
          nuevaFila+='<td>$'+datos[key].docena+'</td>'
          nuevaFila+='<td>$'+datos[key].media+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editarProducto(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td><a href="#!" onclick="borrarProducto(\''+key+'\');"><i class="material-icons">delete</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#productos-rows").append(nuevaFila)
    $('select').formSelect()
  })
}

function catalogosSelect(){
  familias.on('value',function(snap){
    $("#familia > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="-">-</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#familia").append(nuevaFila)
    $('select').formSelect()
  })
  
  modelos.on('value',function(snap){
    $("#modelo > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="-">-</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#modelo").append(nuevaFila)
    $('select').formSelect()
  })
  
  lineas.on('value',function(snap){
    $("#linea > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="-">-</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#linea").append(nuevaFila)
    $('select').formSelect()
  })
  
  telas.on('value',function(snap){
    $("#tela > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="-">-</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#tela").append(nuevaFila)
    $('select').formSelect()
  })
  
  colores.on('value',function(snap){
    $("#color > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="-">-</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#color").append(nuevaFila)
    $('select').formSelect()
  })
  
  tallas.on('value',function(snap){
    $("#talla > option").remove()
    var datos = snap.val()
    var nuevaFila='<option value="-" disabled>-</option>'
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].nombre+'</option>'
    }
    $("#talla").append(nuevaFila)
    $('select').formSelect()
  })
}


function borrarProducto(key){
  var checkstr =  confirm('Deseas eliminar el producto?');
    if(checkstr === true){
      var elementoABorrar = productos.child(key)
      elementoABorrar.remove()
      leerDatosProducto()
    }else{
    return false;
    }
}

function editarProducto(key){
  $('#module-form').show()
  $('#nuevo-producto').hide()
  var elementoAEditar = productos.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#familia').val(datos.familia)
    $('#modelo').val(datos.modelo)
    $('#linea').val(datos.linea)
    $('#tela').val(datos.tela)
    $('#color').val(datos.color)
    $('#talla').val(datos.talla)
    $('#codigo').val(datos.codigo)
    $('#docena').val(datos.docena)
    $('#media').val(datos.media)
  })
  $('#enviardata').hide()
  $('#editardata').show()
  $('select').formSelect()
  M.updateTextFields();