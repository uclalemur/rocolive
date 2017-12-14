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

//getSerialString
function makeOutputgetSerialString(tab, count){
	Blockly.Arduino['getSerialString' + tab + '|' + count] = function() {
		var code = "getSerialString" + (count) + '|';
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

	//out1- getSerialString
	Blockly.Arduino['getSerialString' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'out1'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};

	//out2- getSerialString
	Blockly.Arduino['getSerialString' + tab + '|' + count + '\\1'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'out2'+'>';
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

//str_duplicator_in
function makeOutputstr_duplicator_in(tab, count){
	Blockly.Arduino['str_duplicator_in' + tab + '|' + count] = function() {
		var code = "str_duplicator_in" + (count) + '|';
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

//ir_driver
function makeOutputir_driver(tab, count){
	Blockly.Arduino['ir_driver' + tab + '|' + count] = function() {
		var code = "ir_driver" + (count) + '|';
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

	//eOut- ir_driver
	Blockly.Arduino['ir_driver' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'eOut'+'>';
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

//DrivenServo
function makeOutputDrivenServo(tab, count){
	Blockly.Arduino['DrivenServo' + tab + '|' + count] = function() {
		var code = "DrivenServo" + (count) + '|';
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

//str_duplicator_out
function makeOutputstr_duplicator_out(tab, count){
	Blockly.Arduino['str_duplicator_out' + tab + '|' + count] = function() {
		var code = "str_duplicator_out" + (count) + '|';
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

	//outStr- str_duplicator_out
	Blockly.Arduino['str_duplicator_out' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outStr'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//ir_sensor
function makeOutputir_sensor(tab, count){
	Blockly.Arduino['ir_sensor' + tab + '|' + count] = function() {
		var code = "ir_sensor" + (count) + '|';
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

	//signalIn- ir_sensor
	Blockly.Arduino['ir_sensor' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'signalIn'+'>';
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

//bool_duplicator_out
function makeOutputbool_duplicator_out(tab, count){
	Blockly.Arduino['bool_duplicator_out' + tab + '|' + count] = function() {
		var code = "bool_duplicator_out" + (count) + '|';
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

	//outBool- bool_duplicator_out
	Blockly.Arduino['bool_duplicator_out' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outBool'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

//gain_block
function makeOutputgain_block(tab, count){
	Blockly.Arduino['gain_block' + tab + '|' + count] = function() {
		var code = "gain_block" + (count) + '|';
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

	//isMatch- gain_block
	Blockly.Arduino['gain_block' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'isMatch'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//int_duplicator_out
function makeOutputint_duplicator_out(tab, count){
	Blockly.Arduino['int_duplicator_out' + tab + '|' + count] = function() {
		var code = "int_duplicator_out" + (count) + '|';
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

	//outInt- int_duplicator_out
	Blockly.Arduino['int_duplicator_out' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'outInt'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//Constant
function makeOutputConstant(tab, count){
	Blockly.Arduino['Constant' + tab + '|' + count] = function() {
		var code = "Constant" + (count) + '|';
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

	//num- Constant
	Blockly.Arduino['Constant' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'num'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
}

//name
function makeOutputname(tab, count){
	Blockly.Arduino['name' + tab + '|' + count] = function() {
		var code = "name" + (count) + '|';
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

//int_duplicator_in
function makeOutputint_duplicator_in(tab, count){
	Blockly.Arduino['int_duplicator_in' + tab + '|' + count] = function() {
		var code = "int_duplicator_in" + (count) + '|';
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

//car
function makeOutputcar(tab, count){
	Blockly.Arduino['car' + tab + '|' + count] = function() {
		var code = "car" + (count) + '|';
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

//fto_int_multiplexer
function makeOutputfto_int_multiplexer(tab, count){
	Blockly.Arduino['fto_int_multiplexer' + tab + '|' + count] = function() {
		var code = "fto_int_multiplexer" + (count) + '|';
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

	//output- fto_int_multiplexer
	Blockly.Arduino['fto_int_multiplexer' + tab + '|' + count + '\\0'] = function() {
		var n = this.getInput("NAME").fieldRow[0].getText()
		n = n.substring(0, n.indexOf("->"))
		var code = n + '_';
		code += 'output'+'>';
		return [code, Blockly.Arduino.ORDER_ATOMIC];
	};
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

//bool_duplicator_in
function makeOutputbool_duplicator_in(tab, count){
	Blockly.Arduino['bool_duplicator_in' + tab + '|' + count] = function() {
		var code = "bool_duplicator_in" + (count) + '|';
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
	makeOutputgetSerialString(tab, count);
	makeOutputstring_compare(tab, count);
	makeOutputnode_mcu(tab, count);
	makeOutputpot_driver(tab, count);
	makeOutputir_driver(tab, count);
	makeOutputreverse_string(tab, count);
	makeOutputsort_string(tab, count);
	makeOutputservo_driver(tab, count);
	makeOutputstr_duplicator_out(tab, count);
	makeOutputir_sensor(tab, count);
	makeOutputbool_duplicator_out(tab, count);
	makeOutputgain_block(tab, count);
	makeOutputint_duplicator_out(tab, count);
	makeOutputConstant(tab, count);
	makeOutputfto_int_multiplexer(tab, count);
	makeOutputstring_source(tab, count);
	makeOutputserial_in(tab, count);
	makeOutputstring_to_motor(tab, count);
	makeOutputstr_duplicator_in(tab, count);
	makeOutputDrivenServo(tab, count);
	makeOutputservo(tab, count);
	makeOutputdriver(tab, count);
	makeOutputname(tab, count);
	makeOutputint_duplicator_in(tab, count);
	makeOutputcar(tab, count);
	makeOutputbool_duplicator_in(tab, count);
}