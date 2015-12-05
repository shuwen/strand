/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/
(function (scope) {

	scope.FlexLayout = Polymer({
		is: "mm-flex-layout",

		behaviors: [
			StrandTraits.Resolvable
		],

		properties: {
			gutter: {
				type: Number,
				value: 20
			},
			columns: {
				type: Number,
				value: 4
			},
			breakpoints: {
				type: Object,
				value: null
			}
		},

		// _insertStyleSheet :: DOMString
		_insertStyleSheet: function(rules) {
			var useShadow = Polymer.Settings.useNativeShadow,
				styleTransformer = Polymer.StyleTransformer,
				styleEl = document.createElement('style'),
				styleSheet;
			Polymer.dom(this.root).appendChild(styleEl);
			styleSheet = styleEl.sheet;

			if(!useShadow) rules = styleTransformer.css(rules, this.is); // Transform styles for ShadyDOM compatibility
			if(rules.indexOf('@media') === -1) rules = '@media {'+rules+'}'; // Wrap styles in catch-all @media rule to insert multiple rules at a time
			styleSheet.insertRule(rules, 0);
		},

		// _createBreakpointsStyle :: Object -> Array
		_createBreakpointsStyle: function(breakpoints) {
			var defaults = {
				'x-small': 4,
				'small': 8,
				'medium': 12,
				'large': 16,
				'x-large': 24
			};
			var rules = Object.keys(breakpoints).map((key) => {
				var cfg = breakpoints[key],
					min = cfg.min ? `(min-width: ${cfg.min}px)` : '',
					max = cfg.max ? `(max-width: ${cfg.max}px)` : '',
					and = cfg.min && cfg.max ? ' and ' : '',
					prefix = `@media ${min}${and}${max} {`,
					styles = this._createColumnsStyle(cfg.columns || defaults[key])
					suffix = `}`;
				return prefix+styles+suffix;
			});
			return rules;
		},

		// _createColumnsStyle :: Number -> DOMString
		_createColumnsStyle: function(columns) {
			var rules = '';
			for(var i=columns; i>=0; i--) {
				rules += `
					:host ::content [span="${i}"] {
						width: ${100*i/columns}%;
					}
				`;
			}
			return rules;
		},

		// _createGuttersStyle :: Number -> DOMString
		_createGuttersStyle: function(gutter) {
			var gutterUnit = gutter/2,
				rules = `
					:host {
						padding-left: ${gutterUnit}px;
						padding-right: ${gutterUnit}px;
					}
					#flexContainer {
						margin-left: ${-1*gutterUnit}px;
						margin-right: ${-1*gutterUnit}px;
					}
					:host ::content [span] {
						padding-left: ${gutterUnit}px;
						padding-right: ${gutterUnit}px;
					}
				`;
			return rules;
		},

		attached: function() {
			if(this.breakpoints) this._createBreakpointsStyle(this.breakpoints).forEach((s) => this._insertStyleSheet(s));
			else this._insertStyleSheet(this._createColumnsStyle(this.columns));
			this._insertStyleSheet(this._createGuttersStyle(this.gutter));
		}
	});

})(window.Strand = window.Strand || {});
