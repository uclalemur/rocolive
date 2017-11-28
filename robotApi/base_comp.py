import os, json
from roco.library import all_components, get_component, instance_of, build_database, query_database, filter_components, filter_database, update_component_lists
from roco.api.component import Component
from roco.derived.ports.code_port import CodePort
from roco.derived.ports import code_ports
from roco.derived.components.code_component import CodeComponent
from roco.library import get_lib_dir
from roco.utils.utils import to_camel_case
from django.http import HttpResponse, HttpResponseRedirect

def formatIndent(snippet, trimBegin=False, python = False):
    lines = []
    t = ""
    blines = snippet.split("\n")
    blines1 = []
    if trimBegin:
        if python:
            for i in blines:
                if(len(i[2:]) > 0):
                    blines1.append(i[2:])
        else:
            blines1.append(blines[0][2:])
            for i in blines[1:]:
                if(len(i[4:]) > 0):
                    blines1.append(i[4:])
        blines = blines1
        blines1 = []
    print "blines:", blines
    for i in blines:
        indented = ""
        while i[0:2] == "  ":
            indented += "    "
            i = i[2:]
        indented += i
        if len(indented) > 0:
            blines1.append(indented)

    blines = blines1

    for i in range(len(blines)):
        if i < len(blines)-1:
            if i == 0:
                t = "( \""+blines[i]+"\\n\" \n"
            else:
                t = "\t\t\t\t\t\""+blines[i]+"\\n\" \n"
            lines.append(t)
        else:
            if i == 0:
                t = " \""+blines[i]+"\\n\" \n"
            else:
                t = "\t\t\t\t\t\""+blines[i]+"\\n\" )\n"
            lines.append(t)

    dCode = ""
    for i in lines:
        dCode += i

    return dCode

def is_int(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

def export_code(request):
    code = json.loads(request.body)
    name = code["name"]
    ard = code["arduino"]


    component = "from roco.derived.composables.target.arduino_target import Arduino\n"
    component += "from roco.derived.components.code_component import CodeComponent\n"
    component += "from roco.derived.ports import *\n\n"

    component += "class {}(CodeComponent):\n\n".format(to_camel_case(name))

    component += "\tdef __init__(self,  yaml_file=None, name=\"{}\", **kwargs):\n".format(code["name"])
    # component += "\t\timport pdb; pdb.set_trace()\n"

    component += "\t\tCodeComponent.__init__(self, yaml_file, name, **kwargs)\n"
    component += "\t\tname = self.get_name()\n\n"


    component += "\tdef define(self, **kwargs):\n"
    for i in ard["params"]:
        if is_int(i["value"]):
            pass
        else:
            i["value"] = "\"" + i["value"] + "\""
        component += "\t\tself.add_parameter(\"{}\", {}, is_symbol=False)\n".format(i["name"], i["value"])
    component += "\t\tself.meta = {\n"
    component += "\t\t\tArduino: {\n"

    component += "\t\t\t\t\"code\": \"\""
    component += "\t\t\t\t,\n\n"

    component += "\t\t\t\t\"inputs\": {\n"
    for i in ard["inputs"]:
        component += "\t\t\t\t\t\"" + i["mangled"] + "\": None,\n"
    component += "\t\t\t\t},\n\n"


    component += "\t\t\t\t\"outputs\": {\n"
    funcs = [function["name"] for function in ard["functions"]]
    for out in ard["outputs"]:
        name = out["code"][0:out["code"].find('(')]
        if name in funcs:
            out["code"] = out["code"].replace(name, name + "@@name@@")
        component += "\t\t\t\t\t\"" + out["mangled"] + "\" : \"" + out["code"] + "\",\n"
    component += "\t\t\t\t},\n\n"

    declarations = '(\n' + "\n".join(['\t\t\t\t\t"'+i + '\\n"' for i in ard["decl"]])

    for f in ard["functions"]:
        fn = f["mangled_code"].split("\n")
        a = "\n".join(['\t\t\t\t\t"'+i + '\\n"' for i in fn])
        declarations += "\n" + a
    declarations += "),\n"
    

    
    component += "\t\t\t\t\"declarations\": "
    component += declarations
    
    setupCode = '(\n' + "\n".join(['\t\t\t\t\t"'+i[2:] + '\\n"' for i in ard["setup"].split("\n")]) + "),\n"
    component += "\t\t\t\t\"setup\": "
    component += setupCode
    
    
    loopCode = '(\n' + "\n".join(['\t\t\t\t\t"'+i[2:] + '\\n"' for i in ard["loop"].split("\n")]) + "),\n"
    component += "\t\t\t\t\"loop\": "
    component += loopCode
    
    component += "\t\t\t\t\"needs\": set()\n"
    component += "\t\t\t},\n\n"

    component += "\t\t}\n\n"

    for i in ard["inputs"]:
        component += "\t\tself.add_interface(\"" + i["name"] + "\", " + i["port"] +"(self, \"" + i["name"] + "\", " + "\"" + i["mangled"] + "\"))\n"

    for i in ard["outputs"]:
        component += "\t\tself.add_interface(\"" + i["name"] + "\", " + i["port"] +"(self, \"" + i["name"] + "\", " + "\"" + i["mangled"] + "\"))\n"

    
    
    component += "\t\tCodeComponent.define(self, **kwargs)\n"

    component += "\n"

    component += "\tdef assemble(self):\n"
    component += "\t\tCodeComponent.assemble(self)\n\n"

    component += "if __name__ == \"__main__\":\n"
    component += "\tpass\n\n"
    print component

    cmpath = os.path.join(get_lib_dir(), code["name"] + ".py")
    print "cmpath: ", cmpath
    cmFile = open(cmpath, 'wb', 0)
    cmFile.write(component)
    print cmFile

    comp = get_component(code["name"], name=code["name"], baseclass=code["name"])
    build_database([comp])
    update_component_lists()

    return HttpResponse("ok")




def export_code_old(request):
    code = request.body
    print "Code: ", code
    codeP = code[code.find("...---...") + 9:]
    code = code[0:code.find("...---..."):]
    print "Code began------------------------------------------------------------\n\n\n", code
    print "Python code============================================================", codeP

    # Get Arduino Info
    declare = code[0:code.find("void setup() {")].strip()

    protos = []
    # Cheerson CX-Stars Mini 2.4G 4CH 6 Axis Gyro RC Quadcopter UFO Drone
    pr = declare.split("// Describe this function...\n")
    for i in range(1, len(pr)):
        protos.append(pr[i][0:pr[i].find("\n")])


    for i in range(0, len(protos)):
        protos[i] = protos[i][0:protos[i].find(" {")] + ";"


    print "declare============================", declare, "============="
    for i in declare.split("\n"):
        if len(i) > 0 and i[0] != ' ' and i[len(i)-1] == ";":
            protos.append(i)

    for i in range(0, len(protos)):
        protos[i] = "\"" + protos[i] + "\\n\""

    prots = "\n\t\t\t\t\t".join(protos)

    isMethod = False
    methods = [""]
    for i in declare.split("\n"):
        if len(i) > 0 and i[0] != " " and i[len(i)-1] == "{":
            isMethod = True;

        if isMethod:
            methods[len(methods)-1] += ("\"" + i + "\\n\"\n\t\t\t\t\t")

        if len(i) > 0 and i[0] == "}":
            isMethod = False
            methods.append("\t\t\t\t\t")




    met = "\n".join(methods)

    print "Methods:=============================================", met


    print "prots===========================================", prots

    code = code[code.find("op() {") + 9:]
    # Extract Class Name
    classNameIndex = code.index("|", 0)

    className = "user_"+code[0:classNameIndex]

    code = code[classNameIndex + 1:]

    # Constant imports
    component = "from roco.derived.composables.target.arduino_target import Arduino\n"
    # component += "from roco.derived.composables.target.python_target import Python\n\n"
    component += "from roco.derived.components.code_component import CodeComponent\n"

    # Extract number of ports
    port = {}

    portCountIndex = code.index("|", 0)
    portCount = int(code[0:portCountIndex])
    code = code[portCountIndex + 1:]

    # Extract names of ports
    for i in range(portCount):
        mod = code[0:code.index("|", 0)]
        port[mod[0:mod.index("\\", 0)]] = int(mod[mod.index("\\", 0) + 1:])
        code = code[code.index("|", 0) + 1:]

    # import ports
    for p in port.keys():
        
        loc = ""
        if p[0:2] == "In":
            loc = p[2:len(p)-4].lower() + "_"  + p[-4:].lower()
        elif p[0:3] == "Out":
            loc = p[3:len(p)-4].lower() + "_"  + p[-4:].lower()
        component += "from roco.derived.ports.{} import {}\n".format(loc, p)

    component += "\n\n\n"

    code = code[code.find("##") + 2:]
    compCode = code[0: code.find("##")] + "\n"
    code = code[code.find("##")  +2:]
    loopCode = code[0: code.find("##")] + "\n"
    code = code[code.find("##") + 2:]

    print "Comp code: ", compCode
    print "Loop code: ", loopCode

    inputs = []
    outputs = []
    inputPorts = []
    parameters = []
    while (code.find("|")>0):
        bar1 = code.find("|")
        bar2 = code.find("|", code.find("|") + 1)
        bar3 = code.find("|", code.find("|", code.find("|") + 1) + 1)
        outputs.append([code[0:bar1], code[bar1 + 1: bar2], code[bar2 + 1: bar3]])
        code = code[bar3+1:]

    while (code.find("^")>0):
        percent = code.find("%")
        name = code[:percent]
        code = code[percent+1:]
        caret = code.find("^")
        pt = code[:caret]
        inputs.append([name, pt])
        code = code[caret+1:]

    while (code.find("$") > 0):
        parNameIndex = code.find("$")
        parName = code[0:parNameIndex]
        code = code[parNameIndex + 1:]

        parValIndex = code.find("$")
        parVal = code[0:parValIndex]
        code = code[parValIndex + 1:]

        parameters.append([parName, parVal])


    #name mangle variable names here
    dCode = formatIndent(declare)
    if len(dCode.strip()) == 0:
        dCode = "\"\"\n"

    funOut = [];

    print "dCode:==================================================:", dCode
    print "cCode==============================================", ("\n" + compCode)

    g = (compCode).split("\n")

    print "compCode before:======================================", "\n"+compCode
    setupCode = formatIndent(compCode, trimBegin = True)
    print "setupCode after:======================================", "\n"+setupCode

    h = []

    top = "void @@name@@{\n"

    if len(g)>0 and len(g[i][2:])>0 and "=" not in g[i][2:] and "();" in g[i][2:] and g[i][3] != " ":
        funOut.append(g[i][2:])
    else :
        h.append(g[i])

    for i in range(1, len(g)):
        if len(g[i][4:])>0 and "=" not in g[i][4:] and "();" in g[i][4:] and g[i][5] != " ":
            funOut.append(g[i][4:])
        else :
            h.append(g[i])

    compCode = "\n".join(h)





    loopCode = formatIndent(loopCode, trimBegin = False)
    print "loopCode after:======================================", "\n"+loopCode

    for i in funOut:
        outputs.append(["dummy", i, ""])

    cCode = formatIndent(compCode, trimBegin = True)



    sup = cCode[2:][:-2]
    cCode = "(" +prots + "\n\t\t\t\t\t"+ met + ")\n"

    print "sup========================================", sup


    # Get Python info
    print "\n\n\nclass Name", className[5:]

    defs = codeP[0:codeP.find(className[5:])]
    print "defs====================------------------------========================\n", defs, "\nend defs==================================="
    codeP = codeP[codeP.find(className[5:]):]
    print "CodeP:================", codeP

    codeP = codeP[codeP.find("##") + 2:]
    compCode = codeP[0: codeP.find("##")] + "\n"
    codeP = codeP[codeP.find("##") + 2:]

    outputsP = []
    cPCode = formatIndent(compCode, True, True)
    dPCode = formatIndent(defs)

    while (codeP.find("|")>0):
        bar1 = codeP.find("|")
        bar2 = codeP.find("|", codeP.find("|") + 1)
        bar3 = codeP.find("|", codeP.find("|", codeP.find("|") + 1) + 1)
        outputsP.append([codeP[0:bar1], codeP[bar1 + 1: bar2], codeP[bar2 + 1: bar3]])
        codeP = codeP[bar3+1:]

    # Declare class
    component += "class {}(CodeComponent):\n\n".format(to_camel_case(className))

    component += "\tdef __init__(self,  yaml_file=None, **kwargs):\n"

    component += "\t\tCodeComponent.__init__(self, yaml_file, **kwargs)\n"
    component += "\t\tname = self.get_name()\n\n"


    component += "\tdef define(self, **kwargs):\n"
    for i in parameters:
        component += "\t\tself.add_parameter(\"{}\", {}, is_symbol=False)\n".format(i[0][:-8], i[1])
    component += "\t\tself.meta = {\n"
    component += "\t\t\tArduino: {\n"

    # code
    if len(cCode.strip()) == 0:
        cCode = "\"\"\n"

    component += "\t\t\t\t\"code\": "
    # component += cCode
    component += "\"\""
    component += "\t\t\t\t,\n\n"

    # inputs
    component += "\t\t\t\t\"inputs\": {\n"
    # print inputs
    for i in inputs:
        component += "\t\t\t\t\t\"" + i[0] + "\": None"
        if i[0] != inputs[len(inputs)-1]:
            component += ","
        component += "\n"
    component += "\t\t\t\t},\n\n"

    # outputs
    print "outputs==================================", outputs


    component += "\t\t\t\t\"outputs\": {\n"
    for i in outputs:
        component += "\t\t\t\t\t\"" + i[0] + "\" : \"" + i[1] + "\",\n"
        # component += "\t\t\t\t\t\"dummy123\" : " + loopCode
    component += "\t\t\t\t},\n\n"

    component += "\t\t\t\t\"declarations\": "
    component += "(" + prots + ")"
    component += "\t\t\t\t,\n\n"

    component += "\t\t\t\t\"setup\": "
    component += setupCode
    component += "\t\t\t\t,\n\n"
    # component += "\t\t\t\t\"setup\": \"\",\n\n"

    component += "\t\t\t\t\"loop\": "
    component += loopCode
    component += "\t\t\t\t,\n\n"

    component += "\t\t\t\t\"needs\": set()\n"
    component += "\t\t\t},\n\n"


    # # Python
    # component += "\t\t\tPython: {\n"
    #
    # # code
    # print "dCode python: ======================", dPCode, "length", len(dPCode)
    # if dPCode[0] != "(":
    #     dPCode = "(" + dPCode
    # component += "\t\t\t\t\"code\": "
    # if len(dPCode.strip()):
    #     component += dPCode[0:-2] + "\n\t\t\t\t\t" + cPCode[2:]
    # elif len(cPCode.strip()):
    #     component += cPCode
    # else :
    #     component += "\"\"\n"
    # component += "\t\t\t\t,\n\n"
    #
    # # inputs
    # component += "\t\t\t\t\"inputs\": {\n"
    # # print inputs
    # for i in inputs:
    #     component += "\t\t\t\t\t\"" + i[0] + "\": None"
    #     if i[0] != inputs[len(inputs)-1]:
    #         component += ","
    #     component += "\n"
    # component += "\t\t\t\t},\n\n"
    #
    # # outputs
    # component += "\t\t\t\t\"outputs\": {\n"
    # for i in outputsP:
    #     component += "\t\t\t\t\t\"" + i[0] + "\" : \"" + i[1] + "\",\n"
    # component += "\t\t\t\t},\n\n"
    #
    # component += "\t\t\t\t\"setup\": \"\",\n\n"
    #
    # component += "\t\t\t\t\"needs\": set()\n"
    # component += "\t\t\t}\n"
    #
    component += "\t\t}\n\n"

    for i in range(len(inputs)):
        component += "\t\tself.add_interface(\"" +inputs[i][0][:-8] + "\", " + inputs[i][1]+"(self, \"" + inputs[i][0][:-8] + "\", " + "\"" + inputs[i][0] + "\"))\n"
        # component += "\t\tself.addInterface(\"inPort" +str(i) + "\", " + inputs[i][1]+"(self, \"inPort" + str(i) + "\", " + "\"" + inputs[i][0] + "\"))\n"

    for i in range(len(outputs)):
        if len(outputs[i][2]) > 0:
            component += "\t\tself.add_interface(\"" +outputs[i][0][:-8]+ "\", " + outputs[i][2]+"(self, \"" + outputs[i][0][:-8] + "\", " + "\"" + outputs[i][0] + "\"))\n"
        # component += "\t\tself.addInterface(\"outPort" +str(i) + "\", " + outputs[i][2]+"(self, \"outPort" + str(i) + "\", " + "\"" + outputs[i][0] + "\"))\n"
    component += "\t\tCodeComponent.define(self, **kwargs)\n"

    component += "\n"

    component += "\tdef assemble(self):\n"
    component += "\t\tCodeComponent.assemble(self)\n\n"

    component += "if __name__ == \"__main__\":\n"
    component += "\tpass\n\n"


    # builderPath = os.path.join(os.getcwd(), "interface/gen/builderGen/")
    # componentPath = os.path.join(os.getcwd(), os.pardir, "roco/roco/library/")
    # if not os.path.exists(builderPath):
    #     os.makedir(builderPath)
    # if not os.path.exists(componentPath):
    #     os.makedirs(componentPath)

    cmpath = os.path.join(get_lib_dir(), className + ".py")
    print "cmpath: ", cmpath
    cmFile = open(cmpath, 'wb', 0)
    cmFile.write(component)
    print cmFile

    comp = get_component(className, name=className, baseclass=className)
    build_database([comp])
    update_component_lists()

    return HttpResponse("ok")
