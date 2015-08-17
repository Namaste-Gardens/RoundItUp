var RoundUp = function(){
    var settings = {
        text: 'Round It Up22',
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
    var apiKey = null;
    var total = null;
    var roundUpTotal = null;
    var roundUpAmount = null;
    var roundUpType = null;
    var roundUpToken = null;
    var roundUpButtonClicked = false;
    var button = null;
    
    var setSetting = function(key, value){
        settings[key] = value;
    }
    
    var setTotal = function(value){
        var t_val = value.replace(/[^0-9\.,]+/g,"");
        t_val = t_val.replace(/,/g,".");
        total = parseFloat(t_val);
        if(isNaN(total)  || total.length == 0 || total == 0){
            total = null;
        }
    }
    
    var createButton = function(){
        button = jQuery('<button>')
            .attr({
                type: 'button',
                name: 'round_up_button',
                class: settings.class,
                id: settings.id
            })
            .val(settings.text)
            .text(settings.text)
            .css(settings.css);
    }
    
    var getButton = function(){
        return button;
    }
    
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

                }
            });
            return {total: total};
        }
        
        switch (roundUpType){
            case 'cents':
                var r_val = Math.ceil(total * 10) / 10;
                roundUpTotal = r_val.toFixed(2);
                break;
            case "dollars":
                var r_val = Math.ceil(total);
                roundUpTotal = r_val.toFixed(2);
                break;
        }
        roundUpAmount = roundUpTotal - total;
        
        //do something with button
        button.hide();
        createRoundUpRecord(function(result){
            if(result){
                button.text('Cancel ' + settings.text);
                button.show();
            }
        });
        roundUpButtonClicked = true;
        return {total: roundUpTotal, token: roundUpToken};
    }
    
    var checkApiKey = function(_callback){
        jQuery.post('http://www.jerah.us/roundup/round_up.php',{action: 'check', key: apiKey}, function(response){
            return (response.status == 'success') ? _callback(true, response.token) : _callback(false);
        }, "JSON");
    } 
    
    var createRoundUpRecord = function(_callback){
        jQuery.post('http://www.jerah.us/roundup/round_up.php',{action: 'create', key: apiKey, amount: roundUpAmount, token: roundUpToken}, function(response){
            return (response.status == 'success') ? _callback(true) : _callback(false);
        }, "JSON");
    }
    
    var deleteRoundUpRecord = function(_callback){
        jQuery.post('http://www.jerah.us/roundup/round_up.php',{action: 'delete', key: apiKey, token: roundUpToken}, function(response){
            return (response.status == 'success') ? _callback(true) : _callback(false);
        }, "JSON");
    }
    
    var markPaidRoundUpRecord = function(){
        jQuery.post('http://www.jerah.us/roundup/round_up.php',{action: 'paid', key: apiKey, token: roundUpToken}, function(response){
            return true;
        }, "JSON");
    }
    
    var getInfo = function(){
        var div = jQuery('<div>').attr({
            id: 'round_up_info_div'
        }).css({
            position: 'relative',
            cursor: ' pointer'
        }).html('?');
        
        var tooltip = jQuery('<div>').attr({
            id: 'round_up_tooltip'
        }).css({
            position: 'absolute',
            background: '#FFF',
            padding: '5px',
            'z-index': 999,
            'width': '350px',
            display: 'none',
            'font-size': 'normal',
            'font-weight': 'normal',
            'border': '1px solid #000'
        }).html('<p><strong>What is Round It Up5555555?</strong></p><p> Round It Up is a cool little tool that allows you, the consumer, to round up your total purchase price and then magically, the difference gets sent to a non-profit who benefits from a few cents that adds up. We take care of all the "heavy-lifting" of getting the proceeds to the non-profits.</p><p><a href="http://rounditup.uamini.com" target="_blank">Learn More</a>').appendTo(div);
        
        div.mouseover(function(){
            tooltip.css({
                top: '-' + (div.height() / 2) + 'px',
                left: (div.width() + 2) + 'px'
            });
            tooltip.fadeIn(400);
        }).mouseout(function(){
            tooltip.fadeOut(300);
        });
        
        return div;
    }
    
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
            }
        }
        
        createButton();
        
    }
    
    return {
        init: function(args){
            init(args);
            if(total !== null && roundUpType !== null){
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