jQuery(document).ready(function(){
	var html=
		'<tr>' + 
			'<th id="round_up_info"></th>' + 
			'<td>' + 
				'<div>' + 
					'<div id="round_up_range"></div>\n' + 
					'<div id="round_up_charity"></div>\n' + 
				'</div>' + 
				'<div id="round_up_container"></div>\n' + 
			'</td>\n' + 
		'</tr>';

	jQuery('div.cart_totals table tbody tr.shipping')
			.after(html);

	var initialTotal = parseFloat(jQuery('div.cart_totals table tbody tr.order-total span.amount').html().replace('$', '')).toFixed(2);
	if ( isNaN(initialTotal) ) {
		initialTotal = 0.00; // intial value in case if failed to find/parse total amout element on page
	}
	
	var onApply = function(roundUpTotal, roundUpToken) {
		jQuery('div.cart_totals table tbody tr.order-total span.amount')
				.html('$'+roundUpTotal);

		if(jQuery('[name=round_up_token]').length > 0){
			jQuery('[name=round_up_token]').remove();
		}

		var input=jQuery('<input>')
			.attr({type:'hidden',name:'round_up_token'})
			.val(roundUpToken);

		jQuery('form#cart_form').append(input);
	};

	var args={
		apiKey:'431e6a53-86f6-4870-b039-ed065d3a17ba',
		total:initialTotal,
		roundUp:'cents',
		class:'',
		id:'',
		css:{},
		appendTo:'#round_up_container',
		onApplyCallback:onApply
	};

	RoundUp.init(args);

	jQuery('#round_up_info').append(RoundUp.getInfo());
	jQuery('#round_up_range').css('display', 'inline').append(RoundUp.getRoundRankSelect());
	jQuery('#round_up_charity').css('display', 'inline').append(RoundUp.getCharitySelect());
});
