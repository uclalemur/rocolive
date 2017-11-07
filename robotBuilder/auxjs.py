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
    pass

def writePrevFiles():
    p = {}
    # c = CustomBlockFile(portsIndexPath="indexPortsBlocks.js", portsXMLPath="indexPortsXML.js", portCodeGenPath="portCodeGen.js")
    c = CustomBlockFile()
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

    comps = filter_database(["electrical", "code"])
    print comps
    print "Number of Components: ", len(comps)


    ports = {}

    # import pdb; pdb.set_trace()
    for i in comps:
        # if i.get_name() == "serial_in":
            # import pdb; pdb.set_trace()
        item = {}
        # print i.getName(), i.interfaces
        
        for k, v in i.interfaces.iteritems():
            print k, v
            if "out" in v.lower():
                if 'out' not in item.keys():
                    item['out'] = {}
                item['out'][k] = v
            elif "in" in v.lower():
                if 'in' not in item.keys():
                    item['in'] = {}
                item['in'][k] = v
        ports[i.get_name()] = item

    blockfile = "blocks.js"
    initfile = "init.js"

    # files = (blockfile, initfile)
    # blockjs = CustomBlockFile(blockfile)

    # # write file that defines the toolbox
    # blockjs.writeInit(comps, ports)

    # # Write block.js file that describes blockly blocks.
    # for i in comps:
    #     blockjs.writeComponent(i, ports[i.get_name()])
    #     blockjs.writePrevCompCode(i, ports[i.get_name()])
    # blockjs.finishComponents()
    # blockjs.finishComponentCode()

    # write file that defines the toolbox
    c.writeInit(comps, ports)

    # Write block.js file that describes blockly blocks.
    for i in comps:
        c.writeComponent(i, ports[i.get_name()])
        c.writePrevCompCode(i, ports[i.get_name()])
    c.finishComponents()
    c.finishComponentCode()
