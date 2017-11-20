import sys
import os
import xml.etree.ElementTree as ET


class CustomBlockFile:

    def __init__(self, relBlockPath="blocks.js", relInitPath="init.js", portsIndexPath="indexPortsBlocks.js", portsXMLPath="indexPortsXML.js", portCodeGenPath="portCodeGen.js", prevCompCodePath="prevCompCode.js"):
        self.path = os.path.join(os.getcwd(), "robotBuilder/static/robotBuilder/js/")

        self.blpath = os.path.join(self.path, relBlockPath)
        self.blockFile = open(self.blpath, 'wb', 0)

        self.inpath = os.path.join(self.path, relInitPath)
        self.initFile = open(self.inpath, 'wb', 0)

        self.portPath = os.path.join(self.path, portsIndexPath)
        self.portFile = open(self.portPath, 'wb', 0)

        self.xmlPath = os.path.join(self.path, portsXMLPath)
        self.xmlFile = open(self.xmlPath, 'wb', 0)

        self.pcgPath = os.path.join(self.path, portCodeGenPath)
        self.pcgFile = open(self.pcgPath, 'wb', 0)

        self.pccPath = os.path.join(self.path, prevCompCodePath)
        self.pccFile = open(self.pccPath, 'wb', 0)

        self.tree = ET.fromstring("<xml></xml>")

        self.componentsWithOutputs = []
        self.componentsWithoutOutputs = []

        self.componentCodeWithOutputs = []
        self.componentCodeWithoutOutputs = []


    def getCategoryName(self, comp):
        category = ""
        for sable in comp.composables:
            category += (sable + ", ")
        category = category[:-2]
        return category

    def write(self, text):
        self.blockFile.write(text)

    # init.js
    def head(self):
        self.initFile.write("var toolbox = '<xml>';\n")

    def writeInit(self, comps, ports):
        categories = {}
        for comp in comps:
            port = ports[comp.get_name()]
            suffix = "'+tab+'|0"
            # if "out" in port.keys():
            #     suffix = "|0"
            category = self.getCategoryName(comp)
            if category not in categories:
                c = ET.SubElement(self.tree, "category", {
                    "name": category, "colour": "180"})
                categories[category] = c
                # print ET.dump(self.tree)

            ET.SubElement(categories[category], "block", {
                          "type": (comp.get_name() + suffix)})
            # print ET.dump(self.tree)
        self.initFile.write("function getToolbox(t, tab){\n")
        self.initFile.write("\tt.toolbox = '" + ET.tostring(self.tree) + "';\n")
        self.initFile.write("}\n")
        # self.initFile.write("var workspace = Blockly.inject('{}', {{toolbox: toolbox}});\n".format("blocklyDiv"))
        # self.initFile.write("Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), workspace);\n")
        self.blockFile.write("var BlockList = new Map();\n\n")

    def writeStringSourceInit(self):
        self.initFile.write(
            "toolbox += '  <block type=\"StringSource\"></block>';\n")

    def writeStringConcatenateInit(self):
        self.initFile.write(
            "toolbox += '  <block type=\"ConcatenateString\"></block>';\n")

    def tail(self, blocklyDiv="blocklyDiv"):
        self.initFile.write("toolbox += '</xml>';\n")
        # self.initFile.write("toolbox += '</category>';\n")
        self.initFile.write(
            "var workspace = Blockly.inject('{}', {{toolbox: toolbox}});\n".format(blocklyDiv))

    # blocks.js
    def writeComponent(self, comp, ports):
        # import pdb; pdb.set_trace()
        name = comp.get_name()

        if "out" in ports.keys():
            self.componentsWithOutputs.append(name)
        else:
            self.componentsWithoutOutputs.append(name)

        self.blockFile.write("//{}\n".format(name))
        self.blockFile.write('function make{}(tab, count, name){{\n'.format(name))
        self.blockFile.write('\tvar ans = name;\n\tif (name === undefined){{\n\t\tans=\"{}\"+(count);\n\t}}\n'.format(name))
        self.blockFile.write("\tBlockly.Blocks['{}' + tab + '|' + count] = {{\n".format(name))
        self.blockFile.write("\t\tinit: function(){\n")
        self.blockFile.write("\t\t\tthis.appendDummyInput().appendField(\"{} \").appendField(new Blockly.FieldTextInput(ans), \"NAME\");\n".format(name))
        self.blockFile.write("\t\t\tfor(var i = 0; i < this.params.length; i++){\n")
        self.blockFile.write("\t\t\t\tthis.appendDummyInput().appendField(\"Parameter \" + this.params[i][0]).appendField(new Blockly.FieldTextInput(this.params[i][1]), \"PARAM\" + i);\n")
        self.blockFile.write("\t\t\t}\n")

        compInputs = [] 
        if 'in' in ports.keys():
            for k, v in ports['in'].iteritems():
                self.blockFile.write(
                    "\t\t\tthis.appendValueInput(\"{}\").setCheck(\"{}\").appendField(\"{}\");\n".format(k, name, k))
                compInputs.append(k)

        self.blockFile.write(
            "\t\t\tthis.setPreviousStatement(true, null);\n\t\t\tthis.setNextStatement(true, null);\n")

        self.blockFile.write("\t\t\tthis.setColour(180);\n")
        self.blockFile.write("\t\t},\n")
        self.blockFile.write("\t\tname: ans,\n")
        paramArr = "["

        # import pdb; pdb.set_trace()
        for k, v in comp.parameters.iteritems():
            a = str(v)
            if v == "":
                a = "\"\""
            elif a == "0":
                a = "\"0\""
            elif not a.isdigit():
                a = "\"" + a + "\""
            if "target" not in k:
                paramArr += "[\"{}\", {}], ".format(k, a)
        paramArr += "]"

        if "electrical" in comp.composables:
            self.blockFile.write("\t\tparams:[],\n")
        else:
            self.blockFile.write("\t\tparams:{},\n".format(paramArr))

        self.blockFile.write("\t\tcategory:'{}',\n".format(
            self.getCategoryName(comp)))

        self.blockFile.write("\t\tinputs:[")
        for i in compInputs:
            self.blockFile.write("'{}', ".format(i))
        self.blockFile.write("],\n")

        if "out" in ports.keys():
            self.blockFile.write("\t\toutputs:[")
            for k, v in ports['out'].iteritems():
                self.blockFile.write("'{}', ".format(k))
            self.blockFile.write("],\n")

        self.blockFile.write("\t};\n")

        if "out" in ports.keys():
            count = 0
            for k, v in ports['out'].iteritems():
                self.writeComponentOutputs(name, k, v, count)
                count += 1

        self.blockFile.write("}\n\n")

    def writeComponentOutputs(self, componentName, name, valueType, count):
        self.blockFile.write("\n\t//{}- {}\n".format(name, componentName))
        self.blockFile.write(
            "\tBlockly.Blocks['{}' + tab + '|' + {} + '\\\\{}'] = {{\n".format(componentName, "count",  str(count)))
        self.blockFile.write("\t\tinit: function(){\n")
        self.blockFile.write(
            "\t\t\tthis.appendDummyInput(\"NAME\").appendField(ans + \"{}\");\n".format("->" + name))
        self.blockFile.write(
            "\t\t\tthis.setOutput(true, {});\n".format("null"))
        self.blockFile.write("\t\t\tthis.setColour(180);\n")
        self.blockFile.write("\t\t},\n")
        self.blockFile.write("\t\toutputType:'{}',\n".format(componentName))
        self.blockFile.write("\t\toutputName:'{}',\n".format(name))
        self.blockFile.write("\t\tname:'{}',\n".format(componentName))
        self.blockFile.write("\t};\n")

    # Use writeComponent, this one is deprecated
    def writeComponentOLD(self, name, ports):
        if "out" in ports.keys():
            self.writeComponentWithOutput(name, ports)
            self.componentsWithOutputs.append(name)
        else:
            self.blockFile.write("//{}\n".format(name))
            self.blockFile.write(
                "Blockly.Blocks['{}|0'] = {{\n".format(name))
            self.blockFile.write("\t init: function(){\n")
            self.blockFile.write(
                "\t\tthis.appendDummyInput().appendField(\"{}\").appendField(new Blockly.FieldTextInput(\"Block Name\"), \"NAME\");\n".format(name))
            if 'in' in ports.keys():
                for k, v in ports['in'].iteritems():
                    self.blockFile.write(
                        "\t\tthis.appendValueInput(\"{}\").setCheck(\"{}\").appendField(\"{}\");\n".format(k, v, k))

            self.blockFile.write(
                "\t\tthis.setPreviousStatement(true, null);\n\t\tthis.setNextStatement(true, null);\n")

            self.blockFile.write("\t\tthis.setColour(180);\n")
            self.blockFile.write("\t}\n")
            self.blockFile.write("};\n\n")

    def finishComponents(self):
        self.blockFile.write("function makeAllPrevComps(tab, count) {\n")
        for comp in self.componentsWithOutputs:
            self.blockFile.write("\tmake" + comp + "(tab, count);\n")
        for comp in self.componentsWithoutOutputs:
            self.blockFile.write("\tmake" + comp + "(tab, count);\n")
        self.blockFile.write("}")

        # for comp in self.componentsWithOutputs:
        #     self.blockFile.write("make" + comp + "(0);\n")
        # for comp in self.componentsWithoutOutputs:
        #     self.blockFile.write("make" + comp + "(0);\n")


    # indexPortsBlocks.js
    def writePorts(self, ports):
        self.portFile.write("// Inputs\n")
        for port in ports["input"]:
            self.portFile.write(
                "Blockly.Blocks['{}|input'] = {{\n".format(port))
            self.portFile.write("\t init: function(){\n")
            self.portFile.write(
                "\tthis.appendDummyInput().appendField(\"{}\");\n".format(port))
            self.portFile.write("\tthis.setOutput(true, \"InputPort\");\n")
            self.portFile.write("\tthis.setColour(105);\n")
            self.portFile.write("\t}\n")
            self.portFile.write("};\n\n")

        self.portFile.write("//Outputs\n")
        for port in ports["output"]:
            self.portFile.write(
                "Blockly.Blocks['{}|output'] = {{\n".format(port))
            self.portFile.write("\t init: function(){\n")
            self.portFile.write(
                "\tthis.appendDummyInput().appendField(\"{}\");\n".format(port))
            self.portFile.write("\tthis.setOutput(true, \"OutputPort\");\n")
            self.portFile.write("\tthis.setColour(105);\n")
            self.portFile.write("\t}\n")
            self.portFile.write("};\n\n")

        self.portFile.write("//Other\n")
        for port in ports["other"]:
            self.portFile.write(
                "Blockly.Blocks['{}|other'] = {{\n".format(port))
            self.portFile.write("\t init: function(){\n")
            self.portFile.write(
                "\tthis.appendDummyInput().appendField(\"{}\");\n".format(port))
            self.portFile.write("\tthis.setOutput(true, \"OtherPort\");\n")
            self.portFile.write("\tthis.setColour(105);\n")
            self.portFile.write("\t}\n")
            self.portFile.write("};\n\n")

    def writeXML(self, ports):
        self.xmlFile.write("function addPorts(tab) {\n")
        self.xmlFile.write(
            "\tvar ports = tab.Toolbox.addCategory('<category name=\"Ports\" colour=\"105\"></category>', tab.toolboxXML);\n")
        for kind in ports.keys():
            if len(ports[kind]) > 0:
                self.xmlFile.write(
                    "\ttab.Toolbox.{}Category = tab.Toolbox.addCategory('<category name=\"{}\" colour=\"105\"></category>', ports);\n".format(kind, kind))
        for kind, port, in ports.iteritems():
            for p in port:
                self.xmlFile.write(
                    "\ttab.Toolbox.addBlock('<block type=\"{}\"></block>', tab.Toolbox.{}Category);\n".format(p + "|" + kind,  kind))
            self.xmlFile.write("\n")
        self.xmlFile.write("}")

    def writePortCodeGen(self, ports):
        self.pcgFile.write("//Arduino\n")
        for kind, port in ports.iteritems():
            for p in port:
                self.pcgFile.write("//{}\n".format(p))
                self.pcgFile.write(
                    "Blockly.Arduino[\"{}|{}\"] = function(){{\n".format(p, kind))
                self.pcgFile.write(
                    "\treturn [\"{}\", Blockly.Arduino.ORDER_ATOMIC];\n".format(p))
                self.pcgFile.write("}\n\n")

        self.pcgFile.write("\n//Python\n")
        for kind, port in ports.iteritems():
            for p in port:
                self.pcgFile.write("//{}\n".format(p))
                self.pcgFile.write(
                    "Blockly.Python[\"{}|{}\"] = function(){{\n".format(p, kind))
                self.pcgFile.write(
                    "\treturn [\"{}\", Blockly.Python.ORDER_ATOMIC];\n".format(p))
                self.pcgFile.write("}\n\n")

    # prevCompCode.js
    def writePrevCompCode(self, comp, ports):
        name = comp.get_name()
        if "out" in ports.keys():
            self.componentCodeWithOutputs.append(name)
        else:
            self.componentCodeWithoutOutputs.append(name)
        self.pccFile.write("//{}\n".format(name))
        self.pccFile.write('function makeOutput{}(tab, count){{\n'.format(name))
        self.pccFile.write(
            "\tBlockly.Arduino['{}' + tab + '|' + count] = function() {{\n".format(name))
        # self.pccFile.write(
        #     "\tBlockly.Arduino['{}0'] = function() {{\n".format(name + "|"))
        self.pccFile.write("\t\tvar code = \"{}\" + (count) + '|';\n".format(name))
        self.pccFile.write("\t\tcode += (this.getFieldValue('NAME') + '|');\n")
        self.pccFile.write("\t\tcode += (this.inputs.length + '|');\n")
        self.pccFile.write("\t\tcode += (this.params.length + '|');\n")
        self.pccFile.write("\t\tfor(var i = 0; i < this.inputs.length; i++){\n")
        self.pccFile.write("\t\t\tcode += this.inputs[i];\n")
        self.pccFile.write("\t\t\tcode += '\\\\';\n")
        self.pccFile.write("\t\t\tcode += Blockly.Arduino.valueToCode(this, this.inputs[i], Blockly.Arduino.ORDER_NONE);\n")
        self.pccFile.write("\t\t}\n\n")
        self.pccFile.write("\t\tcode += '#';\n")

        self.pccFile.write("\t\tfor(var i = 0; i < this.params.length; i++){\n")
        self.pccFile.write("\t\t\tcode += (this.params[i][0] + \"|\" + this.params[i][1] + \"|\");\n")
        self.pccFile.write("\t\t}\n\n")
        self.pccFile.write("\t\tcode += '#';\n")

        self.pccFile.write(
            "\t\treturn code;\n")
            # "\t\treturn [code, Blockly.Arduino.ORDER_NONE];\n")

        self.pccFile.write("\t}\n")

        if "out" in ports.keys():
            count = 0
            for k, v in ports['out'].iteritems():
                self.writePrevCompCodeOutputs(name, k, v, count)
                count += 1
        self.pccFile.write("}\n\n")

    def writePrevCompCodeOutputs(self, componentName, name, valueType, count):
        self.pccFile.write("\n\t//{}- {}\n".format(name, componentName))
        self.pccFile.write(
            "\tBlockly.Arduino['{}' + tab + '|' + {} + '\\\\{}'] = function() {{\n".format(componentName, "count",  str(count)))
        self.pccFile.write("\t\tvar n = this.getInput(\"NAME\").fieldRow[0].getText()\n\t\tn = n.substring(0, n.indexOf(\"->\"))\n")
        self.pccFile.write(
            "\t\tvar code = n + '_';\n".format(componentName))

        self.pccFile.write("\t\tcode += '{}'+'>';\n".format(name))
        self.pccFile.write(
            "\t\treturn [code, Blockly.Arduino.ORDER_ATOMIC];\n")
        self.pccFile.write("\t};\n")

    def finishComponentCode(self):
        self.pccFile.write("function makeAllPrevCompOutputs(tab, count) {\n") 
        for comp in self.componentCodeWithOutputs:
            self.pccFile.write("\tmakeOutput" + comp + "(tab, count);\n")
        for comp in self.componentCodeWithoutOutputs:
            self.pccFile.write("\tmakeOutput" + comp + "(tab, count);\n")
        self.pccFile.write("}")