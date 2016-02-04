$(document).ready(function() {
  	var map = initialize_gmaps();
  	var icons = {
		hotel:'/images/banana.gif',
		restaurant: '/images/restaurant.png',
		activity:'/images/star-3.png'
	}
	var markers=[];

	var trip = [
		{
			hotel: [],
			restaurant: [],
			activity: []
		}
	]

	$('.plus').on('click',
	function addDay() {
		if (trip.length>6) return;
		trip.push( { 
			hotel: [],
			restaurant:[],
			activity: []
		});
		
		$('.day-buttons').append('<button class="btn btn-circle day-btn day">'+trip.length+'</button> ')
		
		}
	);

	

	function selectDay(){
		resetMarkers()
		$('.day').removeClass('current-day')
		$(this).toggleClass('current-day')
		var currentDay = getDay()+1
		$('#currentDay').text('Day '+currentDay)
		$('.list-group').empty()
		renderCurrentDay(currentDay)
	}
	
	function deleteDay(){
		if(trip.length===1) return;
		console.log(getDay());
		resetMarkers();
		trip.splice(getDay(), 1)
		if(getDay()>0)selectDay.call($('.current-day').prev())
		else selectDay.call($('.current-day'))	
		$('.current-day').next().remove()
		render($('.current-day'));
		function render(el){
			
			if (el.next().text()=="") {
				return;
			} else {
				el.next().text(el.next().text()-1);
				render(el.next());
			}
		}


	}


	function renderCurrentDay(currentDay){
		var day = trip[Number(currentDay)-1]
		for( var key in day){
			day[key].forEach(function(el){
				$("#my-"+key).append(itineraryItem(el.name))
				resetMarkers(map);
			})
		}
	}

	function resetMarkers(mappy){
		var mappy = mappy || null;

		for(var key in trip[getDay()]) {
			trip[getDay()][key].forEach(function (event) {
				event.marker.setMap(null);
				if (mappy) makeMarker(event, key);
			})
		}
	}



  	function makeMarker(event, id){
  		myLatLng = {
			lat: event.place[0].location[0],
			lng: event.place[0].location[1]
		}

		event.marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: '/images/'+Math.floor(Math.random()*10) +'.gif' ,
			animation: google.maps.Animation.BOUNCE
		});
		markers.push(event.marker)

		var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < markers.length; i++) {
 			bounds.extend(markers[i].getPosition());
		}

		map.fitBounds(bounds);

  	}

  	function removeMarker(marker) {
  		marker.setMap(null);

  	}

	function itineraryItem (eventName){
		return '<div id='+eventName+' class="itinerary-item"><span class="title">'+eventName+'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button> </div> '
	}

	function findLocation(id, eventName){
		var arr = turnerize(id)
		arr.forEach(function(el){
			if(el.name === eventName) place = el.place[0]
		})
		return place;
	}

	function findEvent(id, eventName){
		var arr = turnerize(id)
		var toReturn;
		arr.forEach(function(el){
			if(el.name === eventName) toReturn = el;
		})
		return toReturn;
	}
	
	function turnerize(id){
		var turnt;
		id ==='activity' ? turnt = window['activities']:turnt = window[id+'s'];
		return turnt
	}
			
	function getDay(){
		return Number($('.current-day').text())-1;
	}
			
	function addEvent(id){

		$("#"+id).on('click',  '.btn-primary', function(){
			var eventName = $("#"+id+" select option:selected").val()
			var currentEvent = findEvent(id, eventName);

			if(trip[getDay()][id].indexOf(currentEvent)<0 ){
				trip[getDay()][id].push(currentEvent);
				$("#my-"+id).append(itineraryItem(eventName))
				makeMarker(currentEvent, id);
			}			
		})
	}

	function removeEvent(id){
		$("#my-"+id).on('click',  '.remove', function(){
		$(this).parent().remove();

		var eventName=$(this).siblings().text()
		trip[getDay()][id].forEach(function (event, index, array) {
			if(event.name === eventName) {
				removeMarker(event.marker);
				array.splice(index,1);
			}
		})
			
		})
	}

	$('#day-title').on('click', '.remove', deleteDay)
	$(document).on('click', '.day', selectDay)
	

	  addEvent('hotel')
	  addEvent('restaurant')
	  addEvent('activity') 
	  removeEvent('hotel')
	  removeEvent('restaurant')
	  removeEvent('activity')
});
//---------
var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

			var renderer = new THREE.WebGLRenderer({alpha:true});
			renderer.setSize( window.innerWidth/8, window.innerHeight/8 );
			$('#control-panel').append( renderer.domElement );

			var texture = THREE.ImageUtils.loadTexture( "/images/1.gif" );
			var geometry = new THREE.BoxGeometry( 1, 1, 1 ).scale(4,4,4);
			var material = new THREE.MeshBasicMaterial( { map:texture} )
			var cube = new THREE.Mesh( geometry, material );
			scene.add( cube );

			camera.position.z = 5;

			var render = function () {
				requestAnimationFrame( render );

				cube.rotation.x += 0.05;
				cube.rotation.y += 0.05;

				renderer.render(scene, camera);
			};

			render();
