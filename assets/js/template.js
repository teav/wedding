$(function() {
	var my_nav = $('.navbar-sticky'); 
	// grab the initial top offset of the navigation 
	var sticky_navigation_offset_top = my_nav.offset().top;
	
	// our function that decides weather the navigation bar should have "fixed" css position or not.
	var sticky_navigation = function(){
		var scroll_top = $(window).scrollTop(); // our current vertical position from the top
		
		// if we've scrolled more than the navigation, change its position to fixed to stick to top, otherwise change it back to relative
		if (scroll_top > sticky_navigation_offset_top) { 
			my_nav.addClass( 'stick' );
		} else {
			my_nav.removeClass( 'stick' );
		}   
	};

	var initio_parallax_animation = function() { 
		$('.parallax').each( function(i, obj) {
			var speed = $(this).attr('parallax-speed');
			if( speed ) {
				var background_pos = '-' + (window.pageYOffset / speed) + "px";
				$(this).css( 'background-position', 'center ' + background_pos );
			}
		});
	}
	
	// run our function on load
	sticky_navigation();
	
	// and run it again every time you scroll
	$(window).scroll(function() {
		 sticky_navigation();
		 // initio_parallax_animation();
	});
	  $('#navbar a').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top - 60
	        }, 1000);
	        return false;
		  };
		}
	  });

	  // $.adaptiveBackground.run();

	$('#rsvp-form').on('submit', function(e) {
		e.preventDefault();
	  	var form = $(this),
	  		songs = form.find('input[name=songs]'),
	  		songList = form.find('input[name^=song]').filter(function() {
	  			return !!this.value;
	  		}).map(function() {
	  			return this.value;
	  		});

	  	songs.val(songList.toArray().join(','));

	  	$.ajax({
	  		url: form.attr('action'),
	  		type: form.attr('method'),
	  		dataType: 'xml',
	  		// jsonp: doSuccess,
	  		// jsonpCallback: 'success',
	  		// contentType: 'xml',
	  		data: serializeGoogleForm(),
	  		success: function(data) {
	  			console.log('in success callback', data);
	  		},
	  		error: function(a, b, c) {
	  			console.log('in error callback', a, b, c);
	  		},
	  		complete: function() {
	  			form.hide();
	  			$('#rsvp-success').show();
	  		}
		});

		function serializeGoogleForm() {
			var gData = {};
			form.find('.g-form').each(function(i, input) {
				var val = input.value;
				if (!!val) {
					gData[input.dataset.gName] = val;
				}
			});
			return gData;
		}

		function doSuccess(response) {
			console.log('yay!', response);
		}

	});
});

jQuery(document).ready(function($) {

	/*
	 * declare map as a global variable
	 */
	var RICHWOOD_POS = new google.maps.LatLng(38.72511, -85.34926),
		map;

	/*
	 * use google maps api built-in mechanism to attach dom events
	 */
	google.maps.event.addDomListener(window, 'load', function () {
		//show map for Richwood
		var map_wrapper = document.getElementById('map-wrapper'),
			map = new google.maps.Map(map_wrapper, {
		    	center: RICHWOOD_POS,
		    	zoom: 17,
		    	styles: [{'featureType':'landscape.natural','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#e0efef'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#1900ff'},{'color':'#c0e8e8'}]},{'featureType':'landscape.man_made','elementType':'geometry.fill'},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','stylers':[{'color':'#7dcdcd'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'visibility':'on'},{'lightness':700}]}],
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			});

		
		//create marker and popup window
		var richwoodInfo = document.getElementById('richwood-info');
		var infowindow = new google.maps.InfoWindow({
	    	content: richwoodInfo.innerHTML,
	    	maxWidth: 300
	  	});

	  	var marker = new google.maps.Marker({
	      	position: RICHWOOD_POS,
	      	map: map,
	      	title: 'Richwood Plantation'
	  	});

	  	richwoodInfo.style.display = 'none';
	  	var open = false;
	  	google.maps.event.addListener(marker, 'click', function() {
	  		if (!!open) {
	  			infowindow.close(map);
	  		} else {
	    		infowindow.open(map,marker);
	  		}
	  		open = !open;
	  	});

		// if geolocation works, create directions layer
		if(navigator.geolocation) {
			var directionsService = new google.maps.DirectionsService(),
				directionsDisplay = new google.maps.DirectionsRenderer();

			directionsDisplay.setMap(map);
	    	navigator.geolocation.getCurrentPosition(function(position) {
		    	var current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		    	var direction = {
					origin: current,
					destination: RICHWOOD_POS,
				  	provideRouteAlternatives: false,
				  	travelMode: google.maps.TravelMode.DRIVING,
				  	unitSystem: google.maps.UnitSystem.IMPERIAL
				}

				directionsService.route(direction, function(result, status) {
				    if (status == google.maps.DirectionsStatus.OK) {
				      directionsDisplay.setDirections(result);
				    }
				});
		    });
		}
	});

});