var loc = false;

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

Blockly.Blocks['inherit_input'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Inherit Input")
            .appendField(new Blockly.FieldTextInput("name"), "NAME");
        this.setOutput(true, null);
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
            .appendField(new Blockly.FieldTextInput("name"), "NAME")
        this.appendStatementInput('CODE')
            .appendField("Insert Components Here:");;
        // this.appendStatementInput('CODE')
        //     .appendField("Insert Code Here:");
        this.setMutator(new Blockly.Mutator(['component_output',
        ]));
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip("Click the cog on the left to add Output Ports and inputs to this Component");
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
        if (!this.outputCount) {
            return null;
        }
        var container = document.createElement('mutation');
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
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }

        this.updateShape_();

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
        while (this.getInput('OUT' + i)) {
            this.removeInput('OUT' + i);
            i++;
        }

        for (var i = 0; i < this.outputCount; i++) {
            this.appendValueInput("OUT" + i)
                .setCheck(null)
                .appendField("Output    ")
                .appendField(new Blockly.FieldTextInput("name"), "OUTPUT_NAME" + i);
        }
    }
};
