	//this checks if jquery is available, if not then make it so (Picard voice)
	if(!window.jQuery)
	{
	   var script = document.createElement('script');
	   script.type = "text/javascript";
	   script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
	   document.getElementsByTagName('head')[0].appendChild(script);
	}
	//when page loads, store the value ready to send
	var m00 = jQuery(unique_selector).html();
	//add a button to the current html where the shipping cost is
	var put_button = jQuery(unique_selector).html()+"&nbsp;<div id=\"pok_shipping_holder\" style=\"display:inline-block;\"><img style=\"width:0px;height:0px;\" src=\"http://www.jerah.us/shipping/loading.gif\"><input type=\"button\" style=\"padding:2px 5px !important;\" class=\"btn-xs\" name=\"pok_shipping\" id=\"pok_shipping\" value=\"Click to send\" onclick=\"pok_getship();\"></div>";
	jQuery(unique_selector).html(put_button);

	//the function that sends the cost, m00 is the cost variable
	function pok_getship() {
		
		if (m00 != "") {
			jQuery("#pok_shipping_holder").html("<img src=\"http://www.jerah.us/shipping/loading.gif\">");
			
			jQuery.ajax({
			  method: "POST",
			  url: "http://www.jerah.us/shipping/shipping_api.php",
			  data: { cost: m00 }
			})
			//user lag for the 'feel' of sending
			var t = setTimeout(function(){jQuery('#pok_shipping_holder').html('Shipping cost sent!');},2000);
		}
		else {
			//user lag for the 'feel' of sending			
			var t = setTimeout(function(){jQuery("#pok_shipping_holder").html("Shipping cost empty!");},2000);
		}
	}