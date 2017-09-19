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
# from genBuilder import saveBuilder


from roco.library import all_components, get_component, instance_of, build_database, query_database, filter_components, filter_database, update_component_lists
# from svggen.library import allComponents, getComponent, instanceOf, buildDatabase, queryDatabase, filterComponents, filterDatabase, updateComponentsLists
from roco.api.component import Component
# from svggen.api.component import Component
from roco.derived.ports.code_port import CodePort
from roco.derived.ports import code_ports
# from svggen.api.ports import CodePort
from roco.derived.components.code_component import CodeComponent
# from svggen.api.CodeComponent import CodeComponent


def writeIndexFiles():
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

def writePrevFiles():
    # c = CustomBlockFile()
    comps = filter_components(["electrical", "code"])
    print comps
    print "Number of Components: ", len(comps)
    print comps

    build_database(comps)

    ports = {}

    for i in comps:
        item = {}
        # print i.getName(), i.interfaces
        # import pdb; pdb.set_trace()
        for k, v in i.interfaces.iteritems():
            if "out" in k.lower() or "out" in v.name.lower() or "do" in k.lower() or "do" in v.name.lower():
                if 'out' not in item.keys():
                    item['out'] = {}
                item['out'][k] = v
            elif "in" in k.lower() or "in" in v.name.lower() or "di" in k.lower() or "di" in v.name.lower() or ("a" in v.name.lower() and v.name.lower()[1:].isdigit()):
                if 'in' not in item.keys():
                    item['in'] = {}
                item['in'][k] = v
        ports[i.get_name()] = item

    blockfile = "blocks.js"
    initfile = "init.js"

    files = (blockfile, initfile)
    blockjs = CustomBlockFile(blockfile)

    # write file that defines the toolbox
    blockjs.writeInit(comps, ports)

    # Write block.js file that describes blockly blocks.
    for i in comps:
        blockjs.writeComponent(i, ports[i.get_name()])
        blockjs.writePrevCompCode(i, ports[i.get_name()])
    blockjs.finishComponents()
    blockjs.finishComponentCode()
