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
})

function inicializar(){
  productos = firebase.database().ref().child('productos')
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
            $('#id_cuenta').val(index)
            //cargarDatosProducto()
          }
        })
      }
      })
    $('.loader-back').hide()
  })
}


//Cargar movimientos del estado de cuenta actual
function cargarDatosCuenta(){
  var cuenta = $('#id_cuenta').val() 
  estado_cuenta = firebase.database().ref().child('estado_cuenta').child(cuenta)
  estado_cuenta.once('value',function(snap){
    $("#cuenta-rows > tr").remove()
    var datos = snap.val()
    var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrarMovimiento(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='<td>'+datos[key].fecha+'</td>'
          nuevaFila+='<td>'+datos[key].fecha_vencimiento+'</td>'
          nuevaFila+='<td>'+datos[key].tipo+'</td>'
          nuevaFila+='<td>'+datos[key].concepto+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].cargo,2)+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].abono,2)+'</td>'
          if(datos[key].status == 'Adeudo pendiente'){
           nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="movimientoEditar(\''+key+'\');">'+datos[key].status+'</a></td>' 
            nuevaFila+='<td><a class="green-text text-lighten-3" href="#!" onclick="abonarAdeudo(\''+key+'\');"><i class="material-icons">attach_money</i></a></td>'
          }else{
           nuevaFila+='<td class="green-text text-lighten-3">'+datos[key].status+'</td>'
          }
          nuevaFila+='</tr>'
    }
    $("#cuenta-rows").append(nuevaFila)
    $('.btn-floating').show()
    $('#tabla-cuenta').show()
    $('.loader-back').hide()
    $('#autocomplete-input').focus()
  })
}
