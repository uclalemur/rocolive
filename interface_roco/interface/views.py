from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.core.urlresolvers import reverse
from .models import SessionSave
from django.utils import timezone

import traceback
import logging
import os
import sys
import time
import zipfile
import shutil
import StringIO
import urllib
import array
import datetime

from wsgiref.util import FileWrapper
# from importlib import import_module

from genblocks import CustomBlockFile
from genBuilder import saveBuilder

path = os.path.join(os.getcwd(), "interface/ppr/")
sys.path.append(path)
from svggen.library import allComponents, getComponent, instanceOf, buildDatabase, queryDatabase, filterComponents, filterDatabase, updateComponentsLists
from svggen.api.component import Component
from svggen.api.ports import CodePort
from svggen.api.CodeComponent import CodeComponent

# Create your views here.


def index(request):
    p = {}
    c = CustomBlockFile(portsIndexPath="indexPortsBlocks.js",
                        portsXMLPath="indexPortsXML.js", portCodeGenPath="portCodeGen.js")
    p["input"] = []
    p["output"] = []
    p["other"] = []
    for port in code_ports:
        if "Out" in port.__name__:
            p["output"].append(port.__name__)
        elif "In" in port.__name__:
            p["input"].append(port.__name__)
        else:
            p["other"].append(port.__name__)
    c.writePorts(p)
    c.writeXML(p)
    c.writePortCodeGen(p)
    template = loader.get_template('interface/index.html')
    return HttpResponse(template.render(request))


def prevblocks(request):
    # c = CustomBlockFile()
    comps = filterDatabase(["electrical", "code"])
    # print comps
    # print "Number of Components: ", len(comps)
    # print comps

    # buildDatabase(comps)

    ports = {}

    for i in comps:
        item = {}
        # print i.getName(), i.interfaces
        for k, v in i.interfaces.iteritems():
            if "out" in k.lower() or "out" in v.lower() :
                if 'out' not in item.keys():
                    item['out'] = {}
                item['out'][k] = v
            elif "in" in k.lower() or "in" in v.lower():
                if 'in' not in item.keys():
                    item['in'] = {}
                item['in'][k] = v
        ports[i.getName()] = item

    blockfile = "blocks.js"
    initfile = "init.js"

    files = (blockfile, initfile)
    blockjs = CustomBlockFile(blockfile)

    # write file that defines the toolbox
    blockjs.writeInit(comps, ports)

    # Write block.js file that describes blockly blocks.
    for i in comps:
        blockjs.writeComponent(i, ports[i.getName()])
        blockjs.writePrevCompCode(i, ports[i.getName()])
    blockjs.finishComponents()
    blockjs.finishComponentCode()
    context = {
        'files': files
    }

    template = loader.get_template('interface/prev-blocks.html')
    return HttpResponse(template.render(context, request))


def recall_session(request):
    session = SessionSave.objects.get(pk=int(request.POST['key']))
    return HttpResponse(session.xml_text)

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

def export_code(request):
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
    component = "from svggen.api.targets.PythonTarget import Python\n"
    component += "from svggen.api.targets.ArduinoTarget import Arduino\n\n"
    component += "from svggen.api.CodeComponent import CodeComponent\n"

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
        component += "from svggen.api.ports.CodePort import {}\n".format(p)

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
    component += "class {}(CodeComponent):\n\n".format(className)

    component += "\tdef __init__(self,  yamlFile=None, **kwargs):\n"

    component += "\t\tCodeComponent.__init__(self, yamlFile, **kwargs)\n"
    component += "\t\tname = self.getName()\n\n"


    component += "\tdef define(self, **kwargs):\n"
    for i in parameters:
        component += "\t\tself.addParameter(\"{}\", {}, isSymbol=False)\n".format(i[0][:-8], i[1])
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
        component += "\t\tself.addInterface(\"" +inputs[i][0][:-8] + "\", " + inputs[i][1]+"(self, \"" + inputs[i][0][:-8] + "\", " + "\"" + inputs[i][0] + "\"))\n"
        # component += "\t\tself.addInterface(\"inPort" +str(i) + "\", " + inputs[i][1]+"(self, \"inPort" + str(i) + "\", " + "\"" + inputs[i][0] + "\"))\n"

    for i in range(len(outputs)):
        if len(outputs[i][2]) > 0:
            component += "\t\tself.addInterface(\"" +outputs[i][0][:-8]+ "\", " + outputs[i][2]+"(self, \"" + outputs[i][0][:-8] + "\", " + "\"" + outputs[i][0] + "\"))\n"
        # component += "\t\tself.addInterface(\"outPort" +str(i) + "\", " + outputs[i][2]+"(self, \"outPort" + str(i) + "\", " + "\"" + outputs[i][0] + "\"))\n"
    component += "\t\tCodeComponent.define(self, **kwargs)\n"

    component += "\n"

    component += "\tdef assemble(self):\n"
    component += "\t\tCodeComponent.assemble(self)\n\n"

    component += "if __name__ == \"__main__\":\n"
    component += "\tpass\n\n"


    # builderPath = os.path.join(os.getcwd(), "interface/gen/builderGen/")
    componentPath = os.path.join(os.getcwd(), "interface/ppr/svggen/library/")
    # if not os.path.exists(builderPath):
    #     os.makedir(builderPath)
    if not os.path.exists(componentPath):
        os.makedirs(componentPath)

    cmpath = os.path.join(componentPath, className + ".py")
    cmFile = open(cmpath, 'wb', 0)
    cmFile.write(component)

    comp = getComponent(className, name=className)
    buildDatabase([comp])
    updateComponentsLists()

    return HttpResponse("ok")


def export_builder(request):
    code = request.body
    print code
    cName = saveBuilder(code)

    print cName
    comp = getComponent(cName, name = cName)
    print comp.getName()
    print comp
    buildDatabase([comp])
    updateComponentsLists()
    print request.body
    return HttpResponse("ok")

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        # print root, dirs, files
        for file in files:
            ziph.write(os.path.join(root, file))


def get_code(request, **kwargs):
    # print "KWargs: ", kwargs
    cName = urllib.unquote(kwargs["code"])
    # print kwargs

    comp = getComponent("user_"+cName, name = cName)
    comp.makeOutput(str(os.path.join(os.getcwd(), "user_"+cName)))

    path_to_zip = shutil.make_archive("user_"+cName,"zip","user_"+cName)

    # response = HttpResponse(inner, content_type='application/zip')
    response = HttpResponse(FileWrapper(file(path_to_zip, 'rb')), content_type='application/zip')
    # print inner

    response['Content-Disposition'] = 'attachment; filename='+cName+'.zip'

    shutil.rmtree("user_"+cName)
    os.remove("user_"+cName + ".zip")

    return response



def save(request):
    session = SessionSave(xml_text=request.POST[
        'xml'], save_date=timezone.now())
    session.save()
    return HttpResponse(session.pk)

def prev_save_check(request):
    prel = request.body
    print "Prel 0, 2" , prel[0:2]
    print "prel: ", prel
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    if "CC" in prel[0:2]:
        componentPath = os.path.join(os.getcwd(), "saves", ip, "CC", prel[2:] + ".cpr")
        print componentPath
        if not os.path.exists(componentPath):
            return HttpResponse("ok")
        else:
            r = HttpResponse("ok")
            r.status_code = 400
            return r
    elif "BP" in prel[0:2]:
        componentPath = os.path.join(os.getcwd(), "saves", ip, "BP", prel[2:] + ".bpr")
        print componentPath
        if not os.path.exists(componentPath):
            return HttpResponse("ok")
        else:
            r = HttpResponse("ok")
            r.status_code = 400
            return r
    else:
        r = HttpResponse("ok")
        r.status_code = 403
        return r

def prev_save(request):
    print request.body, "\n\n"
    save = request.body

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    print ip

    componentPath = os.path.join(os.getcwd(), "saves/")
    if not os.path.exists(componentPath):
        os.makedirs(componentPath)

    # Create direcotry for this ip address
    componentPath = os.path.join(componentPath, ip)
    if not os.path.exists(componentPath):
        os.makedirs(componentPath)

    if "CC" in save[5:7]:
        componentPath = os.path.join(componentPath, "CC")
        if not os.path.exists(componentPath):
            os.makedirs(componentPath)
        componentPath = os.path.join(componentPath, save[8:save.find("\n", 8)] + ".cpr")
        f = open(componentPath, "w")
        f.write(save)
        f.close()
    elif "BP" in save[5:7]:
        componentPath = os.path.join(componentPath, "BP")
        if not os.path.exists(componentPath):
            os.makedirs(componentPath)
        componentPath = os.path.join(componentPath, save[8:save.find("\n", 8)] + ".bpr")
        f = open(componentPath, "w")
        f.write(save)
        f.close()
    else:
        r = HttpResponse("ok")
        r.status_code = 400
        return r

    return HttpResponse("ok")

def prev_list(request):
    t = request.body

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    ans = ""
    if "CC" in t:
        componentPath = os.path.join(os.getcwd(), "saves", ip, "CC")
        for root, dirs, files in os.walk(componentPath):
            for f in files:
                j = os.path.getmtime(os.path.join(componentPath, f))
                time = datetime.datetime.fromtimestamp(int(j)).strftime('%Y-%m-%d %H:%M:%S')
                print time
                ans += (f + "%" + time + "%")

    elif "BP" in t:
        componentPath = os.path.join(os.getcwd(), "saves", ip, "BP")
        for root, dirs, files in os.walk(componentPath):
            for f in files:
                j = os.path.getmtime(os.path.join(componentPath, f))
                time = datetime.datetime.fromtimestamp(int(j)).strftime('%Y-%m-%d %H:%M:%S')
                print time
                ans += (f + "%" + time + "%")
    else:
        r = HttpResponse("ok")
        r.status_code = 400
        return r
    return HttpResponse(ans)
    # return HttpResponse("")

def prev_load(request):
    session = request.body
    t = session[0:2]
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    save = ""
    if "CC" in t:
        componentPath = os.path.join(os.getcwd(), "saves", ip, "CC", session[2:])
        save = open(componentPath, "r").read()

    elif "BP" in t:
        componentPath = os.path.join(os.getcwd(), "saves", ip, "BP", session[2:])
        save = open(componentPath, "r").read()
    else:
        r = HttpResponse("ok")
        r.status_code = 400
        return r
    return HttpResponse(save)

def get_cc_save(request, **kwargs):
    fName = kwargs["code"]
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    componentPath = os.path.join(os.getcwd(), "saves", ip, "CC", fName)
    response = HttpResponse(FileWrapper(file(componentPath, 'rb')) , content_type='text/plain')

    print "==========================================hello"

    response['Content-Disposition'] = 'attachment; filename='+fName

    return response

def get_bp_save(request, **kwargs):
    fName = kwargs["code"]
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    componentPath = os.path.join(os.getcwd(), "saves", ip, "BP", fName)
    response = HttpResponse(FileWrapper(file(componentPath, 'rb')) , content_type='text/plain')

    print "==========================================hello"

    response['Content-Disposition'] = 'attachment; filename='+fName

    return response
