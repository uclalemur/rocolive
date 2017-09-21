function onStubAdded(event){
    var block = workspace.getBlockById(event.blockId);
    if(event.type==Blockly.Events.CREATE){
        if(block.type.indexOf("input") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("input") + 5)))) {
            if(inputStubs[block.type]){
                inputStubs[block.type].push(block.id);
            } else {
                inputStubs[block.type] = [block.id];
            }
        } else if (block.type.indexOf("parameter") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("parameter") + 9)))) {
            if(paramStubs[block.type]){
                paramStubs[block.type].push(block.id);
            } else {
                paramStubs[block.type] = [block.id];
            }
        }
    }
}

function countStubs(){
    inputStubs = {};
    paramStubs = {};
    var blocks = workspace.getAllBlocks();
    for(var i = 0; i < blocks.length; i++){
        var block = blocks[i];
        if(block.type.indexOf("input") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("input") + 5)))) {
            if(inputStubs[block.type]){
                inputStubs[block.type].push(block.id);
            } else {
                inputStubs[block.type] = [block.id];
            }
        } else if (block.type.indexOf("parameter") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("parameter") + 9)))) {
            if(paramStubs[block.type]){
                paramStubs[block.type].push(block.id);
            } else {
                paramStubs[block.type] = [block.id];
            }
        }
    }
}

function onParameterNameChange(event) {
    var block = workspace.getBlockById(event.blockId)
    if (block && block.type == 'component_create' && event.type == Blockly.Events.CHANGE && event.element == 'field') {
        if(event.name.substring(0, 3) == "INP") {
            Blockly.Blocks['input' + event.name.substring(10)] = {
                // mutator blocks for component
                init: function() {
                    this.appendDummyInput("NAME")
                        .appendField("Input " + event.newValue);
                    this.setOutput(true, null);
                    this.setColour(180);
                    this.setTooltip('');
                    this.setHelpUrl('http://www.example.com/');
                }
            };
            Blockly.Arduino['input' + event.name.substring(10)] = function(){
                this.codeName = event.newValue.trim();
                return ["<<"+event.newValue.trim()+mangler+">>", Blockly.Arduino.ORDER_ATOMIC];
            }
            Blockly.Python['input' + event.name.substring(10)] = function(){
                this.codeName = event.newValue.trim();
                return ["<<"+event.newValue.trim()+mangler+">>", Blockly.Python.ORDER_ATOMIC];
            }
            for(var key in inputStubs){
                if(inputStubs.hasOwnProperty(key)){
                    var ids = inputStubs[key];
                    for(var i = 0; i < ids.length; i++){
                        var b = workspace.getBlockById(ids[i]);
                        b.init = Blockly.Blocks['input' + event.name.substring(10)].init;
                        b.removeInput("NAME");
                        b.init();
                    }
                }
            }
        } else if (event.name.substring(0, 8) == "PAR_NAME"){
            Blockly.Blocks['parameter' + event.name.substring(8)] = {
                // mutator blocks for component
                init: function() {
                    this.appendDummyInput("NAME")
                        .appendField("Parameter " + event.newValue);
                    this.setOutput(true, null);
                    this.setColour(180);
                    this.setTooltip('');
                    this.setHelpUrl('http://www.example.com/');
                }
            };
            Blockly.Arduino['parameter' + event.name.substring(8)] = function(){
                this.codeName = event.newValue.trim();
                return ["<<"+event.newValue.trim()+mangler+">>", Blockly.Arduino.ORDER_ATOMIC];
            }
            Blockly.Python['parameter' + event.name.substring(8)] = function(){
                this.codeName = event.newValue.trim();
                return ["<<"+event.newValue.trim()+mangler+">>", Blockly.Python.ORDER_ATOMIC];
            }
            var blocks = workspace.getAllBlocks();
            for(var key in paramStubs){
                if(paramStubs.hasOwnProperty(key)){
                    var ids = paramStubs[key];
                    for(var i = 0; i < ids.length; i++){
                        var b = workspace.getBlockById(ids[i]);
                        b.init = Blockly.Blocks['parameter' + event.name.substring(8)].init;
                        b.removeInput("NAME");
                        b.init();
                    }
                }
            }
        }
    }
}

// whenever a new input or parameter block is added to component_create through its mutator,
// add a corresponding input block in the componnents category in the toolbar.
function onComponentModify(event) {
    var block = workspace.getBlockById(event.blockId)
    if (block && block.type == 'component_create' && event.type == Blockly.Events.CHANGE && event.element == 'mutation') {

        // Delete all input blocks
        for (var i = 0; Blockly.Blocks["input" + i]; i++) {
            Blockly.Blocks["input" + i] = null;
            delete Blockly.Blocks["input" + i];

            Toolbox.deleteBlock("input" + i, Toolbox.componentCategory);
        }
        for (var i = 0; Blockly.Blocks["parameter" + i]; i++) {
            Blockly.Blocks["parameter" + i] = null;
            delete Blockly.Blocks["parameter" + i];

            Toolbox.deleteBlock("parameter" + i, Toolbox.componentCategory);
        }

        var clauseBlock = rootBlock.nextConnection.targetBlock();
        var inputCount = 0;
        var parameterCount = 0;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'component_input':
                    // add input block to toolbox
                    if (!Blockly.Blocks['input' + inputCount]) {
                        Toolbox.addBlock('<block type="' + 'input' + inputCount + '"></block>', Toolbox.componentCategory);
                        workspace.updateToolbox(Toolbox.xmlTree);
                    }

                    // create input block definition
                    Blockly.Blocks['input' + inputCount] = {
                        // mutator blocks for component
                        init: function() {
                            this.appendDummyInput("NAME")
                                .appendField("Input " + this.mut_name);
                            this.setOutput(true, null);
                            this.setColour(180);
                            this.setTooltip('');
                            this.setHelpUrl('http://www.example.com/');
                        }
                    };
                    Blockly.Blocks['input' + inputCount].mut_name = clauseBlock.name;
                    Blockly.Arduino['input' + inputCount] = function(){
                        this.codeName = this.mut_name + inputCount;
                        return ["<<" + this.mut_name +mangler+">>" + inputCount, Blockly.Arduino.ORDER_ATOMIC];
                    }
                    Blockly.Python['input' + inputCount] = function(){
                        this.codeName = this.mut_name + inputCount;
                        return ["<<" + this.mut_name +mangler+">>" + inputCount, Blockly.Python.ORDER_ATOMIC];
                    }
                    inputCount++;
                    break;
                case 'component_parameter':
                    // add input block to toolbox
                    if (!Blockly.Blocks['parameter' + parameterCount]) {
                        Toolbox.addBlock('<block type="' + 'parameter' + parameterCount + '"></block>', Toolbox.componentCategory);
                        workspace.updateToolbox(Toolbox.xmlTree);
                    }

                    // create parameter block definition
                    Blockly.Blocks['parameter' + parameterCount] = {
                        // mutator blocks for component
                        init: function() {
                            this.appendDummyInput("NAME")
                                .appendField("Parameter " + this.mut_name);
                            this.setOutput(true, null);
                            this.setColour(180);
                            this.setTooltip('');
                            this.setHelpUrl('http://www.example.com/');
                        }
                    };
                    Blockly.Blocks['parameter' + parameterCount].mut_name = clauseBlock.name;
                    Blockly.Arduino['parameter' + parameterCount] = function(){
                        this.codeName = this.mut_name + parameterCount;
                        return ["<<" + this.mut_name + mangler+">>" + parameterCount, Blockly.Arduino.ORDER_ATOMIC];
                    }
                    Blockly.Python['parameter' + parameterCount] = function(){
                        this.codeName = this.mut_name + parameterCount;
                        return ["<<" + this.mut_name + mangler+">>" + parameterCount, Blockly.Python.ORDER_ATOMIC];
                    }
                    parameterCount++;
                    break;
                default:
                    break;
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
        Toolbox.updateToolbox();
    }
}

function onInputOutputDelete(event) {
    if (event.type == Blockly.Events.DELETE) {
        var tree = event.oldXml;

        var block = tree.getAttribute('type');
        if (tree.childNodes[0])
            var name = tree.childNodes[0].innerText;
    }
}

function onStubDeleted(event) {
    if (event.type == Blockly.Events.DELETE) {
        countStubs();
    }
}

workspace.addChangeListener(onInputOutputDelete);
workspace.addChangeListener(onStubAdded);
workspace.addChangeListener(onStubDeleted);
workspace.addChangeListener(onParameterNameChange);
workspace.addChangeListener(onComponentModify);
