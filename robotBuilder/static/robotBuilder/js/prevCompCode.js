//string_to_motor
function makeOutputstring_to_motor(tab, count){
	Blockly.Arduino['string_to_motor' + tab + '|' + count] = function() {
		var code = "string_to_motor" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//pot
function makeOutputpot(tab, count){
	Blockly.Arduino['pot' + tab + '|' + count] = function() {
		var code = "pot" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//serial_to_string
function makeOutputserial_to_string(tab, count){
	Blockly.Arduino['serial_to_string' + tab + '|' + count] = function() {
		var code = "serial_to_string" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//node_mcu
function makeOutputnode_mcu(tab, count){
	Blockly.Arduino['node_mcu' + tab + '|' + count] = function() {
		var code = "node_mcu" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//pot_driver
function makeOutputpot_driver(tab, count){
	Blockly.Arduino['pot_driver' + tab + '|' + count] = function() {
		var code = "pot_driver" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//reverse_string
function makeOutputreverse_string(tab, count){
	Blockly.Arduino['reverse_string' + tab + '|' + count] = function() {
		var code = "reverse_string" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//sort_string
function makeOutputsort_string(tab, count){
	Blockly.Arduino['sort_string' + tab + '|' + count] = function() {
		var code = "sort_string" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//driver
function makeOutputdriver(tab, count){
	Blockly.Arduino['driver' + tab + '|' + count] = function() {
		var code = "driver" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//string_source
function makeOutputstring_source(tab, count){
	Blockly.Arduino['string_source' + tab + '|' + count] = function() {
		var code = "string_source" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

//serial_in
function makeOutputserial_in(tab, count){
	Blockly.Arduino['serial_in' + tab + '|' + count] = function() {
		var code = "serial_in" + (count) + '|';
		code += (this.getFieldValue('NAME') + '|');
		code += (this.inputs.length + '|');
		code += (this.params.length + '|');
		for(var i = 0; i < this.inputs.length; i++){
			code += this.inputs[i];
			code += '\\';
			code += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);
		}

		code += '#';
		for(var i = 0; i < this.params.length; i++){
			code += (this.params[i][0] + "|" + this.params[i][1] + "|");
		}

		code += '#';
		return code;
	}
}

function makeAllPrevCompOutputs(tab, count) {
	makeOutputstring_to_motor(tab, count);
	makeOutputpot(tab, count);
	makeOutputserial_to_string(tab, count);
	makeOutputnode_mcu(tab, count);
	makeOutputpot_driver(tab, count);
	makeOutputreverse_string(tab, count);
	makeOutputsort_string(tab, count);
	makeOutputdriver(tab, count);
	makeOutputstring_source(tab, count);
	makeOutputserial_in(tab, count);
}