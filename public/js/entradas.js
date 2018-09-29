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
  entradas = firebase.database().ref().child('entradas')
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
  entradas.on('value',function(snap){
    $("#entradas-rows > tr").remove()
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
    $("#entradas-rows").append(nuevaFila)
  })
}

function registrarEntrada(){
  entradas = firebase.database().ref().child('entradas')
  var tipo = $('#tipo').val()
  var comentarios = $('#comentarios').val()
  var usuario = $('#userid').val()
  var almacen = $('#id_almacen').val()
  var d = new Date()
  var fecha = d.toLocaleString('en-GB')
  entradas.push({
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
        
        entradas_productos = firebase.database().ref().child('entradas').child(key).child('productos')
        entradas_productos.push({ [codigo] : cantidad })
        
        update_stock = firebase.database().ref().child('stock').child(almacen)
        update_stock.once('value',function(snap){
          if(!snap.val() || snap.val() === null){
             console.log('No hay datos')
             stocker = firebase.database().ref().child('stock')
            var almacen = $('#id_almacen').val()
             stocker.update({
               [almacen] : {
                 0 : 0
               }
             })
           }else{
             var datos = snap.val()
             var cantidad_inicial = datos[codigo]
             var nueva_cantidad = parseInt(cantidad) + parseInt(cantidad_inicial)
             update_stock.update({ [codigo] : nueva_cantidad })
           }
        })
      }
  })  
  $('#module-form').hide()
  $('#nueva-entrada').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerEntradas()
}