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
			hotels: [],
			restaurants: [],
			activities: []
		}
	]

	$('.plus').on('click',
	function addDay() {
		if (trip.length>6) return;
		trip.push( { 
			hotels: [],
			restaurants:[],
			activities: []
		});
		
		$('.day-buttons').append('<button class="btn btn-circle day-btn day">'+trip.length+'</button> ')
		
		}
	);

	

	function selectDay(){
		var currentDay = $(this).text()
		$('#currentDay').text('Day '+currentDay)
		
	}


  	function makeMarker(place, id){
  		myLatLng = {
			lat: place.location[0],
			lng: place.location[1]
		}

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: icons[id],
			animation: google.maps.Animation.BOUNCE
		});
		markers.push(marker)

		var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < markers.length; i++) {
 			bounds.extend(markers[i].getPosition());
		}

		map.fitBounds(bounds);

		return marker;
  	}

  	function removeMarker(marker) {
  		marker.setMap(null);

  	}

	function itineraryItem (eventName){
		return '<div id='+eventName+' class="itinerary-item"><span class="title">'+eventName+'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button> </div> '
	}

	function findLocation(id, eventName){
		id ==='activity' ? arr = window['activities']:arr = window[id+'s'];
		arr.forEach(function(el){
			if(el.name === eventName) place = el.place[0]
		})
		return place;
	}
			
	function addEvent(id){
		$("#"+id).on('click',  '.btn-primary', function(){
			var eventName = $("#"+id+" select option:selected").val()
			var place=findLocation(id, eventName);

			$("#my-"+id).append(itineraryItem(eventName))
			
			makeMarker(place, id);
			
			//trip.day.hotel/r/a.marker=makeMarker(place, id);

			//trip.day.hotel/r/a.name=eventName;
		})
	}

	function removeEvent(id){
		$("#"+id).on('click',  '.remove', function(){
			var eventName=$this.id;
			console.log(eventName)
			var place=findLocation(id, eventName);
			$("#my-"+id).remove(itineraryItem(eventName))
			
			removeMarker(place,id);
			
			//remove from trip
			
		})
	}

	$(document).on('click', '.day', selectDay)
	
	  addEvent('hotel')
	  addEvent('restaurant')
	  addEvent('activity')
});
console.log(hotels)
