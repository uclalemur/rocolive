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

	//vOut- pot
	Blockly.Arduino['pot' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'vOut'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

	//cameOut- serial_to_string
	Blockly.Arduino['serial_to_string' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'cameOut'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//receivedString- serial_to_string
	Blockly.Arduino['serial_to_string' + tab + '|' + count + '\\1'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'receivedString'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//string_compare
function makeOutputstring_compare(tab, count){
	Blockly.Arduino['string_compare' + tab + '|' + count] = function() {
		var code = "string_compare" + (count) + '|';
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

	//isMatch- string_compare
	Blockly.Arduino['string_compare' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'isMatch'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

	//do8- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do8'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do2- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\1'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do2'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do3- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\2'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do3'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do0- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\3'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do0'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do1- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\4'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do1'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do6- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\5'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do6'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do7- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\6'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do7'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do4- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\7'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do4'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//do5- node_mcu
	Blockly.Arduino['node_mcu' + tab + '|' + count + '\\8'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'do5'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

	//outInt- pot_driver
	Blockly.Arduino['pot_driver' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outInt'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//aOut- pot_driver
	Blockly.Arduino['pot_driver' + tab + '|' + count + '\\1'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'aOut'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

	//outStr- reverse_string
	Blockly.Arduino['reverse_string' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outStr'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

	//outStr- sort_string
	Blockly.Arduino['sort_string' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outStr'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//servo_driver
function makeOutputservo_driver(tab, count){
	Blockly.Arduino['servo_driver' + tab + '|' + count] = function() {
		var code = "servo_driver" + (count) + '|';
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

	//eOut- servo_driver
	Blockly.Arduino['servo_driver' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'eOut'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//servo
function makeOutputservo(tab, count){
	Blockly.Arduino['servo' + tab + '|' + count] = function() {
		var code = "servo" + (count) + '|';
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

	//outStr- string_source
	Blockly.Arduino['string_source' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outStr'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

	//received- serial_in
	Blockly.Arduino['serial_in' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'received'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//came- serial_in
	Blockly.Arduino['serial_in' + tab + '|' + count + '\\1'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'came'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

function makeAllPrevCompOutputs(tab, count) {
	makeOutputpot(tab, count);
	makeOutputserial_to_string(tab, count);
	makeOutputstring_compare(tab, count);
	makeOutputnode_mcu(tab, count);
	makeOutputpot_driver(tab, count);
	makeOutputreverse_string(tab, count);
	makeOutputsort_string(tab, count);
	makeOutputservo_driver(tab, count);
	makeOutputstring_source(tab, count);
	makeOutputserial_in(tab, count);
	makeOutputstring_to_motor(tab, count);
	makeOutputservo(tab, count);
	makeOutputdriver(tab, count);
}