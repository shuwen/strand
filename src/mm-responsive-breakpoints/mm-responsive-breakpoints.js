/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/
(function(scope) {
	scope.ResponsiveBreakpoints = Polymer({
		is: 'mm-responsive-breakpoints',

		properties: {
			breakpoints: {
				type: Array,
				value: null,
				notify: true
			}
		},

		behaviors: [StrandTraits.LightDomGettable],

		attached: function() {
			var cfg = this.getLightDOM(),
				breakpoints = [];

			for(var i=0; i<cfg.length; i++) {
				var breakpointProps = cfg[i].attributes,
					o = {};
				for(var j=0; j<breakpointProps.length; j++) {
					var pair = breakpointProps[j];
					o[pair.name] = pair.value;
				}
				breakpoints.push(o);
			}
			this.set('breakpoints',breakpoints);
		}

	});
})(window.Strand = window.Strand || {});
