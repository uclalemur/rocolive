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

//user_toggle
function makeuser_toggle(tab, count, name){
	var ans = name;
	if (name === undefined){
		ans="user_toggle"+(count);
	}
	Blockly.Blocks['user_toggle' + tab + '|' + count] = {
		init: function(){
			this.appendDummyInput().appendField("user_toggle ").appendField(new Blockly.FieldTextInput(ans), "NAME");
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
		outputs:['tog', ],
	};

	//tog- user_toggle
	Blockly.Blocks['user_toggle' + tab + '|' + count + '\\0'] = {
		init: function(){
			this.appendDummyInput("NAME").appendField(ans + "->tog");
			this.setOutput(true, null);
			this.setColour(180);
		},
		outputType:'user_toggle',
		outputName:'tog',
		name:'user_toggle',
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
	makenode_mcu(tab, count);
	makepot_driver(tab, count);
	makereverse_string(tab, count);
	makesort_string(tab, count);
	makeuser_toggle(tab, count);
	makestring_source(tab, count);
	makeserial_in(tab, count);
	makestring_to_motor(tab, count);
	makedriver(tab, count);
}