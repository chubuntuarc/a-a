$(document).ready(function(){
  inicializar()
  if($('#id_cotizacion').val() === 0 || $('#id_cotizacion').val() === '' || $('#id_cotizacion').val() === '0'){
    $('#updateC').hide()
  }else{
    $('#createC').hide()
    cargarCotizacion($('#id_cotizacion').val())
  }
  $('.loader-back').show()
  var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'left'
    })
    $('.tooltipped').tooltip()
    $('#buscar-productos').focus()
    
    listaBusqueda()
    listaClientes()
    $(".switch").find("input[type=checkbox]").on("change",function() {
        calcularsubtotal()
    })
})

var elementoEditar

function inicializar(){
  clientes = firebase.database().ref().child('clientes')
  productos = firebase.database().ref().child('productos')
  cotizaciones = firebase.database().ref().child('cotizaciones')
  familias = firebase.database().ref().child('familias')
  lineas = firebase.database().ref().child('lineas')
  telas = firebase.database().ref().child('telas')
  modelos = firebase.database().ref().child('modelos')
  tallas = firebase.database().ref().child('tallas')
  colores = firebase.database().ref().child('colores')
}

//Cargar datos de la cotizacion
function cargarCotizacion(key){ 
  $('#id_cotizacion').val(key)
  cotizaciones = firebase.database().ref().child('cotizaciones').child(key)
  productos_cotizaciones = firebase.database().ref().child('cotizaciones').child(key).child('productos')
  cotizaciones.once('value',function(snap){
    var datos = snap.val()
    $('#subtotal_pos').text(datos.subtotal)
    $('#iva_pos').text(datos.iva)
    $('#total_pos').text(datos.total)
    clientes.child(datos.cliente).once('value',function(snap){
      var datos = snap.val()
      $('#buscar-clientes').val(datos.nombre)
    })
    M.updateTextFields()
  })
    productos_cotizaciones.once('value',function(snap){
      var datos = snap.val()
      for(var key in datos){
          producto = productos_cotizaciones.child(key)
          producto.once('value',function(snap){
            var data = snap.val()
            for(var k in data){
              products = firebase.database().ref().child('productos').child(k)
              products.once('value',function(snap){
                var datos = snap.val()
                var nuevaFila
                    nuevaFila+='<tr>'
                    nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrarProducto(\''+snap.key+'\');"><i class="tiny material-icons">clear</i></a></td>'
                    nuevaFila+='<td><b class="blue-text">'+datos.codigo+'</b></td>'
                    nuevaFila+='<input type="hidden" class="codigos" value="'+snap.key+'"/>'
                    nuevaFila+='<td class="'+datos.familia+'"></td>'
                    nuevaFila+='<td class="'+datos.linea+'"></td>'
                    nuevaFila+='<td class="'+datos.tela+'"></td>'
                    nuevaFila+='<td class="'+datos.modelo+'"></td>'
                    nuevaFila+='<td class="'+datos.talla+'"></td>'
                    nuevaFila+='<td class="'+datos.color+'"></td>'
                    nuevaFila+='<td>$<span id="precio'+snap.key+'">'+number_format(datos.docena,2)+'</span></td>'
                    nuevaFila+='<input type="hidden" id="media'+snap.key+'" value="'+datos.media+'"/>'
                    nuevaFila+='<input type="hidden"id="docena'+snap.key+'" value="'+datos.docena+'"/>'
                    nuevaFila+='<td><input class="cantidades" type="text" onkeyup="validarCampo($(this).val(),\''+snap.key+'\');" value="12"/></td>'
                    //nuevaFila+='<td><input type="text" value="0"/></td>'
                  nuevaFila+='<td class="blue-text" style="font-size: 16px;font-weight: bold;">$<span id="sub'+snap.key+'" class="sub_productos">'+number_format(datos.docena,2)+'</span></td>'
                    nuevaFila+='</tr>'
                $("#productos-rows").append(nuevaFila)
              })
            }
          })
      }
    })
      leerFamilias()
      leerLineas()
      leerTelas()
      leerModelos()
      leerTallas()
      leerColores()
      calcularsubtotal()
}

function listaBusqueda(){
  productos.on('value',function(snap){
    var datos = snap.val()
    var data = {}
    var myConvertedData = {}
    for(var key in datos){
      data[key] = datos[key].codigo
    }
    $.each(data, function(index, value) {
      myConvertedData[value] = null;
    })
    $('#buscar-productos').autocomplete({
        data: myConvertedData,
      limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
      onAutocomplete: function(val) {
        $.each(data, function(index, value) {
          if(value == val){
            $('#id_producto').val(index)
            cargarDatosProducto()
          }
        })
      }
      })
    $('.loader-back').hide()
  })
}

function listaClientes(){
  clientes.on('value',function(snap){
    var datos = snap.val()
    var data = {}
    var myConvertedData = {}
    for(var key in datos){
      data[key] = datos[key].nombre
    }
    $.each(data, function(index, value) {
      myConvertedData[value] = null;
    })
    $('#buscar-clientes').autocomplete({
        data: myConvertedData,
        limit: 20,
        onAutocomplete: function(val) {
        $.each(data, function(index, value) {
          if(value == val){
            $('#id_cliente').val(index)
          }
        })
      }
      })
    $('.loader-back').hide()
  })
}


//Cargar movimientos del estado de cuenta actual
function cargarDatosProducto(){
  var producto = $('#id_producto').val() 
  producto = firebase.database().ref().child('productos').child(producto)
  producto.once('value',function(snap){
    var datos = snap.val()
    var nuevaFila
        nuevaFila+='<tr>'
        nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrarProducto(\''+snap.key+'\');"><i class="tiny material-icons">clear</i></a></td>'
        nuevaFila+='<td><b class="blue-text">'+datos.codigo+'</b></td>'
        nuevaFila+='<input type="hidden" class="codigos" value="'+snap.key+'"/>'
        nuevaFila+='<td class="'+datos.familia+'"></td>'
        nuevaFila+='<td class="'+datos.linea+'"></td>'
        nuevaFila+='<td class="'+datos.tela+'"></td>'
        nuevaFila+='<td class="'+datos.modelo+'"></td>'
        nuevaFila+='<td class="'+datos.talla+'"></td>'
        nuevaFila+='<td class="'+datos.color+'"></td>'
        nuevaFila+='<td>$<span id="precio'+snap.key+'">'+number_format(datos.docena,2)+'</span></td>'
        nuevaFila+='<input type="hidden" id="media'+snap.key+'" value="'+datos.media+'"/>'
        nuevaFila+='<input type="hidden"id="docena'+snap.key+'" value="'+datos.docena+'"/>'
        nuevaFila+='<td><input class="cantidades" type="text" onkeyup="validarCampo($(this).val(),\''+snap.key+'\');" value="12"/></td>'
        //nuevaFila+='<td><input type="text" value="0"/></td>'
      nuevaFila+='<td class="blue-text" style="font-size: 16px;font-weight: bold;">$<span id="sub'+snap.key+'" class="sub_productos">'+number_format(datos.docena,2)+'</span></td>'
        nuevaFila+='</tr>'
    $("#productos-rows").append(nuevaFila)
    leerFamilias()
    leerLineas()
    leerTelas()
    leerModelos()
    leerTallas()
    leerColores()
    calcularsubtotal()
    $('#buscar-productos').val('')
    $('#buscar-productos').focus()
  })
}
  
//Actualizar cotizaciones
function actualizarCotizacion(){
  var k = $('#id_cotizacion').val()
  var cliente = $('#id_cliente').val()
  var d = new Date()
  var fecha_venta = ''
  var iva = $('#iva_pos').text()
  var subtotal = $('#subtotal_pos').text()
  var total = $('#total_pos').text()
  var nota = 'Abierta'
  var tienda = '-LNOAiuxGfG36uSSbjXy'
  var ultima_edicion = d.toLocaleString('en-GB')
  var vendedor = '2ZV3kHGfjjOfdbvemtp4EwnikOn1'
  var elementoAEditar = cotizaciones.child(k)
  elementoAEditar.update({
      cliente: cliente,
      fecha_venta : fecha_venta,
      iva : iva,
      subtotal : subtotal,
      total : total,
      nota : nota,
      tienda : tienda,
      ultima_edicion : ultima_edicion,
      vendedor : vendedor,
      productos : {}
    }) 
  $('#id_cotizacion').val(0)
  M.toast({html: 'Actualizado!', classes: 'rounded'})
}


function guardarCotizacion(){
  var cliente = $('#id_cliente').val()
  var d = new Date()
  var fecha_venta = ''
  var iva = $('#iva_pos').text()
  var subtotal = $('#subtotal_pos').text()
  var total = $('#total_pos').text()
  var nota = 'Abierta'
  var tienda = '-LNOAiuxGfG36uSSbjXy'
  var ultima_edicion = d.toLocaleString('en-GB')
  var vendedor = '2ZV3kHGfjjOfdbvemtp4EwnikOn1'
  cotizaciones.push({
    cliente: cliente,
    fecha_venta : fecha_venta,
    iva : iva,
    subtotal : subtotal,
    total : total,
    nota : nota,
    tienda : tienda,
    ultima_edicion : ultima_edicion,
    vendedor : vendedor,
    productos : {}
  }).then((snap) => {
     const key = snap.key 
     $('#key_cotizacion').val(key)
     productosCotizacion()
  })    
  $('#id_cotizacion').val(0)
  M.toast({html: 'Guardado!', classes: 'rounded'});
}

function productosCotizacion(){
  var codigos = $('.codigos')
  var cantidades = $('.cantidades')
  var key =  $('#key_cotizacion').val()
  cotizaciones = firebase.database().ref().child('cotizaciones').child(key).child('productos')
  for(var i = 0; i < codigos.length; i++){
    var codigo = $(codigos[i]).val()
    var cantidad = $(cantidades[i]).val()
    cotizaciones.push({ [codigo] : cantidad })
  }
  $( '#work-place' ).load( 'pos.html' );
}

function validarCampo(cantidad, producto){
  var media = $('#media'+producto).val()
  var docena = $('#docena'+producto).val()
   if(cantidad <= 6){
     $('#precio'+producto).text(number_format(media,2))
     var unidad = parseFloat(media) / 6
     var result = parseFloat(unidad) * cantidad
     $('#sub'+producto).text(number_format(result,2))
   }else{
     $('#precio'+producto).text(number_format(docena,2))

       var unidad = parseFloat(docena) / 12
       var result = parseFloat(unidad) * cantidad
       $('#sub'+producto).text(number_format(result,2))
       

   }
   calcularsubtotal()
}

function calcularsubtotal(){
  var subtotal = 0
  $('.sub_productos').each(function(){
    subtotal += parseFloat($(this).text())
  })
  $('#subtotal_pos').text(number_format(subtotal,2))
  if($('.switch').find("input[type=checkbox]").prop('checked') === true){
    var iva = subtotal * 0.16
  }else{
    var iva = 0
  }
  $('#iva_pos').text(number_format(iva,2))
  var total = parseFloat(subtotal) + parseFloat(iva)
  $('#total_pos').text(number_format(total,2))
}

function leerFamilias(){
  familias.once('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function leerLineas(){
  lineas.once('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function leerTelas(){
  telas.once('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function leerModelos(){
  modelos.once('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function leerTallas(){
  tallas.once('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function leerColores(){
  colores.once('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

//Convertir a moneda
function number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    return amount_parts.join('.');
}