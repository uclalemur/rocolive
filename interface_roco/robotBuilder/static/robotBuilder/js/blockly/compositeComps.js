var loc = false;
Blockly.Blocks['component_input'] = {
    // mutator blocks for component
    init: function() {
        this.appendDummyInput()
            .appendField("Input");
        this.setPreviousStatement(true, "");
        this.setNextStatement(true, "");
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.Blocks['component_output'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Output");
        this.setPreviousStatement(true, "");
        this.setNextStatement(true, "");
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.Blocks['component_decompose'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Component");
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};


// TODO: Make code edits persists after changing the blocks.
Blockly.Blocks['component_create'] = {
    /**
     * Block for if/elseif/else condition.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
        this.setColour(180);
        this.setDeletable(false);
        this.appendDummyInput()
            .appendField("Component")
            .appendField(new Blockly.FieldTextInput("name"), "NAME");
        // this.appendStatementInput('CODE')
        //     .appendField("Insert Code Here:");
        this.setMutator(new Blockly.Mutator(['component_output',
            'component_input'
        ]));
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip("Click the cog on the left to add Output Ports and inputs to this Component");
        this.inputCount = 0;
        this.outputCount = 0;
    },
    /**
     * Create XML to represent the number of parameter and output port inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
        if (loc) {
            console.log("in mutationToDom");
        }
        if (!this.inputCount && !this.outputCount) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.inputCount) {
            container.setAttribute('input', this.inputCount);
        }
        if (this.outputCount) {
            container.setAttribute('output', this.outputCount);
        }
        return container;
    },
    /**
     * Parse XML to restore the parameter and outputport inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        if (loc) {
            console.log("in domToMutation");
        }
        this.inputCount = parseInt(xmlElement.getAttribute('input'), 10) || 0;
        this.outputCount = parseInt(xmlElement.getAttribute('output'), 10) || 0;
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        if (loc) {
            console.log("in decompose");
        }
        var containerBlock = workspace.newBlock('component_decompose');
        containerBlock.initSvg();
        var connection = containerBlock.nextConnection;
        for (var i = 1; i <= this.inputCount; i++) {
            var inputBlock = workspace.newBlock('component_input');
            inputBlock.initSvg();
            connection.connect(inputBlock.previousConnection);
            connection = inputBlock.nextConnection;
        }
        if (this.outputCount) {
            var outputBlock = workspace.newBlock('component_output');
            outputBlock.initSvg();
            connection.connect(outputBlock.previousConnection);
            connection = outputBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        if (loc) {
            console.log("in compose");
        }
        var clauseBlock = containerBlock.nextConnection.targetBlock();
        // Count number of inputs.
        this.inputCount = 0;
        this.outputCount = 0;
        var input_name_connections = [null];
        var input_value_connections = [null];
        var output_value_connections = [null];
        var output_name_connections = [null];
        var codeStatementConnection = null;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'component_output':
                    this.outputCount++;
                    output_value_connections.push(clauseBlock.valueConnection_);
                    break;
                case 'component_input':
                    this.inputCount++;
                    input_value_connections.push(clauseBlock.valueConnection_);
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }

        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.inputCount; i++) {
            Blockly.Mutator.reconnect(input_value_connections[i], this, 'INP' + i);
            // Blockly.Mutator.reconnect(input_name_connections[i], this, 'INPUT_NAME' + i);
        }
        //Blockly.Mutator.reconnect(parameter_value_connections[i], this, 'INP' + i);
        for (var i = 0; i < this.outputCount; i++) {
            Blockly.Mutator.reconnect(output_value_connections[i], this, 'OUT' + i);
            // Blockly.Mutator.reconnect(output_name_connections[i], this, 'OUTPUT_NAME' + i);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        if (loc) {
            console.log("in saveConnections");
        }
        var clauseBlock = containerBlock.nextConnection.targetBlock();
        var i = 0;
        var j = 0;
        // var names = [];
        while (clauseBlock) {
            // console.log(clauseBlock);
            switch (clauseBlock.type) {
                case 'component_output':
                    var outInput = this.getInput('OUT' + i);
                    var outNameInput = this.getInput('OUTPUT_NAME' + i);
                    clauseBlock.valueConnection_ = outInput && outInput.connection.targetConnection;
                    i++;
                    break;
                case 'component_input':
                    var paramInput = this.getInput('INP' + j);
                    var paramNameInput = this.getInput('INPUT_NAME' + j);
                    // names.push(paramNameInput);
                    clauseBlock.valueConnection_ = paramInput && paramInput.connection.targetConnection;
                    j++;
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }

    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
        if (loc) {
            console.log("in updateShape_");
        }
        // Delete everything.
        var i = 0;
        while (this.getInput('INP' + i)) {
            this.removeInput('INP' + i);
            this.removeInput('INP_PORT' + i);
            i++;
        }
        this.removeInput("CODE")
        i = 0;
        while (this.getInput('OUT' + i)) {
            this.removeInput('OUT' + i);
            this.removeInput('OUT_PORT' + i);
            i++;
        }
        // Rebuild block.
        for (var i = 0; i < this.inputCount; i++) {
            this.appendValueInput("INP" + i)
                .setCheck(null)
                .appendField("Input Default Value")
                .appendField(new Blockly.FieldTextInput("name"), "INPUT_NAME" + i);
            this.appendValueInput("INP_PORT" + i)
                .setCheck("InputPort")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Input Port Type");
            // .appendField("    Input");

        }
        this.appendStatementInput('CODE')
            .appendField("Insert Code Here:");

        for (var i = 0; i < this.outputCount; i++) {
            this.appendValueInput("OUT" + i)
                .setCheck(null)
                .appendField("Output    ")
                .appendField(new Blockly.FieldTextInput("name"), "OUTPUT_NAME" + i)
                .appendField("    Value");
            this.appendValueInput("OUT_PORT" + i)
                .setCheck("OutputPort")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Output Port Type");
        }
    }
};
