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
			this.appendValueInput("vOut").setCheck("pot").appendField("vOut");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'electrical',
		inputs:['vOut', ],
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
			this.appendValueInput("receivedString").setCheck("serial_to_string").appendField("receivedString");
			this.appendValueInput("came").setCheck("serial_to_string").appendField("came");
			this.appendValueInput("cameOut").setCheck("serial_to_string").appendField("cameOut");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['received', 'receivedString', 'came', 'cameOut', ],
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
			this.appendValueInput("di7").setCheck("node_mcu").appendField("di7");
			this.appendValueInput("do5").setCheck("node_mcu").appendField("do5");
			this.appendValueInput("do6").setCheck("node_mcu").appendField("do6");
			this.appendValueInput("do7").setCheck("node_mcu").appendField("do7");
			this.appendValueInput("a1").setCheck("node_mcu").appendField("a1");
			this.appendValueInput("di4").setCheck("node_mcu").appendField("di4");
			this.appendValueInput("do8").setCheck("node_mcu").appendField("do8");
			this.appendValueInput("di6").setCheck("node_mcu").appendField("di6");
			this.appendValueInput("di8").setCheck("node_mcu").appendField("di8");
			this.appendValueInput("do4").setCheck("node_mcu").appendField("do4");
			this.appendValueInput("di5").setCheck("node_mcu").appendField("di5");
			this.appendValueInput("do2").setCheck("node_mcu").appendField("do2");
			this.appendValueInput("do3").setCheck("node_mcu").appendField("do3");
			this.appendValueInput("do0").setCheck("node_mcu").appendField("do0");
			this.appendValueInput("do1").setCheck("node_mcu").appendField("do1");
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
		inputs:['di7', 'do5', 'do6', 'do7', 'a1', 'di4', 'do8', 'di6', 'di8', 'do4', 'di5', 'do2', 'do3', 'do0', 'do1', 'di0', 'di1', 'di2', 'di3', ],
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
			this.appendValueInput("outInt").setCheck("pot_driver").appendField("outInt");
			this.appendValueInput("aOut").setCheck("pot_driver").appendField("aOut");
			this.appendValueInput("vIn").setCheck("pot_driver").appendField("vIn");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code, electrical',
		inputs:['outInt', 'aOut', 'vIn', ],
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
			this.appendValueInput("outStr").setCheck("reverse_string").appendField("outStr");
			this.appendValueInput("inStr").setCheck("reverse_string").appendField("inStr");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['outStr', 'inStr', ],
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
			this.appendValueInput("outStr").setCheck("sort_string").appendField("outStr");
			this.appendValueInput("inStr").setCheck("sort_string").appendField("inStr");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['outStr', 'inStr', ],
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
			this.appendValueInput("outStr").setCheck("string_source").appendField("outStr");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['outStr', ],
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
			this.appendValueInput("received").setCheck("serial_in").appendField("received");
			this.appendValueInput("came").setCheck("serial_in").appendField("came");
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(180);
		},
		name: ans,
		params:[],
		category:'code',
		inputs:['received', 'came', ],
	};
}

function makeAllPrevComps(tab, count) {
	makestring_to_motor(tab, count);
	makepot(tab, count);
	makeserial_to_string(tab, count);
	makenode_mcu(tab, count);
	makepot_driver(tab, count);
	makereverse_string(tab, count);
	makesort_string(tab, count);
	makedriver(tab, count);
	makestring_source(tab, count);
	makeserial_in(tab, count);
}