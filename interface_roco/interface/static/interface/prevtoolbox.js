var Toolbox = new Object();
Toolbox.sequence = {};
Toolbox.toolboxParser = new DOMParser();
Toolbox.toolBoxTree = Toolbox.toolboxParser.parseFromString(toolbox, "text/xml");
Toolbox.xmlTree = Toolbox.toolBoxTree.documentElement;

Toolbox.updateToolbox = function() {
    workspace.updateToolbox(Toolbox.xmlTree);
};

Toolbox.addBlock = function(block, category) {
    var blk = Toolbox.toolboxParser.parseFromString(block, "text/xml").documentElement;
    category.appendChild(blk);
    Toolbox.updateToolbox();
};

Toolbox.deleteBlock = function(block, category) {

};

Toolbox.deleteCategory = function(category, superCategory) {
    if(superCategory == null){
        console.log("not deleted");
        return
    }
    var ch = superCategory.childNodes;
    for (var j = 0; j < ch.length; j++) {
        if (ch[j].getAttribute("name") == category) {
            superCategory.removeChild(ch[j]);
        }
    }
}

Toolbox.blocks = null;

Toolbox.disableBlock = function(blocks, category) {
    var ch = category.childNodes;
    for (var j = 0; j < ch.length; j++) {
        for (var i = 0; i < blocks.length; i++) {
            if (ch[j].getAttribute("type") == blocks[i]) {
                ch[j].setAttribute("disabled", "true");
            }
        }
    }
    Toolbox.updateToolbox();
};

Toolbox.enableBlock = function(blocks, category) {
    var ch = category.childNodes;
    for (var j = 0; j < ch.length; j++) {
        for (var i = 0; i < blocks.length; i++) {
            if (ch[j].getAttribute("type") == blocks[i]) {
                ch[j].setAttribute("disabled", "false");
            }
        }
    }
    Toolbox.updateToolbox();
};

var toolboxXML = Toolbox.toolBoxTree.documentElement;

Toolbox.addCategory = function(category, superCategory) {
    var cat = Toolbox.toolboxParser.parseFromString(category, "text/xml").documentElement;
    superCategory.appendChild(cat);
    Toolbox.updateToolbox();
    return cat;
};

Toolbox.addEmptyCategory = function(category, superCategory) {
    return Toolbox.addCategory('<category name="' + category + '" colour="180" />', superCategory);
};

Toolbox.addEmptyBlock = function(block, category) {
    Toolbox.addBlock('<block type="' + block + '"></block>', category)
};

Toolbox.addSeperationBefore = function(element, superElement) {
    var sep = Toolbox.toolboxParser.parseFromString("<sep></sep>", "text/xml").documentElement;
    superElement.insertBefore(sep, element);
    Toolbox.updateToolbox();
};


Toolbox.incrementBlock = function(block, count, category) {
    var blk;
    var cat = Toolbox.xmlTree.getElementsByTagName("category");
    var cgy;
    for(var i = 0; i < cat.length; i++){
        if(cat[i].getAttribute("name") == category){
            cgy = cat[i];
        }
    }
    var ls = cgy.getElementsByTagName("block");
    for (var i = 0; i < ls.length; i++) {
        if (ls[i].getAttribute("type") == (block + "|" + (count))) {
            ls[i].setAttribute("type", block + "|" + (count + 1));
        }
    }
    Toolbox.updateToolbox();
}

Toolbox.addEmptyCategory("Other Blocks", toolboxXML);

//populate Toolbox with categories
Toolbox.categories = toolboxXML.getElementsByTagName("category");
Toolbox.addEmptyBlock("inherit_input", Toolbox.categories[3])
