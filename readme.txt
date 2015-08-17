Round Up plugin (http://rounditup.uamini.com/)

Initialize plugin (jQuery library is required):

   <script type='text/javascript' src='http://rounditup.uamini.com/roundup/round_up.js'></script>
   <script type='text/javascript>
	var args = {
		apiKey: ''’, // Required @type: string
		total: "", // Required! @type: string
		roundUp: 'cents', // Required! @type: string, Value: cents, dollars, 5dollars
		class: "", //Optional @type: string
		id: "", //Optional @type: string
		css: {}, //Optional, @type: JavaScript object
		appendTo: "", // Required, @type: string - select element on page where to append button. jQuery notaion # for id and . for class. Example #container
		onApplyCallback: function( roundUpTotal, roundUpToken ) // callback function, called after total is rounded up or rounded down to initial value. Use it to change elements on page with total amounts
	};
	RoundUp.init(args);
   </script>
