$(function() {

	"use strict"; // ES5 strict mode

	// Button IDs
	var Button = {
		NUM_1: "num_1",
		NUM_2: "num_2",
		NUM_3: "num_3",
		NUM_4: "num_4",
		NUM_5: "num_5",
		NUM_6: "num_6",
		NUM_7: "num_7",
		NUM_8: "num_8",
		NUM_9: "num_9",
		NUM_0: "num_0",
		DECIMAL: "decimal",
		ADDITION: "addition",
		SUBTRACTION: "subtraction",
		MULTIPLICATION: "multiplication",
		DIVISION: "division",
		EQUALS: "equals",
		BACKSPACE: "backspace",
		CLEAR: "clear"
	};

	// buttons json.
	var buttons = {
		"num_0": {
			"text": 0,
			"divClass": "span6",
			"buttonClass": ""
		},
		"num_1": {
			"text": 1,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_2": {
			"text": 2,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_3": {
			"text": 3,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_4": {
			"text": 4,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_5": {
			"text": 5,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_6": {
			"text": 6,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_7": {
			"text": 7,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_8": {
			"text": 8,
			"divClass": "span3",
			"buttonClass": ""
		},
		"num_9": {
			"text": 9,
			"divClass": "span3",
			"buttonClass": ""
		},
		"decimal": {
			"text": ".",
			"divClass": "span3",
			"buttonClass": ""
		},
		"addition": {
			"text": "+",
			"divClass": "span3",
			"buttonClass": "btn-primary"
		},
		"subtraction": {
			"text": "-",
			"divClass": "span3",
			"buttonClass": "btn-primary"
		},
		"multiplication": {
			"text": "&times;",
			"divClass": "span3",
			"buttonClass": "btn-primary"
		},
		"division": {
			"text": "&#247;",
			"divClass": "span3",
			"buttonClass": "btn-primary"
		},
		"equals": {
			"text": "=",
			"divClass": "span3",
			"buttonClass": "btn-primary"
		},
		"backspace": {
			"text": "Del",
			"divClass": "span6",
			"buttonClass": ""
		},
		"clear": {
			"text": "C",
			"divClass": "span3",
			"buttonClass": ""
		}
	};

	// Holds the history.
	var history = [];

	/**
	 * Calculator widget.
	 */
	$.widget('toolbox.calculator', {
		// default options
		options: {

		},
		// the constructor
		_create: function() {
			var divElement = $('<div>'),
				btnElement = $('<a>', {
					"class": "btn btn-block btn-large"
				}),
				container = divElement.clone()
					.addClass("toolbox-calculator"),
				display = $('<input>', {
						"type": "text",
						"disabled": "disabled",
						"class": "display input-block-level",
						"value": 0
					})
					.appendTo(container),
				pad = divElement.clone()
					.addClass('pad')
					.appendTo(container),
				keyDisplay = divElement.clone()
					.addClass('key-display')
					.css({
						"display": "none"
					})
					.appendTo('body'),
				buttonLayout = [
					[
						Button.CLEAR,
						Button.BACKSPACE,
						Button.DIVISION
					], [
						Button.NUM_7,
						Button.NUM_8,
						Button.NUM_9,
						Button.MULTIPLICATION
					], [
						Button.NUM_4,
						Button.NUM_5,
						Button.NUM_6,
						Button.SUBTRACTION
					], [
						Button.NUM_1,
						Button.NUM_2,
						Button.NUM_3,
						Button.ADDITION
					], [
						Button.NUM_0,
						Button.DECIMAL,
						Button.EQUALS
					]
				],
				row,
				div,
				btn,
				button;

			$.each(buttonLayout, function(i, buttonRow) {
				row = divElement.clone()
					.addClass('row-fluid')
					.appendTo(pad);

				$.each(buttonRow, function(j, id) {
					button = buttons[id];
					div = divElement.clone()
						.addClass(button.divClass)
						.appendTo(row);
					btn = btnElement.clone()
						.addClass(button.buttonClass)
						.attr('data-button', id)
						.html(button.text)
						.appendTo(div);
				});
			});

			container.appendTo(this.element);

			this.element.on("click", ".btn", { "widget": this }, this._onButtonClick);
			$(document).keypress({ "widget": this, "display": keyDisplay }, this._onKeyPress);
		},
		_onButtonClick: function(event) {
			console.log(event);

			var elem = $(event.target),
				id = elem.attr('data-button'),
				widget = event.data.widget;

			widget._processInput(id);
		},
		_onKeyPress: function(event) {
			var widget = event.data.widget,
				keyCode = event.keyCode ? event.keyCode : event.which,
				id = widget._keyCodeToButtonId(keyCode),
				display,
				text;

			if (id !== undefined) {
				text = buttons[id].text;
				display = event.data.display;

				display.append(text)
					.show();
				setTimeout(function() {
					display.hide()
						.html("");
				}, 850);

				widget._processInput(id);
			}
		},
		_keyCodeToButtonId: function(keyCode) {
			switch (parseInt(keyCode)) {
				case 13: return Button.EQUALS;
				case 42: return Button.MULTIPLICATION;
				case 43: return Button.ADDITION;
				case 45: return Button.SUBTRACTION;
				case 46: return Button.DECIMAL;
				case 48: return Button.NUM_0;
				case 49: return Button.NUM_1;
				case 50: return Button.NUM_2;
				case 51: return Button.NUM_3;
				case 52: return Button.NUM_4;
				case 53: return Button.NUM_5;
				case 54: return Button.NUM_6;
				case 55: return Button.NUM_7;
				case 56: return Button.NUM_8;
				case 57: return Button.NUM_9;
				case 99: return Button.CLEAR;
				case 100: return Button.BACKSPACE;
				default: return undefined; // unsupported key
			}
		},
		_processInput: function(id) {
			var button = buttons[id],
				buttonText = button.text,
				display = $('.display'),
				displayText = display.val(),
				newText;

			switch (id) {
				case Button.BACKSPACE:
					if (history.length > 0) {
						history.pop(); // remove the top item
						newText = displayText.substring(0, displayText.length - 1);
						if (newText.length === 0) {
							history = [];
							newText = 0;
						}
					}
					break;
				case Button.CLEAR:
					history = [];
					newText = 0;
					break;
				case Button.EQUALS:
					newText = eval(history.join(""));
					break;
				case Button.ADDITION:
					newText = "+";
					history.push(newText);
					break;
				case Button.SUBTRACTION:
					newText = "-";
					history.push(newText);
					break;
				case Button.MULTIPLICATION:
					newText = "*";
					history.push(newText);
					break;
				case Button.DIVISION:
					newText = "/";
					history.push(newText);
					break;
				default:
					if (parseInt(displayText) === 0 || isNaN(displayText)) {
						displayText = "";
					}
					newText = displayText + buttonText;
					history.push(buttonText);
					break;
			}

			display.val(newText);
		},
		// events bound via _on are removed automatically
		// revert other modifications here
		_destroy: function() {
			this.element.off("click", ".btn", this._onButtonClick);
			$(document).off("keypress", this._onKeyPress);
		}
	});

	$('#calculator').calculator();

});