function createIndexEvents(tab){
    tab.onStubAdded = function(event){
        var block = tab.workspace.getBlockById(event.blockId);
        if(event.type==Blockly.Events.CREATE){
            if(block.type.indexOf("input") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("input") + 5)))) {
                if(tab.inputStubs[block.type]){
                    tab.inputStubs[block.type].push(block.id);
                } else {
                    tab.inputStubs[block.type] = [block.id];
                }
            } else if (block.type.indexOf("parameter") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("parameter") + 9)))) {
                if(tab.paramStubs[block.type]){
                    tab.paramStubs[block.type].push(block.id);
                } else {
                    tab.paramStubs[block.type] = [block.id];
                }
            }
        }
    }

    tab.countStubs = function(){
        tab.inputStubs = {};
        tab.paramStubs = {};
        var blocks = tab.workspace.getAllBlocks();
        for(var i = 0; i < blocks.length; i++){
            var block = blocks[i];
            if(block.type.indexOf("input") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("input") + 5)))) {
                if(tab.inputStubs[block.type]){
                    tab.inputStubs[block.type].push(block.id);
                } else {
                    tab.inputStubs[block.type] = [block.id];
                }
            } else if (block.type.indexOf("parameter") >= 0 && !isNaN(parseInt(block.type.substring(block.type.indexOf("parameter") + 9)))) {
                if(tab.paramStubs[block.type]){
                    tab.paramStubs[block.type].push(block.id);
                } else {
                    tab.paramStubs[block.type] = [block.id];
                }
            }
        }
    }

    tab.onParameterNameChange = function(event) {
        var block = tab.workspace.getBlockById(event.blockId);
        if (block && block.type == 'component_create' && event.type == Blockly.Events.CHANGE && event.element == 'field') {
            if(event.name.substring(0, 3) == "INP") {
                Blockly.Blocks['input' + getActiveTabNum() + event.name.substring(10)] = {
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
                Blockly.Arduino['input' +  getActiveTabNum() + event.name.substring(10)] = function(){
                    this.codeName = event.newValue.trim();
                    return ["<<"+event.newValue.trim()+getActiveTab().mangler+">>", Blockly.Arduino.ORDER_ATOMIC];
                }
                Blockly.Python['input' +  getActiveTabNum() + event.name.substring(10)] = function(){
                    this.codeName = event.newValue.trim();
                    return ["<<"+event.newValue.trim()+getActiveTab().mangler+">>", Blockly.Python.ORDER_ATOMIC];
                }
                for(var key in tab.inputStubs){
                    if(tab.inputStubs.hasOwnProperty(key)){
                        var ids = tab.inputStubs[key];
                        for(var i = 0; i < ids.length; i++){
                            var b = tab.workspace.getBlockById(ids[i]);
                            b.init = Blockly.Blocks['input' +  getActiveTabNum() + event.name.substring(10)].init;
                            b.removeInput("NAME");
                            b.init();
                        }
                    }
                }
            } else if (event.name.substring(0, 8) == "PAR_NAME"){
                Blockly.Blocks['parameter' +  getActiveTabNum() + event.name.substring(8)] = {
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
                Blockly.Arduino['parameter' + getActiveTabNum() + event.name.substring(8)] = function(){
                    this.codeName = event.newValue.trim();
                    return ["<<"+event.newValue.trim()+getActiveTab().mangler+">>", Blockly.Arduino.ORDER_ATOMIC];
                }
                Blockly.Python['parameter' + getActiveTabNum() + event.name.substring(8)] = function(){
                    this.codeName = event.newValue.trim();
                    return ["<<"+event.newValue.trim()+getActiveTab().mangler+">>", Blockly.Python.ORDER_ATOMIC];
                }
                var blocks = tab.workspace.getAllBlocks();
                for(var key in tab.paramStubs){
                    if(tab.paramStubs.hasOwnProperty(key)){
                        var ids = tab.paramStubs[key];
                        for(var i = 0; i < ids.length; i++){
                            var b = tab.workspace.getBlockById(ids[i]);
                            b.init = Blockly.Blocks['parameter' + getActiveTabNum() + event.name.substring(8)].init;
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
    tab.onComponentModify = function(event) {
        var block = tab.workspace.getBlockById(event.blockId)
        if (block && block.type == 'component_create' && event.type == Blockly.Events.CHANGE && event.element == 'mutation') {

            // Delete all input stubs
            for (var i = 0; Blockly.Blocks["input" + getActiveTabNum() + i]; i++) {
                Blockly.Blocks["input" + getActiveTabNum() + i] = null;
                delete Blockly.Blocks["input" + getActiveTabNum() + i];

                tab.Toolbox.deleteBlock("input" + getActiveTabNum() + i, tab.Toolbox.componentCategory);
            }
            //Delete all parameter stubs
            for (var i = 0; Blockly.Blocks["parameter" + i]; i++) {
                Blockly.Blocks["parameter" + getActiveTabNum() + i] = null;
                delete Blockly.Blocks["parameter" + getActiveTabNum() + i];

                tab.Toolbox.deleteBlock("parameter" + getActiveTabNum() + i, tab.Toolbox.componentCategory);
            }

            var clauseBlock = tab.rootBlock.nextConnection.targetBlock();
            var inputCount = 0;
            var parameterCount = 0;
            while (clauseBlock) {
                switch (clauseBlock.type) {
                    case 'component_input':
                        // add input block to toolbox
                        if (!Blockly.Blocks['input' + getActiveTabNum() + inputCount]) {
                            tab.Toolbox.addBlock('<block type="' + 'input' + getActiveTabNum() + inputCount + '"></block>', tab.Toolbox.componentCategory);
                            tab.workspace.updateToolbox(tab.Toolbox.xmlTree);
                        }

                        // create input block definition
                        Blockly.Blocks['input' + getActiveTabNum() + inputCount] = {
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
                        Blockly.Blocks['input' + getActiveTabNum() + inputCount].mut_name = clauseBlock.name;
                        Blockly.Arduino['input' + getActiveTabNum() + inputCount] = function(){
                            this.codeName = this.mut_name + getActiveTabNum() + inputCount;
                            return ["<<" + this.mut_name +getActiveTab().mangler+">>" + getActiveTabNum() + inputCount, Blockly.Arduino.ORDER_ATOMIC];
                        }
                        Blockly.Python['input' + getActiveTabNum() + inputCount] = function(){
                            this.codeName = this.mut_name + getActiveTabNum() + inputCount;
                            return ["<<" + this.mut_name +getActiveTab().mangler+">>" + getActiveTabNum() + inputCount, Blockly.Python.ORDER_ATOMIC];
                        }
                        inputCount++;
                        break;
                    case 'component_parameter':
                        // add input block to toolbox
                        if (!Blockly.Blocks['parameter' + getActiveTabNum() + parameterCount]) {
                            tab.Toolbox.addBlock('<block type="' + 'parameter' + getActiveTabNum() + parameterCount + '"></block>', tab.Toolbox.componentCategory);
                            tab.workspace.updateToolbox(tab.Toolbox.xmlTree);
                        }

                        // create parameter block definition
                        Blockly.Blocks['parameter' + getActiveTabNum() + parameterCount] = {
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
                        Blockly.Blocks['parameter' + getActiveTabNum() + parameterCount].mut_name = clauseBlock.name;
                        Blockly.Arduino['parameter' + getActiveTabNum() + parameterCount] = function(){
                            this.codeName = this.mut_name + getActiveTabNum() + parameterCount;
                            return ["<<" + this.mut_name + getActiveTab().mangler+">>" + getActiveTabNum() + parameterCount, Blockly.Arduino.ORDER_ATOMIC];
                        }
                        Blockly.Python['parameter' + getActiveTabNum() + parameterCount] = function(){
                            this.codeName = this.mut_name + getActiveTabNum() + parameterCount;
                            return ["<<" + this.mut_name + getActiveTab().mangler+">>" + getActiveTabNum() + parameterCount, Blockly.Python.ORDER_ATOMIC];
                        }
                        parameterCount++;
                        break;
                    default:
                        break;
                }
                clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
            }
            tab.Toolbox.updateToolbox();
        }
    }

    tab.onInputOutputDelete = function(event) {
        if (event.type == Blockly.Events.DELETE) {
            var tree = event.oldXml;

            var block = tree.getAttribute('type');
            if (tree.childNodes[0])
                var name = tree.childNodes[0].innerText;
        }
    }

    tab.onStubDeleted = function(event) {
        if (event.type == Blockly.Events.DELETE) {
            tab.countStubs();
        }
    }
}

function addIndexEvents(tab){
    tab.workspace.addChangeListener(tab.onInputOutputDelete);
    tab.workspace.addChangeListener(tab.onStubAdded);
    tab.workspace.addChangeListener(tab.onStubDeleted);
    tab.workspace.addChangeListener(tab.onParameterNameChange);
    tab.workspace.addChangeListener(tab.onComponentModify);
}