function cambiarPagina(page){
	$.mobile.changePage("#"+page,{
		transition:"turn"
	});
}
$(document).ready(function(){
	var marcador1;
	var latInicial;
	var lngInicial;
	var hoteles=[];
	var hotelesRegistrados=[];
	var marcadores = [];
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	var mapa;
	var marcadoresRegistrados = [];
	var marcaHotel;
	var contId;
	var etiquetaRegistro="";
	
	

	$(".volver").click(function(){
		cambiarPagina("paginaInicio");
	
		console.log("centinela="+centinela);
	});

	$("#btnRegistroHotel").click(function(){
		
		cambiarPagina("paginaRegistroHotel");
		obtenerPosicionActual();	
 

	});

	$("#btnListaHotel").click(function(){
			cambiarPagina("paginaListaHoteles");

			for (var i = 0; i<hoteles.length; i++) {
				var li='<li data-theme="a">'+'<a id="'+i+'" class="btnDatosHotel">' + hoteles[i].nombre + '</a><a class="deleteMe"></a></li>';
						//console.log(li);
						//console.log(hoteles[i].estrellas);
					
					switch(hoteles[i].estrellas){
					          case "1":{
					              $('#unaEstrella').append(li).listview('refresh');
					              break;
					          	}
					          case "2":{
					              $('#dosEstrellas').append(li).listview('refresh');
					              break;
					          	}
					          case "3":{
					              $('#tresEstrellas').append(li).listview('refresh');
					              break;
					          	}
					          case "4":{
					              $('#cuatroEstrellas').append(li).listview('refresh');
					              break;
					          	}
					          case "5":{
					              $('#cincoEstrellas').append(li).listview('refresh');
					              break;
					          	}
     			    }		

			} 
			//console.log(hoteles);
			hotelesRegistrados=hotelesRegistrados.concat(hoteles);
			hoteles.length=0;
			//console.log(hotelesRegistrados);
//-----------------------------------BORRAR REGISTRO DE LISTA----------------------------------------------
		$( document ).on( "click", ".deleteMe", function() {
		  			console.log("Registro de hoteles antes de borrar"+hotelesRegistrados);
		  			console.log("Registro de marcadores antes de borrar"+marcadoresRegistrados);
		  			var deletNombre=$(this).parent().text();
		  			console.log("indice del Nombre"+deletNombre);
					for (var i = 0; i<hotelesRegistrados.length; i++) {
						
						if (hotelesRegistrados[i].nombre==deletNombre) {
							//contDelet=i;
							console.log("Id eliminado="+i);
							hotelesRegistrados.splice(i,1);
							console.log("lista actualizada de registro de hoteles"+hotelesRegistrados);
							marcadoresRegistrados.splice(i,1);
							console.log("lista actualizada de registro de marcadores"+marcadoresRegistrados);
						}
					}
					$(this).parent().remove();
				    //$('#1estrella').listview('refresh');
				      
		});
//-----------------evento para mostrar los datos de la lista-------------------
		$( document ).on( "click", ".btnDatosHotel", function() {
					var mensaje="";
					//id=$(this).attr('id');
					var idNombre=$(this).text();
					for (var i = 0; i<hotelesRegistrados.length; i++) {
						//console.log(hotelesRegistrados[i].nombre);
						if (hotelesRegistrados[i].nombre==idNombre) {
							mensaje+="<b>"+"Nombre:     "+"</b>"+idNombre+"<br>";
							mensaje+="<b>"+"Ciudad:     "+"</b>"+hotelesRegistrados[i].ciudad+"<br>";
							mensaje+="<b>"+"Telefono:   "+"</b>"+hotelesRegistrados[i].telefono+"<br>";
							mensaje+="<b>"+"Estrellas:  "+"</b>"+hotelesRegistrados[i].estrellas+"<br>";
							contId=i;
						}
					}
					$("#informacion").html(mensaje);
					//console.log(idNombre);
//-----------------------mostrando datos del registro del marcador en "#paginaDatosHotel"-------------------------
				
					console.log("indice de registro: "+contId);
					//console.log("marcador del incice"+marcadoresRegistrados[i]);
					marcaHotel=marcadoresRegistrados[contId];
					$("#miLatInf").val("Latitud: "+marcaHotel.getPosition().lat());
					$("#miLngInf").val("longitud: "+marcaHotel.getPosition().lng());

					var opciones={
						zoom:15,
						center: marcaHotel.getPosition(),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

		var mapa = new google.maps.Map(document.getElementById("divMapaInf"),opciones);

		var	marcaHotel = new google.maps.Marker({
			position: marcaHotel.getPosition(),
			map: mapa,
			icon:"icon.png",
			animation:google.maps.Animation.DROP,
			nombre:idNombre,
			title: "Hotel Registrado"
		});
		var contenidoVentana='<div>'+
		'<img src="img/imagen.jpg" width="300px">'+
		'<p class="descripcion"><b>Ubicacion del Registro de  '+marcaHotel.nombre+'<b></p>'+
		'</div>';
		var ventana=new google.maps.InfoWindow({
			content:contenidoVentana
		});

		google.maps.event.addListener(marcaHotel,'click',function(marcaHotel,contenidoVentana,ventana){
			return function(){
				ventana.setContent(contenidoVentana);
				ventana.open(mapa,marcaHotel);
			};

		}(marcaHotel,contenidoVentana,ventana));
		ventana.open(mapa,marcaHotel);

		google.maps.event.addListener(marcaHotel,'click',function(marcaHotel,contenidoVentana,ventana){
			ventana.setContent(contenidoVentana);
			ventana.open(mapa,marcaHotel);
		}(marcaHotel,contenidoVentana,ventana));

					cambiarPagina("paginaDatosHotel");	

		});
	});
//---------------------------Registrar datos ---------------------------------------------
		$(document).on("click","#btnGuardarHotel",function(){
			console.log("iniciando evento registro: "+etiquetaRegistro);
					switch(0){
							 case $("#nombre").val().trim().length:{
							 	etiquetaRegistro=$("#nombre");
							 	$("#resultado").css({"color":"#ff3145"});
							 	$("#resultado").html("<b>"+"Por favor ingrese el Nombre!!"+"</b>");							 	
		     				 	$('#popupDialogoResultado').popup('open');							  
							  	break;
							  }
							  case $("#ciudad").val().trim().length:{
							  	etiquetaRegistro=$("#ciudad");
							  	$("#resultado").css({"color":"#ff3145"});
							  	$("#resultado").html("<b>"+"Por favor ingrese la Ciudad!!"+"</b>");
		     				 	$('#popupDialogoResultado').popup('open');							   
							  	break;
							  }
							  case $("#telefono").val().trim().length:{
							  	etiquetaRegistro=$("#telefono");
							  	$("#resultado").css({"color":"#ff3145"});
							  	$("#resultado").html("<b>"+"Por favor ingrese el numero de Telefono!!"+"<b>");
		     				 	$('#popupDialogoResultado').popup('open');							  
							  	break;
							  }	  		  	
		     		}
//console.log("iniciando el guardado: "+etiquetaRegistro);
		     			
		     		if (etiquetaRegistro!=""&&etiquetaRegistro.val().trim().length==0  ){
		     					
							etiquetaRegistro.css({"background-color":"#ff3145"});
							 	
		     		}else {
		     				$("#resultado").css({"color":"blue"});
							 $("#resultado").html("El Registro se realizó con Exito!");
		     				 $('#popupDialogoResultado').popup('open');
		     				var nombre=$("#nombre").val();
							var ciudad=$("#ciudad").val();
							var telefono=$("#telefono").val();
							var estrellas=$("#estrellas").val();

							var hotel={
								nombre:nombre,
								ciudad:ciudad,
								telefono:telefono,
								estrellas:estrellas
							}
							hoteles.push(hotel);
	console.log("finalizando el guardado: "+etiquetaRegistro);
							

										 if(marcadores.length!=0){
										 	marcadoresRegistrados.push(marcadores[marcadores.length-1]);
										 	
										 }else{
										 	
										 	
										 	marcadoresRegistrados.push(marcador1);
										 }

							 $("#nombre").val("");
							 $("#ciudad").val("");
							 $("#telefono").val("");

							 $("#nombre").css({"background-color":""});
							 $("#ciudad").css({"background-color":""});
							 $("#telefono").css({"background-color":""});
							
		     			}

console.log("finalizando el evento : "+etiquetaRegistro);
		});

	
//--------------------------------------Limpiar Campos con Boton--------------------------------------------------------
	$("#btnLimpiarCampos").click(function(){
		$("#nombre").val("");
		 $("#ciudad").val("");
		 $("#telefono").val("");
		 $("#estrellas").val("");

	});
//-------------------------------------------------------------------------------------------------
	$("#btnDelMark").click(function(){
		
		marcadores.pop().setMap(null);
		$("#miLat").val("");
		$("#miLng").val("");
		 
		 
			directionsDisplay.setMap(null); 
			
			 
		
	});

//---------------------------Mostrar Mapa en pantalla------------------------------------------------
	function verMapa(posicion){
		
		var opciones={
			zoom:15,
			center: posicion,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var mapa = new google.maps.Map(document.getElementById("divMapa"),opciones);

		 marcador1 = new google.maps.Marker({
			position: posicion,
			map: mapa,
			draggable: false,
			animation:google.maps.Animation.DROP,
			title: "Mi Ubicacion"
		});
//----------------------------------evento para mostrar cordenadas de mi ubicacion ------------------------		 
google.maps.event.addListener(marcador1,'click',function(){
						
				$("#miLat").val(latInicial);
				$("#miLng").val(lngInicial);		
								
				});

//----------------------------------evento para agregar nuevo marcador de hotel ------------------------
		 google.maps.event.addListener(mapa,'click', function(event){
				//--------agregar Marcador Nuevo----------
				var myLatLng=event.latLng;
				var mylat=myLatLng.lat();
				var mylng=myLatLng.lng();
				var marcadorNuevo=new google.maps.Marker({
					position: {
							   lat:mylat,
					           lng:mylng
					           },
					icon:"icon.png",
					draggable:true,
					map:mapa
				});
				$("#miLat").val(mylat);
				$("#miLng").val(mylng);
				marcadores.push(marcadorNuevo);
				console.log(marcadores);
//--------------------------------evento para verRuta en mapa----------------------------
				google.maps.event.addListener(marcadorNuevo,'click',function(){
						directionsDisplay = new google.maps.DirectionsRenderer();
						directionsDisplay.setMap(mapa);

							var peticion = {
								origin: {
					                      lat:latInicial,
					                      lng:lngInicial
					                    },
								destination:marcadorNuevo.getPosition(),
								travelMode: google.maps.TravelMode.DRIVING
							};
							$("#miLat").val(marcadorNuevo.getPosition().lat());
							$("#miLng").val(marcadorNuevo.getPosition().lng());

							directionsService.route(peticion, function(respuesta,estado){
								if (estado==google.maps.DirectionsStatus.OK) {
									directionsDisplay.setDirections(respuesta);
									directionsDisplay.setOptions({
										suppressMarkers: true
									});
								} else{
									alert('Error en el servicio:'+estado);
								}
							});
						//console.log("nueva Position:"+marcadorNuevo.getPosition());
				});
				//console.log("pase por aqui");
				//console.log("mi Punto:"+latInicial+","+lngInicial);
				//console.log("nuevo Punto:"+event.latLng);

		 });

		 
	}
	function exito(pos){
		var miPunto = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
		latInicial=pos.coords.latitude;
		lngInicial=pos.coords.longitude;
		$("#miLat").val(latInicial);
		$("#miLng").val(lngInicial);

		verMapa(miPunto);
		//console.log(latInicial,lngInicial);
	}
	function fallido(error){
		if(error.code == 0){
			alert("!Ups, No se puede obtener la posicion actual!!");
		}
		if (error.code==1) {
			alert("!Ups, esto es embarazoso!")
		}
		if (error.code==2) {
			alert("!Ups, no has aceptado compartir tu posición!");
		}
		if (error.code==3) {
			alert("!Ups, hemos superado el tiempo de espera!")
		}
	}
	function obtenerPosicionActual(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(exito, fallido,{
				maximumAge: 500000,
				anableHighAccuracy:true,
				timeout: 6000
			});
		} 
	}
	
});