function createPrevToolbox(tab){
    tab.Toolbox = new Object();
    tab.Toolbox.sequence = {};
    tab.Toolbox.toolboxParser = new DOMParser();
    tab.Toolbox.toolBoxTree = tab.Toolbox.toolboxParser.parseFromString(tab.toolbox, "text/xml");
    tab.Toolbox.xmlTree = tab.Toolbox.toolBoxTree.documentElement;

    tab.Toolbox.updateToolbox = function() {
        tab.workspace.updateToolbox(tab.Toolbox.xmlTree);
    };

    tab.Toolbox.addBlock = function(block, category) {
        var blk = tab.Toolbox.toolboxParser.parseFromString(block, "text/xml").documentElement;
        category.appendChild(blk);
        tab.Toolbox.updateToolbox();
    };

    tab.Toolbox.deleteBlock = function(block, category) {

    };

    tab.Toolbox.deleteCategory = function(category, superCategory) {
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

    tab.Toolbox.blocks = null;

    tab.Toolbox.disableBlock = function(blocks, category) {
        var ch = category.childNodes;
        for (var j = 0; j < ch.length; j++) {
            for (var i = 0; i < blocks.length; i++) {
                if (ch[j].getAttribute("type") == blocks[i]) {
                    ch[j].setAttribute("disabled", "true");
                }
            }
        }
        tab.Toolbox.updateToolbox();
    };

    tab.Toolbox.enableBlock = function(blocks, category) {
        var ch = category.childNodes;
        for (var j = 0; j < ch.length; j++) {
            for (var i = 0; i < blocks.length; i++) {
                if (ch[j].getAttribute("type") == blocks[i]) {
                    ch[j].setAttribute("disabled", "false");
                }
            }
        }
        tab.Toolbox.updateToolbox();
    };

    var toolboxXML = tab.Toolbox.toolBoxTree.documentElement;

    tab.Toolbox.addCategory = function(category, superCategory) {
        var cat = tab.Toolbox.toolboxParser.parseFromString(category, "text/xml").documentElement;
        superCategory.appendChild(cat);
        tab.Toolbox.updateToolbox();
        return cat;
    };

    tab.Toolbox.addEmptyCategory = function(category, superCategory) {
        return tab.Toolbox.addCategory('<category name="' + category + '" colour="180" />', superCategory);
    };

    tab.Toolbox.addEmptyBlock = function(block, category) {
        tab.Toolbox.addBlock('<block type="' + block + '"></block>', category);
    };

    tab.Toolbox.addSeperationBefore = function(element, superElement) {
        var sep = tab.Toolbox.toolboxParser.parseFromString("<sep></sep>", "text/xml").documentElement;
        superElement.insertBefore(sep, element);
        tab.Toolbox.updateToolbox();
    };


    tab.Toolbox.incrementBlock = function(block, count, category) {
        var blk;
        var cat = tab.Toolbox.xmlTree.getElementsByTagName("category");
        var cgy;
        for(var i = 0; i < cat.length; i++){
            if(cat[i].getAttribute("name") == category){
                cgy = cat[i];
            }
        }
        var ls = cgy.getElementsByTagName("block");
        for (var i = 0; i < ls.length; i++) {
            if (ls[i].getAttribute("type") == (block + getActiveTabNum() +"|" + (count))) {
                ls[i].setAttribute("type", block + getActiveTabNum() + "|" + (count + 1));
            }
        }
        tab.Toolbox.updateToolbox();
    }

    tab.Toolbox.addEmptyCategory("Other Blocks", toolboxXML);

    //populate Toolbox with categories
    tab.Toolbox.categories = toolboxXML.getElementsByTagName("category");
    tab.Toolbox.addEmptyBlock("inherit_input", tab.Toolbox.categories[3])
}