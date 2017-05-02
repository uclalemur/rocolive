var toolbox = '<xml />';
var workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});
Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), workspace);
