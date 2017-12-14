var BlockList = new Map();

//string_to_motor
function makestring_to_motor(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="string_to_motor"+(count);
	}
	Blockly.Blocks['string_to_motor' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("string_to_motor ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("motorCame").setCheck("string_to_motor").appendField("motorCame");
			this.appendValueInput("motorString").setCheck("string_to_motor").appendField("motorString");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['motorCame', 'motorString', ],
	};
}

//pot
function makepot(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="pot"+(count);
	}
	Blockly.Blocks['pot' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("pot ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'electrical',
		inputs:[],
		outputs:['vOut', ],
	};

	//vOut- pot
	Blockly.Blocks['pot' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->vOut");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'pot',
		outputName:'vOut',
		name:'pot',
	};
}

//serial_to_string
function makeserial_to_string(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="serial_to_string"+(count);
	}
	Blockly.Blocks['serial_to_string' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("serial_to_string ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("received").setCheck("serial_to_string").appendField("received");
			this.appendValueInput("came").setCheck("serial_to_string").appendField("came");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['received', 'came', ],
		outputs:['cameOut', 'receivedString', ],
	};

	//cameOut- serial_to_string
	Blockly.Blocks['serial_to_string' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->cameOut");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'serial_to_string',
		outputName:'cameOut',
		name:'serial_to_string',
	};

	//receivedString- serial_to_string
	Blockly.Blocks['serial_to_string' + tab + '|' + count + '\\1'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->receivedString");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'serial_to_string',
		outputName:'receivedString',
		name:'serial_to_string',
	};
}

//getSerialString
function makegetSerialString(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="getSerialString"+(count);
	}
	Blockly.Blocks['getSerialString' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("getSerialString ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:[],
		outputs:['out1', 'out2', ],
	};

	//out1- getSerialString
	Blockly.Blocks['getSerialString' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->out1");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'getSerialString',
		outputName:'out1',
		name:'getSerialString',
	};

	//out2- getSerialString
	Blockly.Blocks['getSerialString' + tab + '|' + count + '\\1'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->out2");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'getSerialString',
		outputName:'out2',
		name:'getSerialString',
	};
}

//string_compare
function makestring_compare(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="string_compare"+(count);
	}
	Blockly.Blocks['string_compare' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("string_compare ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inDetected").setCheck("string_compare").appendField("inDetected");
			this.appendValueInput("inString").setCheck("string_compare").appendField("inString");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["compareString", "compareString"], ],
		category:'code',
		inputs:['inDetected', 'inString', ],
		outputs:['isMatch', ],
	};

	//isMatch- string_compare
	Blockly.Blocks['string_compare' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->isMatch");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'string_compare',
		outputName:'isMatch',
		name:'string_compare',
	};
}

//node_mcu
function makenode_mcu(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="node_mcu"+(count);
	}
	Blockly.Blocks['node_mcu' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("node_mcu ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("a1").setCheck("node_mcu").appendField("a1");
			this.appendValueInput("di8").setCheck("node_mcu").appendField("di8");
			this.appendValueInput("di4").setCheck("node_mcu").appendField("di4");
			this.appendValueInput("di5").setCheck("node_mcu").appendField("di5");
			this.appendValueInput("di6").setCheck("node_mcu").appendField("di6");
			this.appendValueInput("di7").setCheck("node_mcu").appendField("di7");
			this.appendValueInput("di0").setCheck("node_mcu").appendField("di0");
			this.appendValueInput("di1").setCheck("node_mcu").appendField("di1");
			this.appendValueInput("di2").setCheck("node_mcu").appendField("di2");
			this.appendValueInput("di3").setCheck("node_mcu").appendField("di3");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'electrical',
		inputs:['a1', 'di8', 'di4', 'di5', 'di6', 'di7', 'di0', 'di1', 'di2', 'di3', ],
		outputs:['do8', 'do2', 'do3', 'do0', 'do1', 'do6', 'do7', 'do4', 'do5', ],
	};

	//do8- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do8");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do8',
		name:'node_mcu',
	};

	//do2- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\1'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do2");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do2',
		name:'node_mcu',
	};

	//do3- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\2'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do3");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do3',
		name:'node_mcu',
	};

	//do0- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\3'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do0");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do0',
		name:'node_mcu',
	};

	//do1- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\4'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do1");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do1',
		name:'node_mcu',
	};

	//do6- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\5'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do6");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do6',
		name:'node_mcu',
	};

	//do7- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\6'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do7");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do7',
		name:'node_mcu',
	};

	//do4- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\7'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do4");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do4',
		name:'node_mcu',
	};

	//do5- node_mcu
	Blockly.Blocks['node_mcu' + tab + '|' + count + '\\8'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->do5");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'node_mcu',
		outputName:'do5',
		name:'node_mcu',
	};
}

//str_duplicator_in
function makestr_duplicator_in(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="str_duplicator_in"+(count);
	}
	Blockly.Blocks['str_duplicator_in' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("str_duplicator_in ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inStr").setCheck("str_duplicator_in").appendField("inStr");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["variable_name", "variable_name"], ],
		category:'code',
		inputs:['inStr', ],
	};
}

//pot_driver
function makepot_driver(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="pot_driver"+(count);
	}
	Blockly.Blocks['pot_driver' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("pot_driver ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("vIn").setCheck("pot_driver").appendField("vIn");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:['vIn', ],
		outputs:['outInt', 'aOut', ],
	};

	//outInt- pot_driver
	Blockly.Blocks['pot_driver' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outInt");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'pot_driver',
		outputName:'outInt',
		name:'pot_driver',
	};

	//aOut- pot_driver
	Blockly.Blocks['pot_driver' + tab + '|' + count + '\\1'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->aOut");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'pot_driver',
		outputName:'aOut',
		name:'pot_driver',
	};
}

//ir_driver
function makeir_driver(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="ir_driver"+(count);
	}
	Blockly.Blocks['ir_driver' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("ir_driver ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("signalIn").setCheck("ir_driver").appendField("signalIn");
			this.appendValueInput("Enable").setCheck("ir_driver").appendField("Enable");
			this.appendValueInput("inInt").setCheck("ir_driver").appendField("inInt");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:['signalIn', 'Enable', 'inInt', ],
		outputs:['eOut', ],
	};

	//eOut- ir_driver
	Blockly.Blocks['ir_driver' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->eOut");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'ir_driver',
		outputName:'eOut',
		name:'ir_driver',
	};
}

//reverse_string
function makereverse_string(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="reverse_string"+(count);
	}
	Blockly.Blocks['reverse_string' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("reverse_string ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inStr").setCheck("reverse_string").appendField("inStr");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['inStr', ],
		outputs:['outStr', ],
	};

	//outStr- reverse_string
	Blockly.Blocks['reverse_string' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outStr");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'reverse_string',
		outputName:'outStr',
		name:'reverse_string',
	};
}

//DrivenServo
function makeDrivenServo(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="DrivenServo"+(count);
	}
	Blockly.Blocks['DrivenServo' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("DrivenServo ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("PWMin").setCheck("DrivenServo").appendField("PWMin");
			this.appendValueInput("inInt").setCheck("DrivenServo").appendField("inInt");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:['PWMin', 'inInt', ],
	};
}

//sort_string
function makesort_string(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="sort_string"+(count);
	}
	Blockly.Blocks['sort_string' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("sort_string ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inStr").setCheck("sort_string").appendField("inStr");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['inStr', ],
		outputs:['outStr', ],
	};

	//outStr- sort_string
	Blockly.Blocks['sort_string' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outStr");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'sort_string',
		outputName:'outStr',
		name:'sort_string',
	};
}

//servo_driver
function makeservo_driver(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="servo_driver"+(count);
	}
	Blockly.Blocks['servo_driver' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("servo_driver ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("PWMin").setCheck("servo_driver").appendField("PWMin");
			this.appendValueInput("Enable").setCheck("servo_driver").appendField("Enable");
			this.appendValueInput("inInt").setCheck("servo_driver").appendField("inInt");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:['PWMin', 'Enable', 'inInt', ],
		outputs:['eOut', ],
	};

	//eOut- servo_driver
	Blockly.Blocks['servo_driver' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->eOut");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'servo_driver',
		outputName:'eOut',
		name:'servo_driver',
	};
}

//str_duplicator_out
function makestr_duplicator_out(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="str_duplicator_out"+(count);
	}
	Blockly.Blocks['str_duplicator_out' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("str_duplicator_out ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["variable_name", "variable_name"], ],
		category:'code',
		inputs:[],
		outputs:['outStr', ],
	};

	//outStr- str_duplicator_out
	Blockly.Blocks['str_duplicator_out' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outStr");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'str_duplicator_out',
		outputName:'outStr',
		name:'str_duplicator_out',
	};
}

//ir_sensor
function makeir_sensor(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="ir_sensor"+(count);
	}
	Blockly.Blocks['ir_sensor' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("ir_sensor ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'electrical',
		inputs:[],
		outputs:['signalIn', ],
	};

	//signalIn- ir_sensor
	Blockly.Blocks['ir_sensor' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->signalIn");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'ir_sensor',
		outputName:'signalIn',
		name:'ir_sensor',
	};
}

//servo
function makeservo(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="servo"+(count);
	}
	Blockly.Blocks['servo' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("servo ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("eIn").setCheck("servo").appendField("eIn");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'electrical',
		inputs:['eIn', ],
	};
}

//bool_duplicator_out
function makebool_duplicator_out(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="bool_duplicator_out"+(count);
	}
	Blockly.Blocks['bool_duplicator_out' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("bool_duplicator_out ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["variable_name", "variable_name"], ],
		category:'code',
		inputs:[],
		outputs:['outBool', ],
	};

	//outBool- bool_duplicator_out
	Blockly.Blocks['bool_duplicator_out' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outBool");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'bool_duplicator_out',
		outputName:'outBool',
		name:'bool_duplicator_out',
	};
}

//driver
function makedriver(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="driver"+(count);
	}
	Blockly.Blocks['driver' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("driver ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:[],
	};
}

//gain_block
function makegain_block(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="gain_block"+(count);
	}
	Blockly.Blocks['gain_block' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("gain_block ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inDetected").setCheck("gain_block").appendField("inDetected");
			this.appendValueInput("inString").setCheck("gain_block").appendField("inString");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["compareString", "compareString"], ],
		category:'code',
		inputs:['inDetected', 'inString', ],
		outputs:['isMatch', ],
	};

	//isMatch- gain_block
	Blockly.Blocks['gain_block' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->isMatch");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'gain_block',
		outputName:'isMatch',
		name:'gain_block',
	};
}

//int_duplicator_out
function makeint_duplicator_out(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="int_duplicator_out"+(count);
	}
	Blockly.Blocks['int_duplicator_out' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("int_duplicator_out ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["variable_name", "variable_name"], ],
		category:'code',
		inputs:[],
		outputs:['outInt', ],
	};

	//outInt- int_duplicator_out
	Blockly.Blocks['int_duplicator_out' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outInt");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'int_duplicator_out',
		outputName:'outInt',
		name:'int_duplicator_out',
	};
}

//Constant
function makeConstant(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="Constant"+(count);
	}
	Blockly.Blocks['Constant' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("Constant ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["num", "num"], ],
		category:'code',
		inputs:[],
		outputs:['num', ],
	};

	//num- Constant
	Blockly.Blocks['Constant' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->num");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'Constant',
		outputName:'num',
		name:'Constant',
	};
}

//name
function makename(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="name"+(count);
	}
	Blockly.Blocks['name' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("name ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:[],
	};
}

//int_duplicator_in
function makeint_duplicator_in(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="int_duplicator_in"+(count);
	}
	Blockly.Blocks['int_duplicator_in' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("int_duplicator_in ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inInt").setCheck("int_duplicator_in").appendField("inInt");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["variable_name", "variable_name"], ],
		category:'code',
		inputs:['inInt', ],
	};
}

//car
function makecar(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="car"+(count);
	}
	Blockly.Blocks['car' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("car ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:[],
	};
}

//fto_int_multiplexer
function makefto_int_multiplexer(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="fto_int_multiplexer"+(count);
	}
	Blockly.Blocks['fto_int_multiplexer' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("fto_int_multiplexer ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inputFour").setCheck("fto_int_multiplexer").appendField("inputFour");
			this.appendValueInput("inputTwo").setCheck("fto_int_multiplexer").appendField("inputTwo");
			this.appendValueInput("switchThree").setCheck("fto_int_multiplexer").appendField("switchThree");
			this.appendValueInput("switchOne").setCheck("fto_int_multiplexer").appendField("switchOne");
			this.appendValueInput("switchTwo").setCheck("fto_int_multiplexer").appendField("switchTwo");
			this.appendValueInput("inputOne").setCheck("fto_int_multiplexer").appendField("inputOne");
			this.appendValueInput("switchFour").setCheck("fto_int_multiplexer").appendField("switchFour");
			this.appendValueInput("inputThree").setCheck("fto_int_multiplexer").appendField("inputThree");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['inputFour', 'inputTwo', 'switchThree', 'switchOne', 'switchTwo', 'inputOne', 'switchFour', 'inputThree', ],
		outputs:['output', ],
	};

	//output- fto_int_multiplexer
	Blockly.Blocks['fto_int_multiplexer' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->output");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'fto_int_multiplexer',
		outputName:'output',
		name:'fto_int_multiplexer',
	};
}

//string_source
function makestring_source(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="string_source"+(count);
	}
	Blockly.Blocks['string_source' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("string_source ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:[],
		outputs:['outStr', ],
	};

	//outStr- string_source
	Blockly.Blocks['string_source' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->outStr");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'string_source',
		outputName:'outStr',
		name:'string_source',
	};
}

//bool_duplicator_in
function makebool_duplicator_in(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="bool_duplicator_in"+(count);
	}
	Blockly.Blocks['bool_duplicator_in' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("bool_duplicator_in ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.appendValueInput("inBool").setCheck("bool_duplicator_in").appendField("inBool");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[["variable_name", "variable_name"], ],
		category:'code',
		inputs:['inBool', ],
	};
}

//serial_in
function makeserial_in(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="serial_in"+(count);
	}
	Blockly.Blocks['serial_in' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("serial_in ").appendField(new Blockly.FieldTextInput(ans), "NAME");
			for(var i = 0; i < this.params.length; i++){
				this.appendDummyInput().appendField("Parameter " + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), "PARAM" + i);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:[],
		outputs:['received', 'came', ],
	};

	//received- serial_in
	Blockly.Blocks['serial_in' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->received");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'serial_in',
		outputName:'received',
		name:'serial_in',
	};

	//came- serial_in
	Blockly.Blocks['serial_in' + tab + '|' + count + '\\1'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->came");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'serial_in',
		outputName:'came',
		name:'serial_in',
	};
}

function makeAllPrevComps(tab, count) {
	makepot(tab, count);
	makeserial_to_string(tab, count);
	makegetSerialString(tab, count);
	makestring_compare(tab, count);
	makenode_mcu(tab, count);
	makepot_driver(tab, count);
	makeir_driver(tab, count);
	makereverse_string(tab, count);
	makesort_string(tab, count);
	makeservo_driver(tab, count);
	makestr_duplicator_out(tab, count);
	makeir_sensor(tab, count);
	makebool_duplicator_out(tab, count);
	makegain_block(tab, count);
	makeint_duplicator_out(tab, count);
	makeConstant(tab, count);
	makefto_int_multiplexer(tab, count);
	makestring_source(tab, count);
	makeserial_in(tab, count);
	makestring_to_motor(tab, count);
	makestr_duplicator_in(tab, count);
	makeDrivenServo(tab, count);
	makeservo(tab, count);
	makedriver(tab, count);
	makename(tab, count);
	makeint_duplicator_in(tab, count);
	makecar(tab, count);
	makebool_duplicator_in(tab, count);
}