import os, sys, importlib, json
from roco.library import all_components, get_component, instance_of, build_database, query_database, filter_components, filter_database, update_component_lists
from roco.api.component import Component
from roco.derived.ports.code_port import CodePort
from roco.builders import get_builder_dir
from roco.derived.ports import code_ports
from roco.derived.components.code_component import CodeComponent
from roco.library import get_lib_dir
from roco.utils.utils import to_camel_case
from django.http import HttpResponse, HttpResponseRedirect

def removeSetupLoop(code):
    loopIndex = code.find("loop")
    code = code[loopIndex + 1:]

    loopIndex = code.find("{")
    code = code[loopIndex + 1:]
    return code

def getCName(code):
    return code[0:code.find("|")].strip(), code[code.find("|")+3:]

def createBuilder(code):
    # TODO: If a component that has blocks with parameters break, add parameters to the JSON 
    # file format in the getJSON() function in codegen.js, and modify this function to parse the parameters in the JSON
    # and add c.set_parameter() function calls to the builder file.
    c = json.loads(code)
    cName = c['name']
    build = "from roco.api.component import Component\n"
    build += "from roco.library import *\n"
    build += "from roco.library import get_component\n\n"
    build += "c = Component(name = '{}')\n".format(to_camel_case(c['name']))

    for b in c["blocks"]:
        build += "c.add_subcomponent('{}', '{}')\n".format(b["name"], b["type"])

    for b in c["blocks"]:
        for v in b["inputs"]:
            if(not v["inherited"]):
                build += "c.add_connection(('{}', '{}'), ('{}', '{}'))\n".format(v["source_comp"], v["source_name"], b["name"], v["name"])

    for b in c["blocks"]:
        for v in b["inputs"]:
            if(v["inherited"]):
                build += "c.inherit_interface('{}', ('{}', '{}'))\n".format(v["name"], v["source_comp"], v["source_name"])

    for o in c["outputs"]:
        build += "c.inherit_interface('{}', ('{}', '{}'))\n".format(o["name"], o["source_comp"], o["source_name"])        

    build += "c.to_yaml(\"library/{}.yaml\")\n".format(c["name"])


    # TODO make this system independent
    buildPath = get_builder_dir()
    if not os.path.exists(buildPath):
        os.makedirs(buildPath)

    sys.path.append(str(buildPath))

    blpath = os.path.join(buildPath, cName + ".py")
    blFile = open(blpath, 'wb', 0)
    blFile.write(build)


    importlib.import_module(cName)

    return cName

def export_builder(request):
    code = request.body
    # cName = saveBuilder(code)
    cName = createBuilder(code)
    # import pdb; pdb.set_trace()
    comp = get_component(cName, name = cName)
    build_database([comp])
    update_component_lists()
    return HttpResponse("ok")