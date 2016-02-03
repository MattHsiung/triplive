function itineraryItem (eventName){
	return '<div class="itinerary-item"><span class="title">'+eventName+'</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button> </div>'
}


function addEvent(id){
	$("#"+id).on('click',  '.btn-primary', function(){

		var eventName = $("#"+id+" select option:selected").val()
		console.log(eventName)
		$("#my-"+id).append(itineraryItem(eventName))

	})
}


addEvent('hotel')
addEvent('restaurant')
addEvent('activity')
console.log(hotels)