$(document).ready(function(){
  $('#goback').show()
  //$('select').formSelect()
  inicializar()
  leerDatosProducto()
  $('#module-form').hide()
  $('#editardata').hide()
  $('#barcode-template').hide()
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
          nuevaFila+='<td class="hide-on-small-only"><a class="red-text text-lighten-3" href="#!" onclick="borrarProducto(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='<td class="hide-on-small-only"><a href="#!" onclick="barcode(\''+datos[key].codigo+'\',\''+datos[key].codigo+'\',\''+datos[key].familia+'\',\''+datos[key].modelo+'\',\''+datos[key].linea+'\',\''+datos[key].tela+'\',\''+datos[key].color+'\',\''+datos[key].talla+'\');"><i class="material-icons">confirmation_number</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#productos-rows").append(nuevaFila)
    $('select').formSelect()
    datatable()
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
  M.updateTextFields()
}

//Mandar a imprimir codigo de barras
function barcode(key,codigo,familia,modelo,linea,tela,color,talla){
  $('#id_familia').val(familia);
  $('#id_modelo').val(modelo);
  $('#id_linea').val(linea);
  $('#id_tela').val(tela);
  $('#id_color').val(color);
  $('#id_talla').val(talla);
  $('#barcode-template').show();
  $('#barcode-producto').text(codigo);
  JsBarcode("#barcode", key);
  familias.on('value',function(snap){
    var familia = $('#id_familia').val();
    var datos = snap.val();
    for(var key in datos){
      if(key === familia){
        $('#familia-name').text(datos[key].nombre);
      }
    }
  });
  modelos.on('value',function(snap){
    var modelo = $('#id_modelo').val();
    var datos = snap.val();
    for(var key in datos){
      if(key === modelo){
        $('#modelo-name').text(datos[key].nombre);
      }
    }
  });
  lineas.on('value',function(snap){
    var linea = $('#id_linea').val();
    var datos = snap.val();
    for(var key in datos){
      if(key === linea){
        $('#linea-name').text(datos[key].nombre);
      }
    }
  });
  telas.on('value',function(snap){
    var tela = $('#id_tela').val();
    var datos = snap.val();
    for(var key in datos){
      if(key === tela){
        $('#tela-name').text(datos[key].nombre);
      }
    }
  });
  colores.on('value',function(snap){
    var color = $('#id_color').val();
    var datos = snap.val();
    for(var key in datos){
      if(key === color){
        $('#color-name').text(datos[key].nombre);
      }
    }
  });
  tallas.on('value',function(snap){
    var talla = $('#id_talla').val();
    var datos = snap.val();
    for(var key in datos){
      if(key === talla){
        $('#talla-name').text(datos[key].nombre);
      }
    }
  });
  $('#barcode-name').text();
  window.print()
}

var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
        //console.log('before print dialog open');
    } else {
       //console.log('after print dialog closed');
var ventana = window.self;
                  $('#barcode-template').hide()
    }
})