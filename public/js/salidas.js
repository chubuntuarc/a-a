var key_almacen = $('#id_almacen').val()
var key_usuario = $('#userid').val()

$(document).ready(function(){
  inicializar()
  datosAlmacen()
  listadoProductos()
  leerEntradas()
  $('select').formSelect()
  M.updateTextFields()
  $('#module-form').hide()
})

function inicializar(){
  var key = $('#id_almacen').val()
  almacen = firebase.database().ref().child('almacenes').child(key)
  salidas = firebase.database().ref().child('salidas')
  productos = firebase.database().ref().child('productos')
}

function openForm(){
  $('#module-form').show();
  $('input').val('');
  $('#enviardata').show();
  $('#editardata').hide();
  $('#id_almacen').val(key_almacen)
  $('#userid').val(key_usuario)
}

function datosAlmacen(){
  almacen.on('value',function(snap){
    var datos = snap.val()
    $('#nombre_almacen').text(datos.nombre)
  })
}

function addRow(){
  var nuevaFila = '<tr>'
      nuevaFila += '<td><select class="codigos"></select></td>'
      nuevaFila += '<td><input placeholder="Cantidad" class="cantidades" type="text" class="validate"></td>'
      //nuevaFila += '<td><input placeholder="Docena" class="docenas" type="text" class="validate"></td>'
      //nuevaFila += '<td><input placeholder="1/2 docena" class="medias" type="text" class="validate"></td>'
      nuevaFila += '<td><a href="#!" onclick="addRow()"><i class="material-icons">add</i></a></td>'
      nuevaFila += '</tr>'
  $("#productos-rows").append(nuevaFila)
  listadoProductos()
}

function listadoProductos(){
  productos.on('value',function(snap){
    var datos = snap.val()
    var nuevaFila 
    for(var key in datos){
      nuevaFila+= '<option value="'+key+'">'+datos[key].codigo+'</option>'
    }
    $(".codigos").append(nuevaFila)
    $('select').formSelect()
  })
}

function leerEntradas(){
  salidas.on('value',function(snap){
    $("#salidas-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila 
    var almacen = $('#id_almacen').val()
    for(var key in datos){
      if(almacen == datos[key].almacen){
        nuevaFila += '<tr>'
        nuevaFila += '<td>'+datos[key].tipo+'</td>'
        nuevaFila += '<td>'+datos[key].comentarios+'</td>'
        nuevaFila += '<td>'+datos[key].fecha+'</td>'
        nuevaFila += '</tr>'
      }
    }
    $("#salidas-rows").append(nuevaFila)
  })
}

function registrarSalida(){
  salidas = firebase.database().ref().child('salidas')
  var tipo = $('#tipo').val()
  var comentarios = $('#comentarios').val()
  var usuario = $('#userid').val()
  var almacen = $('#id_almacen').val()
  var d = new Date()
  var fecha = d.toLocaleString('en-GB')
  salidas.push({
    tipo: tipo,
    comentarios : comentarios,
    usuario : usuario,
    almacen : almacen,
    fecha : fecha,
    productos : {}
  }).then((snap) => {
     const key = snap.key 
      var almacen = $('#id_almacen').val()
      var codigos = $(".codigos")
      var codigos2 = $(".codigos").val()
      var cantidades = $(".cantidades")
      //var docenas = $(".docenas");
      //var medias = $(".medias");
      for(var i = 0; i < codigos2.length; i++){
        //Codigo de producto
        var codigo = $(codigos[i]).val()
        var cantidad = $(cantidades[i]).val()
        
        salidas_productos = firebase.database().ref().child('salidas').child(key).child('productos')
        salidas_productos.push({ [codigo] : cantidad })
        
        update_stock = firebase.database().ref().child('stock').child(almacen)
        update_stock.once('value',function(snap){
           var datos = snap.val()
          var cantidad_inicial = datos[codigo]
          var nueva_cantidad = parseInt(cantidad_inicial) - parseInt(cantidad)
          update_stock.update({ [codigo] : nueva_cantidad })
        })
      }
  })  
  $('#module-form').hide()
  $('#nueva-salida').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerEntradas()
}