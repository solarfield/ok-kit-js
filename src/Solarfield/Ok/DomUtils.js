/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@license https://github.com/solarfield/ok-kit-js/blob/master/LICENSE}
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/ok-kit-js/src/Solarfield/Ok/DomUtils',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok.ObjectUtils,
			true
		);
	}
})
(function (ObjectUtils, _createGlobals) {
	"use strict";

	var DomUtils = function () {
		throw new Error("Class is abstract.");
	};

	DomUtils.offsetTop = function (aElement) {
		var offset = 0;
		var el = aElement;

		do {
			offset += el.offsetTop;
		}
		while ((el = el.offsetParent));

		return offset;
	};

	DomUtils.offsetLeft = function (aElement) {
		var offset = 0;
		var el = aElement;

		do {
			offset += el.offsetLeft;
		}
		while ((el = el.offsetParent));

		return offset;
	};

	/**
	 * @param {RegExp} aRegExp
	 * @param {CSSRule[]=} aRuleList
	 * @returns {Array}
	 */
	DomUtils.findCssRules = function (aRegExp, aRuleList) {
		function searchRules(aCssRules, aRegExp) {
			var j;
			var matchedRules = [];

			for (j = 0; j < aCssRules.length; j++) {
				if (aCssRules[j].cssRules) {
					matchedRules = matchedRules.concat(searchRules(aCssRules[j].cssRules, aRegExp));
				}

				if (aCssRules[j].cssText) {
					if (aCssRules[j].cssText.search(aRegExp) > -1) {
						matchedRules.push(aCssRules[j]);
					}
				}
			}

			return matchedRules;
		}

		var i, rules, tempRules, j;
		var matchedRules = [];

		if (aRuleList) {
			matchedRules = searchRules(aRuleList, aRegExp);
		}

		else {
			for (i = 0; i < document.styleSheets.length; i++) {
				rules = null;

				//we use try here because the same-origin policy can result in errors on access
				try {rules = document.styleSheets[i].cssRules;}
				catch (ex) {}

				if (rules) {
					tempRules = searchRules(rules, aRegExp);
					for (j = 0; j < tempRules.length; j++) {
						matchedRules.push(tempRules[j]);
					}
				}
			}
		}

		return matchedRules;
	};

	/**
	 * @param {RegExp} aRegExp
	 * @param {CssRule=} aRuleList
	 * @returns {*}
	 */
	DomUtils.findCssRule = function (aRegExp, aRuleList) {
		var rules = DomUtils.findCssRules(aRegExp, aRuleList);
		return rules.length > 0 ? rules[0] : null;
	};

	DomUtils.getAncestorByClassName = function (aElement, aClassName) {
		var ancestor = null;
		var el = aElement;

		while ((el = el.parentElement)) {
			if (el.classList.contains(aClassName)) {
				ancestor = el;
				break;
			}
		}

		return ancestor;
	};

	DomUtils.getAncestorByTagName = function (aElement, aTagName) {
		var ancestor = null;
		var el = aElement;

		while ((el = el.parentElement)) {
			if (el.tagName == aTagName) {
				ancestor = el;
				break;
			}
		}

		return ancestor;
	};

	DomUtils.selectOptionsByValue = function (aElement, aValues) {
		var multiple = aElement.multiple;
		var i, j, matched, values, selected, msg;

		values = aValues instanceof Array ? [].concat(aValues) : [aValues];

		if (!multiple && values.length > 1) {
			msg = "Could not select multiple values";
			if (aElement.id) msg += " in <select>[id='" + aElement.id + "']";
			else if (aElement.name) msg += " in <select>[name='" + aElement.name + "']";
			else if (aElement.className) msg += " in <select>[class='" + aElement.className + "']";
			else msg += " in <select>";
			msg += ", because it is not multiple.";
			throw new Error(msg);
		}

		for (i = 0; i < values.length; i++) {
			values[i] = (values[i] === null || values[i] === undefined) ? '' : ''+values[i];
		}

		selected = [].concat(values);

		for (i = 0; i < aElement.options.length; i++) {
			matched = false;

			for (j = 0; j < values.length; j++) {
				if (aElement.options[i].value === values[j]) {
					matched = true;
					selected.splice(j, 1);
					break;
				}
			}

			if (matched) {
				aElement.options[i].selected = true;
				if (!multiple) break;
			}
			else {
				aElement.options[i].selected = false;
			}
		}

		if (selected.length > 0) {
			msg = "Could not select <option>[value='" + selected[0] + "'] by value";
			if (aElement.id) msg += " in <select>[id='" + aElement.id + "']";
			else if (aElement.name) msg += " in <select>[name='" + aElement.name + "']";
			else if (aElement.className) msg += " in <select>[class='" + aElement.className + "']";
			else msg += " in <select>";
			msg += ".";

			throw new Error(msg);
		}
	};

	if (_createGlobals) {
		ObjectUtils.defineNamespace('Solarfield.Ok');
		Solarfield.Ok.DomUtils = DomUtils;
	}

	return DomUtils;
});