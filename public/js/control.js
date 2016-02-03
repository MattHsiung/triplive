$(document).ready(function() {
  	var map = initialize_gmaps();
  	var icons = {
		hotel:'/images/lodging_0star.png',
		restaurant: '/images/restaurant.png',
		activity:'/images/star-3.png'
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
			animation: google.maps.Animation.DROP
		});
  	}

	function itineraryItem (eventName){
		return '<div class="itinerary-item"><span class="title">'+eventName+'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button> </div>'
	}

	function findLocation(id, eventName){
		id ==='activity' ? arr = window['activities']:arr = window[id+'s'];
		arr.forEach(function(el){
			if(el.name === eventName) place = el.place[0]
		})
		makeMarker(place, id)
	}
			
	function addEvent(id){
		$("#"+id).on('click',  '.btn-primary', function(){
			var eventName = $("#"+id+" select option:selected").val()
			var place;
			var myLatLng

			$("#my-"+id).append(itineraryItem(eventName))
			
			findLocation(id, eventName)
			
		})
	}

	
	addEvent('hotel')
	  addEvent('restaurant')
	  addEvent('activity')
});
console.log(hotels)
