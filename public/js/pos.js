$(document).ready(function(){
  $('.loader-back').show()
  var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'left'
    })
    $('.tooltipped').tooltip()
    $('#autocomplete-input').focus()
    inicializar()
    listaBusqueda()
    $(".switch").find("input[type=checkbox]").on("change",function() {
        calcularsubtotal()
    })
})

function inicializar(){
  productos = firebase.database().ref().child('productos')
  familias = firebase.database().ref().child('familias')
  lineas = firebase.database().ref().child('lineas')
  telas = firebase.database().ref().child('telas')
  modelos = firebase.database().ref().child('modelos')
  tallas = firebase.database().ref().child('tallas')
  colores = firebase.database().ref().child('colores')
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
    $('input.autocomplete').autocomplete({
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
        nuevaFila+='<td class="'+datos.familia+'"></td>'
        nuevaFila+='<td class="'+datos.linea+'"></td>'
        nuevaFila+='<td class="'+datos.tela+'"></td>'
        nuevaFila+='<td class="'+datos.modelo+'"></td>'
        nuevaFila+='<td class="'+datos.talla+'"></td>'
        nuevaFila+='<td class="'+datos.color+'"></td>'
        nuevaFila+='<td>$<span id="precio'+snap.key+'">'+number_format(datos.docena,2)+'</span></td>'
        nuevaFila+='<input type="hidden" id="media'+snap.key+'" value="'+datos.media+'"/>'
        nuevaFila+='<input type="hidden"id="docena'+snap.key+'" value="'+datos.docena+'"/>'
        nuevaFila+='<td><input type="text" onkeyup="validarCampo($(this).val(),\''+snap.key+'\');" value="12"/></td>'
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
    $('#autocomplete-input').val('')
    $('#autocomplete-input').focus()
  })
}

function validarCampo(cantidad, producto){
  var media = $('#media'+producto).val()
  var docena = $('#docena'+producto).val()
   if(cantidad <= 6){
     $('#precio'+producto).text(media)
     var unidad = parseFloat(media) / 6
     var result = parseFloat(unidad) * cantidad
     $('#sub'+producto).text(number_format(result,2))
   }else{
     $('#precio'+producto).text(docena)

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