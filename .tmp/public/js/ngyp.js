angular.module('yoPlannerApp', ['autocomplete','angular-flexslider'])
  .controller('RecintosController', ["$scope","$http","$sce","$filter",function($scope,$http,$sce,$filter) {
	  $scope.showSearch = true;
	  $scope.hideResults = false;
	  $scope.showDetail = false;
	  $scope.searchString = null;
	  $scope.searchId = null;
	  $scope.currentHotel = null;
	  $scope.currentHotelMap = null;
	  $scope.hotelesSeleccionados = [];
	  $scope.showLoader = false;
	  $scope.rfp = {};
	  $scope.configuracionHabitacionesDobles = [];
	  $scope.configuracionHabitacionesSencillas = [];
	  $scope.fechaInicialFor = null;
	  $scope.fechaFinalFor = null;
	  $scope.folioFinal = null;
	  
	  //pruebas
	  $scope.rfp.paisText = "México";
	  $scope.rfp.nombreCliente = "oscar";
	  $scope.rfp.email = "osc@fo.com";
	  $scope.rfp.telefonoContacto = "5544556677";

	  $scope.search = function() {
		  $scope.showLoader = true;
		  $scope.searchId = $scope.searchString.split(" ")[0];
		  $http.get("/recinto/findByCiudadId/"+$scope.searchId).success(function (data){
              console.log(data);
			  $scope.hotels = data.hotels;
			  $scope.showSearch = false;
		      $scope.hideResults = true;
		      $scope.showDetail = false;
			  $scope.showLoader = false;
		  });
	     
    };
	  $scope.showResults = function() {
			  $scope.showSearch = false;
		      $scope.hideResults = true;
		      $scope.showDetail = false;
		
	     
    };
    
	 
	  $scope.selectResult = function(hotel) {
		  $scope.currentHotel = hotel;
		  $scope.currentHotelMap= $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key=AIzaSyBwFDofYVj2wDbbrdZl1_Bossxi-_hdlhU&q="+$scope.currentHotel.geoLocation.latitude+","+$scope.currentHotel.geoLocation.longitude);
	      $scope.hideResults = false;
	      $scope.showDetail = true;
  };
  $scope.agregarYRegresar = function() {
	  $scope.showSearch = false;
      $scope.hideResults = true;
      $scope.showDetail = false;
      $scope.hotelesSeleccionados.push($scope.currentHotel);
      sliderBars.slidebars.toggle('left');
  };
  
  $scope.existeEnSeleccion = function(hotel){
	  for(var i=0;i<$scope.hotelesSeleccionados.length;i++){
		  if(hotel.id == $scope.hotelesSeleccionados[i].id){
			  return i;
		  };
			  
	  };
	  return -1;
  }; 
 
  $scope.deleteSelection = function(hotel){
	   $scope.hotelesSeleccionados.splice($scope.existeEnSeleccion(hotel),1);
  };



 // gives another movie array on change
 $scope.updateMovies = function(typed){
     // MovieRetriever could be some service returning a promise
	 $http.get("/search/cities/"+typed).success(function(data){
		 $scope.movies  =  [];
		  for(var i=0;i<data.autocomplete.length;i++){
			  if(data.autocomplete[i].type=="city")
				  $scope.movies.push(data.autocomplete[i].id+" "+data.autocomplete[i].name);
		  }
		  
	  });
    
 };
 
 $scope.muestraCuadritos = function(){
	 if($scope.fechaInicialFor && $scope.fechaFinalFor){
		 $scope.rfp.fechaInicial = parseDate($scope.fechaInicialFor);
		 $scope.rfp.fechaFinal = parseDate($scope.fechaFinalFor);
			var totalDias = parseInt(($scope.rfp.fechaFinal.getTime() - $scope.rfp.fechaInicial.getTime())/86400000);
			$scope.configuracionHabitacionesSencillas = [];
			$scope.configuracionHabitacionesDobles = [];
			for(var i=0;i<totalDias;i++){
				$scope.configuracionHabitacionesSencillas.push({tipoHabitacion:1,fecha:new Date($scope.rfp.fechaInicial.getTime()+(86400000*(i)))});
				$scope.configuracionHabitacionesDobles.push({tipoHabitacion:2,fecha:new Date($scope.rfp.fechaInicial.getTime()+(86400000*(i)))});
				
			};
			
	 }
	 
	 
 };
 
 $scope.validarDatosEvento = function(){
	 if($scope.rfp.fechaInicial == null || $scope.rfp.fechaFinal == null){
			alert("Las fechas son obligatorias.","error");
			return;
		}if($scope.rfp.fechaFinal.getTime() < $scope.rfp.fechaInicial.getTime()){
			alert("La fecha final no puede ser menor a la fecha inicial.","error"); 
			return;
		}
		rfp.fechaInicial = $scope.rfp.fechaInicial;
		rfp.fechaFinal = $scope.rfp.fechaFinal;
		$.fancybox.next();
	 
 };
 
 $scope.validarDatosSalones = function(){
	 for(var i=0;i<rfp.salones.length;i++){
			var salon = rfp.salones[i];
			if(salon.fecha.getTime() < rfp.fechaInicial.getTime()){
				alert("La fecha para el salón no puede ser menor a la fecha de entrada","error");
				return;
			}
			if(salon.fecha.getTime() > rfp.fechaFinal.getTime()){
				alert("La fecha para el salón no puede ser mayor a la fecha de salida.","error");
				return;
			}
		}
		$scope.rfp.salones = rfp.salones;
		console.log($scope.rfp.salones);
		$.fancybox.next();
 };
 
 $scope.rfp_create = function(){
	 if($scope.hotelesSeleccionados.length<1){
		 alert("No has seleccionado ningún Hotel","error");
		 return;
	 }
	 
	 $scope.rfp.configuracionHabitaciones = $scope.configuracionHabitacionesSencillas.concat($scope.configuracionHabitacionesDobles);
	 $scope.rfp.fechaInicial = $scope.rfp.fechaInicial.getTime();
	 $scope.rfp.fechaFinal = $scope.rfp.fechaFinal.getTime();
	 for(var i=0;i<$scope.rfp.configuracionHabitaciones.length;i++){
		 $scope.rfp.configuracionHabitaciones[i].fecha = $scope.rfp.configuracionHabitaciones[i].fecha.getTime();
	 };
	 $scope.rfp.recintos = [];
	 for(var i = 0; i<$scope.hotelesSeleccionados.length;i++){
		 $scope.rfp.recintos.push(
				{id:$scope.hotelesSeleccionados[i].id,
					name:$scope.hotelesSeleccionados[i].name,
					description:$scope.hotelesSeleccionados[i].description,
					address:$scope.hotelesSeleccionados[i].address.fullAddress,
					postalCode:$scope.hotelesSeleccionados[i].address.postalCode,
					countryId:$scope.hotelesSeleccionados[i].countryId,
					cityId:$scope.hotelesSeleccionados[i].cityId }); 
	 };
	 
	 
	 console.log(angular.toJson( $scope.rfp));
	 $http.post('/RFP',$scope.rfp).success(function(data){
		 $scope.folioFinal = ""+data.id;
		 $scope.rfp = null;
		 $scope.rfp = {};

		 $scope.hotelesSeleccionados = null;
		 $scope.hotelesSeleccionados = [];
		 
		 $scope.configuracionHabitacionesDobles = [];
		 $scope.configuracionHabitacionesSencillas = [];
		 $scope.fechaInicialFor = null;
		 $scope.fechaFinalFor = null;
		  
		  
		 $.fancybox.next();
	 }).error(function(data){
		 console.log(data);
	 });
	 
 };
 
 $scope.logResume = function(){
	 console.log($scope.rfp);
	 
 };
 
 
 
    
  }]);