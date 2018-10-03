$(document).ready(function(){
  $('#goback').show()
  inicializar()
  leerCotizaciones()
  leerTiendas()
  leerUsuarios()
  $('#module-form').hide()
  $('#editardata').hide()
})

var elementoEditar

function inicializar(){
  cotizaciones = firebase.database().ref().child('cotizaciones')
  tiendas = firebase.database().ref().child('almacenes')
  usuarios = firebase.database().ref().child('usuarios')
}


function leerCotizaciones(){
  cotizaciones.on('value',function(snap){
    $("#cotizaciones-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td>'+datos[key].nota+'</td>'
          nuevaFila+='<td class="'+datos[key].tienda+'"></td>'
          nuevaFila+='<td class="'+datos[key].vendedor+'"></td>'
          nuevaFila+='<td>'+datos[key].ultima_edicion+'</td>'
          nuevaFila+='<td>'+datos[key].fecha_venta+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].subtotal,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].iva,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].total,2)+'</td>'
          nuevaFila+='<td><a href="#!" onclick="cargarCotizacion(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a class="red-text text-lighten-3" href="#!" onclick="borrarCotizacion(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#cotizaciones-rows").append(nuevaFila)
    datatable()
  })
}

function cargarCotizacion(key){
  $("#id_cotizacion").val(key)
  $( "#work-place" ).load( "pos.html" )
}

function leerTiendas(){
  usuarios.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function leerUsuarios(){
  tiendas.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
  })
}

function borrarCotizacion(key){
  var checkstr =  confirm('Deseas eliminar la cotización?');
    if(checkstr === true){
      var elementoABorrar = cotizaciones.child(key)
      elementoABorrar.remove()
      leerCotizaciones()
    }else{
    return false;
    }
}

function editarCotizacion(key){
  console.log(key)
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