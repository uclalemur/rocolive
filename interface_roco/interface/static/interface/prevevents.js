var outputCount = {};

function onBlockAddedToWorkspace(event) {
    var block = workspace.getBlockById(event.blockId);
    if (block && event.type == Blockly.Events.CREATE && block.type.indexOf("|") > 0 && block.type.indexOf("\\") < 0) {
        var blockName = block.type.substring(0, block.type.indexOf("|"));
        var blockNumber = parseInt(block.type.substring(block.type.indexOf("|") + 1, block.type.length), 10);
        // If the block has outputs
        if (Blockly.Blocks[blockName + "|" + blockNumber + "\\" + 0]){
            //If it doesn't already exist, make a blocks category in the toolbar
            if (!Toolbox.blocks) {
                Toolbox.blocks = Toolbox.addEmptyCategory("blocks", Toolbox.xmlTree);
            }

            //make a category to house the output of the block that was just dragged
            block.cat = Toolbox.addEmptyCategory(blockName + blockNumber, Toolbox.blocks);

            // add all the outputs blocks of the new block on the workspace to the
            // toolbar
            for (var i = 0; Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i]; i++) {
                Toolbox.addEmptyBlock(blockName + "|" + blockNumber + "\\" + i, block.cat);
            }

            //add all the outputs to the counting object, along with a count of 0
            for (var i = 0; Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i]; i++) {
                outputCount[blockName + "|" + blockNumber + "\\" + i] = 0;
            }
        }

        // create a new blockly block
        eval("make" + blockName + "(" + (blockNumber + 1) + ")");

        //create a new blockly output block
        eval("makeOutput" + blockName + "(" + (blockNumber + 1) + ")");

        Toolbox.incrementBlock(blockName, blockNumber, block.category);

    } else if (block && event.type == Blockly.Events.CREATE && block.type.indexOf("\\") > 0) {
        if (outputCount[block.type] == 0) {
            outputCount[block.type] = 1;
            var c;
            var outs = Toolbox.blocks.childNodes;
            for(var i =0; i < outs.length; i++){
                var cat = outs[i].childNodes;
                var cate = outs[i];
                for(var j = 0; j < cat.length; j++){
                    if (cat[j].getAttribute("type") == block.type) {
                        c = cate;
                        break;
                    }
                }
            }
            Toolbox.disableBlock([block.type], c);
        }
    }
}

function onStubAdded(event){
    var block = workspace.getBlockById(event.blockId);
    if(event.type==Blockly.Events.CREATE){
        if(block.type.indexOf("\\") >= 0) {
            if(outputStubs[block.type.substring(0, block.type.indexOf("\\"))]){
                outputStubs[block.type.substring(0, block.type.indexOf("\\"))].push(block.id);
            } else {
                outputStubs[block.type.substring(0, block.type.indexOf("\\"))] = [block.id];
            }
        }
    }
}

function countStubs(){
    outputStubs = {};
    var blocks = workspace.getAllBlocks();
    for(var i = 0; i < blocks.length; i++){
        var block = blocks[i];
        if(block.type.indexOf("\\") >= 0) {
            if(outputStubs[block.type.substring(0, block.type.indexOf("\\"))]){
                outputStubs[block.type.substring(0, block.type.indexOf("\\"))].push(block.id);
            } else {
                outputStubs[block.type.substring(0, block.type.indexOf("\\"))] = [block.id];
            }
        }
    }
}


function onBlockNameChange(event) {
    var block = workspace.getBlockById(event.blockId)

    if (block && event.type == Blockly.Events.CHANGE && block.type!= "component_create" && block.type!= "inherit_input"&& block.type.indexOf("\\") < 0 && event.name == "NAME") {
        if(event.newValue.indexOf("|") >= 0 || event.newValue.indexOf("\\") >= 0){
            alert("Do not include '|' or '\\' in the component names.");
            block.setFieldValue(event.oldValue, "NAME");
            return;
        }


        var blockName = block.type.substring(0, block.type.indexOf("|"));
        var blockNumber = parseInt(block.type.substring(block.type.indexOf("|") + 1, block.type.length), 10);

        // change the name of the category
        if(Blockly.Blocks[blockName + "|" + blockNumber + "\\0"]){
            block.cat.setAttribute("name", event.newValue);
        }

        // change the output blocks, if any exist, to  reflect the name change
        for (var i = 0; Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i]; i++) {
            // var newName = "";
            var newName = event.newValue.toString();
            var outName = Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i].outputName;
            var outType = Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i].outputType;

            Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i] = {};

            Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i].name = newName;
            Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i].outputType = outType;
            Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i].outputName= outName;
            Blockly.Blocks[blockName + "|" + blockNumber + "\\" + i].init = function() {
                this.appendDummyInput("NAME").appendField(this.name + " -> " + this.outputName );
                this.setOutput(true, null);
                this.setColour(180);
            };
        }

        var ids = outputStubs[blockName + "|" + blockNumber];
        if(ids){
            for(var i = 0; i < ids.length; i++){
                var b = workspace.getBlockById(ids[i]);
                var num = parseInt(b.type.substring(b.type.indexOf("\\")+1));
                b.name = Blockly.Blocks[blockName + "|" + blockNumber + "\\" + num].name;
                b.outputType = Blockly.Blocks[blockName + "|" + blockNumber + "\\" + num].outputType;
                b.outputName = Blockly.Blocks[blockName + "|" + blockNumber + "\\" + num].outputName;
                b.init = Blockly.Blocks[blockName + "|" + blockNumber + "\\" + num].init;
                b.removeInput("NAME");
                b.init();
            }
        }


        Toolbox.updateToolbox();
    }
}

function deleteRightBlocks(block, name, tree){
    // if the block is a component block
    if(block.indexOf("\\") < 0 && block.indexOf("|") > 0){
        var blocks = Blockly.getMainWorkspace().getAllBlocks();
        for(var i = 0; i < blocks.length; i++){
            if(blocks[i].type.includes(block)){
                blocks[i].dispose(false);
            }
        }
        for(var i = 1; i < tree.childNodes.length; i++){
            var t = tree.childNodes[i].childNodes[0];
            if(t != ""){
                console.log(t);
                var b = t.getAttribute("type");
                var n;
                if(t.childNodes[0]){
                    n = t.childNodes[0].innerText;
                }
                deleteRightBlocks(b, n, t);
            }

        }
        // nullify current block
        Blockly.Blocks[block]=null;
        delete Blockly.Blocks[block];

        // nullify possible outputs
        for (var i = 0; Blockly.Blocks[block + "\\" + i]; i++) {
            Blockly.Blocks[block + "\\" + i]=null;
            delete Blockly.Blocks[block + "\\" + i];
        }

        // remove category
        if(Toolbox.blocks)
            Toolbox.deleteCategory(name, Toolbox.blocks);

        Toolbox.updateToolbox();

    } else if (block.indexOf('\\')>0) {
        outputCount[block] = 0;
        var c;
        var outs = Toolbox.blocks.childNodes;
        for(var i =0; i < outs.length; i++){
            var cat = outs[i].childNodes;
            var cate = outs[i];
            for(var j = 0; j < cat.length; j++){
                if (cat[j].getAttribute("type") == block) {
                    c = cate;
                    break;
                }
            }
        }
        Toolbox.enableBlock([block], c);
    }
}

function onComponentDelete(event){
    if (event.type == Blockly.Events.DELETE) {
        var tree = event.oldXml;
        var block = tree.getAttribute('type');
        var name;
        if(tree.childNodes[0]){
            name = tree.childNodes[0].innerText;
        }

        deleteRightBlocks(block, name, tree);
    }
}

Blockly.Blocks['component_parameter'] = {
    // mutator blocks for component
    init: function() {
        this.appendDummyInput()
            .appendField("Parameter");
        this.setPreviousStatement(true, "");
        this.setNextStatement(true, "");
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

function onStubDeleted(event) {
    if (event.type == Blockly.Events.DELETE) {
        countStubs();
    }
}

workspace.addChangeListener(onBlockAddedToWorkspace);
workspace.addChangeListener(onStubDeleted);
workspace.addChangeListener(onStubAdded);
workspace.addChangeListener(onBlockNameChange);
workspace.addChangeListener(onComponentDelete);
