// Inputs
Blockly.Blocks['InPort|input'] = {
	 init: function(){
	this.appendDummyInput().appendField("InPort");
	this.setOutput(true, "InputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['InStringPort|input'] = {
	 init: function(){
	this.appendDummyInput().appendField("InStringPort");
	this.setOutput(true, "InputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['InIntPort|input'] = {
	 init: function(){
	this.appendDummyInput().appendField("InIntPort");
	this.setOutput(true, "InputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['InFloatPort|input'] = {
	 init: function(){
	this.appendDummyInput().appendField("InFloatPort");
	this.setOutput(true, "InputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['InDoublePort|input'] = {
	 init: function(){
	this.appendDummyInput().appendField("InDoublePort");
	this.setOutput(true, "InputPort");
	this.setColour(105);
	}
};

//Outputs
Blockly.Blocks['OutPort|output'] = {
	 init: function(){
	this.appendDummyInput().appendField("OutPort");
	this.setOutput(true, "OutputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['OutStringPort|output'] = {
	 init: function(){
	this.appendDummyInput().appendField("OutStringPort");
	this.setOutput(true, "OutputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['OutIntPort|output'] = {
	 init: function(){
	this.appendDummyInput().appendField("OutIntPort");
	this.setOutput(true, "OutputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['OutFloatPort|output'] = {
	 init: function(){
	this.appendDummyInput().appendField("OutFloatPort");
	this.setOutput(true, "OutputPort");
	this.setColour(105);
	}
};

Blockly.Blocks['OutDoublePort|output'] = {
	 init: function(){
	this.appendDummyInput().appendField("OutDoublePort");
	this.setOutput(true, "OutputPort");
	this.setColour(105);
	}
};

//Other
