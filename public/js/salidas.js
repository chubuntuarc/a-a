var key_almacen = $('#id_almacen').val()
var key_usuario = $('#userid').val()

$(document).ready(function(){
  inicializar()
  datosAlmacen()
  listadoProductos()
  leerEntradas()
  M.updateTextFields()
  $('#module-form').hide()
  $('.loader-back').hide()
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
    datatable()
  })
}

function stopDefAction(evt) {
  $('.loader-back').show()
  evt.preventDefault()
  var codigos = $('.codigos option:selected')
  var cantidades = $('.cantidades')
  setTimeout(function() { registrarSalida(); }, 2000)
  setTimeout(function() { 
    productosSalida(codigos,cantidades); 
  }, 5000)
  setTimeout(function() {  
    registrarStock(codigos,cantidades);
  }, 7000)
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
     $('#key_stock').val(key)
  })  
}

function productosSalida(codigos,cantidades){
  var key =  $('#key_stock').val()
  salidas_productos = firebase.database().ref().child('salidas').child(key).child('productos')
  for(var i = 0; i < codigos.length; i++){
    
    var codigo = $(codigos[i]).val()
    var cantidad = $(cantidades[i]).val()
    salidas_productos.push({ [codigo] : cantidad })
  }
  
}

function registrarStock(codigos,cantidades){
  var almacen = $('#id_almacen').val()
  for(var i = 0; i < codigos.length; i++){
        var codigo = $(codigos[i]).val()
        var cantidad = $(cantidades[i]).val()
        
        update_stock = firebase.database().ref().child('stock').child(almacen)
        update_stock.once('value',function(snap){
           var datos = snap.val()
          if(cantidad_inicial === null || cantidad_inicial === '' || datos === null || datos === ''){var cantidad_inicial = 0}else{var cantidad_inicial = datos[codigo]}
          var nueva_cantidad = parseInt(cantidad_inicial) - parseInt(cantidad)
          update_stock.update({ [codigo] : nueva_cantidad })
        })
      }
  $('.loader-back').hide()
  $('#module-form').hide()
  $('#nueva-entrada').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  //leerEntradas()
}