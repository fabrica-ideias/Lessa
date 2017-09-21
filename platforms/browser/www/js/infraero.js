$(document).ready(function() {
		$.ajax({
			url: 'php/flightxml_query.php',
			data: {
				airport_code: "SBFZ"
			},
			success: function(response) {
				if (response.error) {
					alert('Failed to decode route: ' + response.error);
					return;
				}

				$('tbody').empty();

				$.each(response, function(key, value) {
					value.forEach(flight => {
						table = $('#tabelavoos tbody');
						airport = flight.destination.code;
						var departureTime = (flight.actual_departure_time && flight.actual_departure_time.epoch > 0) ? flight.actual_departure_time.time : flight.estimated_departure_time.time;
						var arrivalTime = (flight.actual_arrival_time && flight.actual_arrival_time.epoch > 0) ? flight.actual_arrival_time.time : flight.estimated_arrival_time.time;
						table.append('<tr><td><img class="logoairline" src="assets/icon/airline/'+ flight.airline +'.jpg"></td><td>' + flight.flightnumber + '</td><td>' + flight.origin.city +'</td><td>'+departureTime+'</td><td>' + arrivalTime + '</td><td>' + flight.status + '</td></tr>');
						console.log(flight);
					});
				});
			}
		})
});