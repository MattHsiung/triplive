$(document).ready(function() {
  var map = initialize_gmaps();
	$.post('/api/days/1');
	var markers={};

	var tripMarkers = [[]];

	$('.plus').on('click', addDay);

	function addDay() {

			tripMarkers.push([]);
			var dayToCreate = $('.day-buttons').children().length;
			$.post('api/days/'+dayToCreate, function(response) {
				console.log(response);
			})


			$('.day-buttons').append('<button class="btn btn-circle day-btn day">'+dayToCreate+'</button> ')
	}
	
	function selectDay(){
		resetMarkers(null)
		$('.day').removeClass('current-day')
		$(this).toggleClass('current-day')
		var currentDay = getDay()+1
		$('#currentDay').text('Day '+currentDay)
		$('.list-group').empty()
		renderCurrentDay(currentDay)
	}
	
	function deleteDay(){
		if(tripMarkers.length===1) return;
		resetMarkers(null);
		$.delete('/api/days/'+(getDay()+1));
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

	function deplural(type) {
  	return (type==="activities") ? "activity" : type.slice(0,-1);
}


	function renderCurrentDay(currentDay){
		
		
		$.get('api/days/'+currentDay, function(day) {
			for( var key in day){
				if(key === 'hotel') {
					$("#my-"+key).append(itineraryItem(day[key].name));
					resetMarkers(map, day[key].name);
				} else if (key === 'activities' || key === 'restaurants') {
					day[key].forEach(function(el){
						$("#my-"+deplural(key)).append(itineraryItem(el.name));
						resetMarkers(map, el.name);
					});
				}
			}	
		});
	}

	function resetMarkers(mappy, name){
		var mappy = mappy || null;

			for(var mrk in markers) {
				markers[mrk].setMap(null);
			}

			tripMarkers[getDay()].forEach(function (location) {
				if (mappy) makeMarker(location, name);
			})
	}

  	function makeMarker(location, name){
  		myLatLng = {
				lat: location[0],
				lng: location[1]
			}

			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				icon: '/images/'+Math.floor(Math.random()*10) +'.gif' ,
				animation: google.maps.Animation.BOUNCE
			});
			
			markers[name] = marker;

			var bounds = new google.maps.LatLngBounds();
				for (var key in markers) {
	 			bounds.extend(markers[key].getPosition());
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


				
				// makeMarker(currentEvent, id);
				$.post('api/days/'+(getDay()+1)+'/'+id+'/'+eventName, function(resLocation){
					console.log(resLocation);
					if(resLocation) {
						tripMarkers[getDay()].push(resLocation);
						makeMarker(resLocation, eventName);
						$("#my-"+id).append(itineraryItem(eventName))		
					} else {
						console.log('Already Exists!')	
					}
					
				})
			
		})
	}

	function removeEvent(id){
		$("#my-"+id).on('click',  '.remove', function(){
			$(this).parent().remove();

			var eventName=$(this).siblings().text();
			removeMarker(markers[eventName]);
			// trip[getDay()][id].forEach(function (event, index, array) {
			// 	if(event.name === eventName) {
			// 		removeMarker(event.marker);
			// 		array.splice(index,1);
			// 	}
			// })
			$.delete('api/days/'+(getDay()+1)+'/'+id+'/'+eventName, function(){

					console.log('succes!')
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
			renderer.setSize( 200, 100);
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

jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }
 
    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});






