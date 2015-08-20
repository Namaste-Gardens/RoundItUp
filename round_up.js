var RoundUp = function(){
    var settings = {
        text: 'Round It Up',
        class: '',
        id: '',
        css: {
            padding: '10px',
            color: 'red',
            border: '1px solid blue',
            cursor: 'pointer'
        },
        appendTo: ''
    };
	
	var serverSideApiUri = 'http://rounditup.uamini.com/rounditup/round_up.php';
	//var serverSideApiUri = 'http://localhost/rounditup/round_up.php'; /* dev mode */
	
    var apiKey = null;
    var total = null;
	
    var roundUpTotal = null;
    var roundUpAmount = null;
    var roundUpType = null;
    var roundUpToken = null;
	var roundUpCharityUID = null;
	
    var charities = [];
	
    var roundUpButtonClicked = false;
	
    var button = null;
	var roundRankSelect = null;
	var charitySelect = null;
	
	var onApplyCallback = null;
	
    var setSetting = function(key, value){
        settings[key] = value;
    };
    
    var setTotal = function(value){
        var t_val = value.replace(/[^0-9\.,]+/g,"");
        t_val = t_val.replace(/,/g,".");
        total = parseFloat(t_val);
        if(isNaN(total)  || total.length === 0 || total === 0){
            total = null;
        }
    };
    
    var createButton = function(){
        button = jQuery('<button>')
            .attr({
                type: 'button',
                name: 'round_up_button',
                class: 'round_up_button',
                id: 'round_up_button'
            })
            .val(settings.text)
            .text(settings.text)
            .css(settings.css)
			.on('click touchstart', function(e) {
				e.preventDefault();
		
				roundUpTotalFunction();
			});
    };
	
    var getButton = function(){
        return button;
    };
    
	var createRoundRankSelect = function() {
        roundRankSelect = jQuery('<select>')
            .attr({
                name: 'round_up_rank',
                class: 'round_up_rank',
                id: 'round_up_rank'
            })
			.append('<option value="cents" selected>$.10</option>')
			.append('<option value="dollars">$1.00</option>')
			.append('<option value="5dollars">$5.00</option>')
            .css(settings.css)
			.on('change', function(e) {
				e.preventDefault();
				
				roundUpType = this.options[this.selectedIndex].value;
				
				if ( roundUpButtonClicked ) {
					button.hide();
					
					deleteRoundUpRecord(function(result){
						if(result){
							roundUpTotal = null;
							roundUpAmount = null;
							roundUpButtonClicked = false;
							
							roundUpTotalFunction();
						}
					});
				}
			});
	};

	var getRoundRankSelect = function(){
        return roundRankSelect;
    };
	
	var createCharitySelect = function() {
		charitySelect = jQuery('<select>')
            .attr({
                name: 'round_up_charity',
                class: 'round_up_charity',
                id: 'round_up_charity'
            })
            .css(settings.css)
			.append('<option value="-1" selected>Any Charity</option>')
			.on('change', function(e) {
				e.preventDefault();
				
				roundUpCharityUID = this.options[this.selectedIndex].value;
				if ( roundUpButtonClicked ) {
					button.hide();
					
					deleteRoundUpRecord(function(result){
						if(result){
							roundUpTotal = null;
							roundUpAmount = null;
							roundUpButtonClicked = false;
							
							roundUpTotalFunction();
						}
					});
				}
			});
	};
	
	var getCharitySelect = function() {
		return charitySelect;
	};
    
    var roundUpTotalFunction = function(){
        if(roundUpButtonClicked){
            button.hide();
            deleteRoundUpRecord(function(result){
                if(result){
                    //bring back button ?
                    button.text(settings.text);
                    roundUpTotal = null;
                    roundUpAmount = null;
                    roundUpButtonClicked = false;
                    button.show();
					
					onApplyCallback(total, 0, null);
                }
            });
        } else {

			switch (roundUpType){
				case 'dollars':
					var r_val = Math.ceil(total);
					roundUpTotal = r_val.toFixed(2);
					break;
				case '5dollars':
					var r_val = (total % 10 > 5 ? Math.ceil(total/10)*10 : Math.floor(total/10)*10 + 5 );
					roundUpTotal = r_val.toFixed(2);
					break;
				default: /* case 'cents' */
					var r_val = Math.ceil(total * 10) / 10;
					roundUpTotal = r_val.toFixed(2);
					break;
			}
			roundUpAmount = (roundUpTotal - total).toFixed(2);

			//do something with button
			button.hide();
			createRoundUpRecord(function(result){
				if(result){
					button.text('Cancel ' + settings.text);
					button.show();
				}
			});
			roundUpButtonClicked = true;
			
			onApplyCallback(roundUpTotal, roundUpAmount, roundUpToken);
		}
    };
    
    var checkApiKey = function(_callback){
        jQuery.post(serverSideApiUri,
			{
				action: 'check', 
				key: apiKey
			}, function(response){
				return (response.status === 'success') 
					? _callback(true, response.token) 
					: _callback(false);
			}, "JSON");
    };
    
    var createRoundUpRecord = function(_callback){
        jQuery.post(serverSideApiUri,
			{
				action: 'create', 
				key: apiKey, 
				amount: roundUpAmount, 
				token: roundUpToken,
				charityUID: roundUpCharityUID,
				ref: location.host
			}, function(response){
				return (response.status === 'success') 
					? _callback(true) 
					: _callback(false);
			}, "JSON");
    };
    
    var deleteRoundUpRecord = function(_callback){
        jQuery.post(serverSideApiUri,
			{
				action: 'delete', 
				key: apiKey, 
				token: roundUpToken
			}, function(response){
				return (response.status === 'success') 
					? _callback(true) 
					: _callback(false);
			}, "JSON");
    };
    
    var markPaidRoundUpRecord = function(){
        jQuery.post(serverSideApiUri,
			{
				action: 'paid', 
				key: apiKey, 
				token: roundUpToken
			}, function(response){
				return true;
			}, "JSON");
    };
	
	var loadCharities = function() {
        jQuery.post(serverSideApiUri,
			{
				action: 'charities', 
				key: apiKey
			}, function(response){
				if ( (response.status === 'success') && ('object' === typeof(response.charities)) ) {
					charities = response.charities;
				}
				
				if ( charities.length > 0) {
					for(var i=0; i < charities.length; i++) {
						charitySelect.append('<option value="' + charities[i].uid + '">' + charities[i].name + '</option>');
					}
				}
				return true;
			}, "JSON");
	};
    
    var getInfo = function(){
        var div = jQuery('<div>').attr({
				id: 'round_up_info_div'
			}).css({
				position: 'relative',
				cursor: ' pointer'
			})
			.data('showTooltip', true)
			.html('Round It Up')
			.mouseenter(function(){
					if ( true === div.data('showTooltip') ) {
						tooltip.css({
							top: '-' + (div.height() / 2) + 'px',
							left: - (tooltip.width() + 20) +  'px'
						});
						tooltip.fadeIn(400);
					}
				})
			.mouseleave(function(){
					if ( true === div.data('showTooltip')) {
						tooltip.fadeOut(300);
						div.data('showTooltip', false);
						setTimeout(function() {div.data('showTooltip', true);}, 1000);
					}
				});
        
        var tooltip = jQuery('<div>').attr({
				id: 'round_up_tooltip'
			})
			.css({
				position: 'absolute',
				background: '#FFF',
				padding: '5px',
				'z-index': 999,
				'width': '350px',
				display: 'none',
				'font-size': 'normal',
				'font-weight': 'normal',
				'border': '1px solid #000'
			}).html('<p><strong>What is Round It Up?</strong></p><p> Round It Up is a cool little tool that allows you, the consumer, to round up your total purchase price and then magically, the difference gets sent to a non-profit who benefits from a few cents that adds up. We take care of all the "heavy-lifting" of getting the proceeds to the non-profits.</p><p><a href="http://rounditup.uamini.com" target="_blank">Learn More</a>').appendTo(div);
        
        return div;
    };
    
    var init = function(args){
        if(typeof args !== 'undefined' && typeof args === 'object'){
            for (var key in args) {
                if(key in settings){
                    setSetting(key, args[key]);
                }
                
                if(key === 'total'){
                    setTotal(args[key]);
                }
                
                if(key === 'roundUp'){
                    roundUpType = args[key];
                }
                
                if(key === 'apiKey'){
                    apiKey = args[key];
                }
				
				if ( key === 'onApplyCallback') {
					onApplyCallback = args[key];
				}
            }
        }
        
        createButton();
		createRoundRankSelect();
		createCharitySelect();
		
		loadCharities();
    };
    
    return {
        init: function(args){
            init(args);
            if(total !== null && roundUpType !== null && null !== onApplyCallback ){
                return checkApiKey(function(result, token){
                    if(result){
                        roundUpToken = token;
                        jQuery(settings.appendTo).append(button);
                    }else{
                        button = null;
                    }
                });
            }
            return false;
        },
        
        getButton: function(){
            return getButton();
        },
        
		getRoundRankSelect: function(){
            return getRoundRankSelect();
        },
		getCharitySelect: function(){
			return getCharitySelect();
		},
		
		isRoundUpButtonClicked: function() {
			return (true === roundUpButtonClicked);
		},
        
        setTotal: function(total){
            setTotal(total);
        },
        
        roundItUp: function(){
            return roundUpTotalFunction();
        },
                
        markAsPaid: function(api_key, order_token){
            apiKey = api_key;
            roundUpToken = order_token;
            markPaidRoundUpRecord();
        },
                
        getInfo: function(){
            return getInfo();
        }
    };
}();