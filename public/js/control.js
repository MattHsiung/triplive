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
				event.marker.setMap(mappy);
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
			icon: icons[id],
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
console.log(hotels)
