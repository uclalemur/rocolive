from collections import OrderedDict
from os.path import join
import sys

import yaml
import svggen.utils.mymath as math

from svggen import SVGGEN_DIR
from svggen.api.Parameterized import Parameterized
from svggen.utils.utils import prefix as prefixString
from svggen.utils.utils import tryImport
from svggen.utils.io import load_yaml


## TODO:
## Add query component that returns full list of constants and parameters


def getSubcomponentObject(component, name=None, **kwargs):
    try:
        obj = tryImport(component, component)
        # XXX hack to get around derived components not having name parameter in their __init__
        c = obj(name=name, **kwargs)
        c.setName(name)
        return c
    except ImportError:
        c = Component(component, **kwargs)
        c.setName(name)
        return c


class Component(Parameterized):
    def __init__(self, yamlFile=None, **kwargs):
        Parameterized.__init__(self)

        self.subcomponents = dict()
        self.connections = []
        self.interfaces = {}
        self.virtualPairs = list()

        # self.virtualInterfaces = {}
        # self.containerInterfaces = {}

        self.composables = OrderedDict()

        if yamlFile:
            self._fromYaml(yamlFile)

        # Override to define actual component
        try:
            self.setName(kwargs["name"])
        except KeyError:
            pass

        self.define(**kwargs)

        self.make()

    def _make_test(self, protobuf=False, display=True):
        if not hasattr(self, '_test_params'):
            raise NotImplementedError

        for key, val in self._test_params.iteritems():
            self.setParameter(key, val)

        name = self.__class__.__name__
        self.makeOutput('output/%s' % name,
                        protobuf=protobuf,
                        display=display)

    def _strToSympy(self, s):
        expr = math.sympify(s)
        subs = []
        for a in expr.atoms(math.Symbol):
            subs.append((a, self.getParameter(repr(a))))
        expr = expr.subs(subs)
        return expr

    def _fromYaml(self, filename):
        definition = load_yaml(filename)

        # keys are (parameters, constants, subcomponents, constraints, connections, interfaces)
        try:
            for name, default in definition["parameters"].iteritems():
                self.addParameter(name, default)
        except AttributeError:
            pass

        try:
            for name, default in definition["constants"].iteritems():
                self.addConstant(name, default)
        except AttributeError:
            pass

        try:
            for name, value in definition["subcomponents"].iteritems():
                try:
                    # XXX Can these be sympy functions as well?
                    kwargs = value["constants"]
                except AttributeError:
                    kwargs = {}
                self.addSubcomponent(name, value["class"], **kwargs)
                try:
                    for param, pvalue in value["parameters"].iteritems():
                        self.setSubParameter((name, param), pvalue)
                except AttributeError:
                    pass

            for name, value in definition["subcomponents"].iteritems():
                for (composableType, container) in value["containers"].iteritems():
                    self.setContainer(name, container, {}, {}, composableType)

        except AttributeError as e:
            print(e)
            pass

        try:
            for value in definition["constraints"]:
                self.addSemanticConstraint(self._strToSympy(value))
        except AttributeError:
            pass

        try:
            for toPort, fromPort, kwargs in definition["connections"]:
                for param, pvalue in kwargs.iteritems():
                    kwargs[param] = self._strToSympy(pvalue)
                self.addConnection(toPort, fromPort, **kwargs)
        except AttributeError:
            pass

        try:
            for name, value in definition["interfaces"].iteritems():
                self.inheritInterface(name, (value["subcomponent"], value["interface"]))
        except AttributeError:
            pass

    def define(self, **kwargs):
        ### Override to define interfaces
        pass

    ###
    # DESIGN PHASE
    ###

    def addSubcomponent(self, name, obj, **kwargs):
        '''
        :param name: unique identifier to refer to this component by
        :type  name: str or unicode
        :param obj: code name of the subcomponent
                    should be python file/class or yaml name
        :type  obj: str or unicode
        '''
        # XXX will silently fail if subcomponent name is already taken?
        sc = {"class": obj, "parameters": {}, "constants": kwargs, "component": None, "containers": dict()}
        self.subcomponents.setdefault(name, sc)
        self.resolveSubcomponent(name)

        '''
        if inherit:
            if prefix == "":
                prefix = name

            obj = getComponent(name)
            for key, value in obj.parameters.iteritems():
                # inherit = True : inherit all parameters
                if inherit is True or key in inherit:
                    try:
                        self.addParameter(prefixString(prefix, key), value)
                    except KeyError:
                        # It's ok if we try to add a parameter that already exists
                        pass
                    self.addConstraint((name, key), prefixString(prefix, key))
            # XXX also inherit interfaces?
        '''

    def delSubcomponent(self, name):
        toDelete = []

        # delete edges connecting components
        for i, ((fromComp, _), (toComp, _), _, _) in enumerate(self.connections):
            if name in (fromComp, toComp):
                toDelete.append(i)
        for i in reversed(toDelete):
            self.connections.pop(i)

        self.subcomponents.pop(name)

    def addInterface(self, name, val):
        if name in self.interfaces:
            raise ValueError("Interface %s already exists" % name)

        for (n1, n2) in self.virtualPairs:
            if name == n1 or name == n2:
                raise ValueError("%s already exists as part of Virtual Interface pair!")

        self.interfaces.setdefault(name, val)
        return self

    def addVirtualInterfacePair(self, (name1, name2)):
        if name1 in self.interfaces:
            raise ValueError("%s already exists as interface!" % name1)
        if name2 in self.interfaces:
            raise ValueError("%s already exists as interface!" % name2)

        for (n1, n2) in self.virtualPairs:
            if (name1, name2) == (n1, n2):
                raise ValueError("Virtual Interface pair already exists!")
            if name1 == n1 or name1 == n2 or name2 == n1 or name2 == n2:
                raise ValueError("Virtual Interface name %s already exists in different pair!")

        self.virtualPairs.append((name1, name2))
        return self

    def delInterface(self, name):
        self.interfaces.pop(name)

    def inheritAllInterfaces(self, subcomponent, prefix=""):
        self.resolveSubcomponent(subcomponent)
        obj = self.getComponent(subcomponent)
        if prefix == "":
            prefix = name ## should this be self.getName() ?

        for name, value in obj.interfaces.iteritems():
            if name in self.interfaces:
                raise ValueError("Interface %s already exists" % name)
            self.interfaces.setdefault(prefixString(prefix, name), {"subcomponent": subcomponent, "interface": name})
        return self

    def inheritInterface(self, name, (subcomponent, subname)):
        if name in self.interfaces:
            raise ValueError("Interface %s already exists" % name)
        self.interfaces.setdefault(name, {"subcomponent": subcomponent, "interface": subname})
        return self

    def addConnection(self, fromInterface, toInterface, **kwargs):
        self.connections.append([fromInterface, toInterface, kwargs])

    def getInterfaceConnection(self, (fromName, fromPort)):
        for ((fName, fPort),(tName, tPort), kwargs) in self.connections:
            if (fromName, fromPort) == (fName, fPort):
                return (tName, tPort)
            elif (tName, tPort) == (fromName, fromPort):
                return (fName, fPort)
        return None

    """
    def setContainer(self, virtual, container, virtualParams, containerParams, types=None):
        containerDict = dict()
        if types is None:
            types = self.composables.keys()
        if isinstance(types, list):
            for composableType in types:
                containerDict[composableType] = container
        else:
            containerDict[types] = container
        self.subcomponents[virtual]["containers"].update(containerDict)

        virtualObject = self.getComponent(virtual)
        containerObject = self.getComponent(container)
        virtualObject.setContainer(virtualObject, containerObject, virtualParams, containerParams, types)
        containerObject.addVirtual(virtualObject, containerObject, virtualParams, containerParams, types)
    """

    def setContainer(self, virtual, container, constraints, types=None):
        virtualObject = self.getComponent(virtual)
        containerObject = self.getComponent(container)

        if types is None:
            types = self.composables.keys()
        if isinstance(types, list):
            for composableType in types:
                virtualObject.composables[composableType].setContainer(containerObject.composables[composableType])
                containerObject.composables[composableType].addVirtual(virtualObject.composables[composableType])

        self.extendSemanticConstraints(constraints)


    def toYaml(self, filename):
        parameters = {}
        constants = {}
        for k, v in self.parameters.iteritems():
            if isinstance(v, math.Symbol):
                parameters[k] = self.defaults[k]
            else:
                constants[k] = v

        subcomponents = {}
        for k, v in self.subcomponents.iteritems():
            subparams = {}
            for param, value in v["parameters"].iteritems():
                try:
                    value = repr(value.subs(self.getAllSubs()))
                except AttributeError:
                    pass
                subparams[param] = value
            subcomponents[k] = {"class": v["class"], "parameters": subparams, "constants": v["constants"],
                                "containers": v["containers"]}

        constraints = []
        for x in self.localSemanticConstraints:
            expr = repr(x.subs(self.getAllSubs()))
            constraints.append(expr)

        connections = []
        for toPort, fromPort, kwargs in self.connections:
            newArgs = {}
            for param, value in kwargs.iteritems():
                try:
                    value = repr(value.subs(self.getAllSubs()))
                except AttributeError:
                    pass
                newArgs[param] = value
            connections.append([toPort, fromPort, newArgs])

        definition = {
            "parameters": parameters,
            "constants": constants,
            "subcomponents": subcomponents,
            "constraints": constraints,
            "connections": connections,
            "interfaces": self.interfaces,
        }

        with open(join(SVGGEN_DIR, filename), "w") as fd:
            yaml.safe_dump(definition, fd)

    ###
    # GETTERS AND SETTERS
    ###

    def getComposable(self, type):
        return self.composables[type]

    def getComponent(self, name):
        return self.subcomponents[name]["component"]

    def setSubParameter(self, (c, n), v):
        self.subcomponents[c]["parameters"][n] = v

    def getInterfaces(self, component, name):
        return self.getComponent(component).getInterface(name)

    def isVirtualInterface(self, (name, port)):
        vPairs = self.getComponent(name).virtualPairs
        for (name1, name2) in vPairs:
            if port == name1 or port == name2:
                return True

        return False

        # c = self.getComponent(name).interfaces[port]
        # if isinstance(c, dict):
        #    subc = c["subcomponent"]
        #    subi = c["interface"]
        #    return self.isVirtualInterface((subc, subi))
        #
        # return False


    def getInterface(self, name):
        c = self.interfaces[name]

        if isinstance(c, dict):
            subc = c["subcomponent"]
            subi = c["interface"]
            return self.getInterfaces(subc, subi)
        else:
            return c

    def getVirtualPair(self, name, v):
        vPairs = self.getComponent(name).virtualPairs

        for (v1, v2) in vPairs:
            if v == v1:
                return v2
            elif v == v2:
                return v1

        c = self.getComponent(name).interfaces[name]
        if isinstance(c, dict):
            subc = c["subcomponent"]
            subi = c["interface"]
            return self.getVirtualPair(subc, subi)

        return None

    def setInterface(self, n, v):
        if n in self.interfaces:
            self.interfaces[n] = v
        else:
            raise KeyError("Interface %s not initialized" % n)
        return self

    # def getVirtualInterfaces(self, component, name):
    #    return self.getComponent(component).getVirtualInterface(name)

    # def getVirtualInterface(self, name):
    #    c = self.interfaces[name]

    #    if isinstance(c, dict):
    #        subc = c["subcomponent"]
    #        subi = c["interface"]
    #        return self.getInterfaces(subc, subi)
    #    else:
    #      return c

    # def setVirtualInterface(self, n, v):
    #    if n in self.interfaces:
    #        self.interfaces[n] = v
    #    else:
    #        raise KeyError("Interface %s not initialized" % n)
    #    return self


    ###
    # ASSEMBLY PHASE
    ###

    def assemble(self):
        ### Override to combine components' drawings to final drawing
        pass

    def append(self, name, prefix):
        component = self.getComponent(name)

        allPorts = set()
        for key in component.interfaces:
            try:
                allPorts.update(component.getInterface(key))
            except TypeError:
                # interface is not iterable, i.e. a single port
                allPorts.add(component.getInterface(key))
        for port in allPorts:
            port.prefix(prefix)

        for (key, composable) in component.composables.iteritems():
            self.composables[key].append(composable, prefix)

    def attach(self, (fromName, fromPort), (toName, toPort), kwargs):
        """"
        if self.isVirtualInterface((fromName, fromPort)):
            return
        if self.isVirtualInterface((toName, toPort)):
            (ntoName, ntoPort) = self.getInterfaceConnection((toName, self.getVirtualPair(toName, toPort)))
            self.attach((fromName, fromPort), (ntoName, ntoPort), kwargs)
            return
        """

        interface1 = self.getInterfaces(fromName, fromPort)
        interface2 = self.getInterfaces(toName, toPort)

        # Interfaces can contain multiple ports, so try each pair of ports
        if not isinstance(interface1, (list, tuple)):
            interface1 = [interface1]
        if not isinstance(interface2, (list, tuple)):
            interface2 = [interface2]
        if len(interface1) != len(interface2):
            if len(interface1) == 1:
                interface1 = interface1 * len(interface2)
            elif len(interface2) == 1:
                interface2 = interface2 * len(interface1)
            else:
                raise AttributeError("Number of ports in each interface don't match")

        for (port1, port2) in zip(interface1, interface2):
            self.extendSemanticConstraints(port1.constrain(self, port2, **kwargs))
            for (key, composable) in self.composables.iteritems():
                try:
                    composable.attach(port1, port2, kwargs)
                except:
                    print "Error in attach:"
                    print (fromName, fromPort),
                    print self.getInterfaces(fromName, fromPort).toString()
                    print (toName, toPort)
                    print self.getInterfaces(toName, toPort).toString()
                    raise

    def solve(self):
        pass

    ###
    # BUILD PHASE
    ###

    def modifyParameters(self):
        # Override to manually specify how parameters get set during build
        pass

    def resolveSubcomponents(self):
        for name in self.subcomponents:
            self.resolveSubcomponent(name)

    def resolveSubcomponent(self, name):
        sc = self.subcomponents[name]
        try:
            if sc["component"]:
                # Already resolved
                # XXX Check to see why we're calling this again?
                return
        except KeyError:
            # We're adding the component anyway, so no worries
            pass

        c = sc["class"]
        try:
            kwargs = sc["constants"]
        except KeyError:
            kwargs = {}
        obj = getSubcomponentObject(c, name=prefixString(self.getName(), name), **kwargs)
        obj.setName(prefixString(self.getName(), name))
        self.subcomponents[name]["component"] = obj
        self.inheritSemanticConstraints(obj)

    def inheritSemanticConstraints(self, subComponent):
        self.extendSemanticConstraints(subComponent.getSemanticConstraints())

    def evalConstraints(self):
        for subComponent in self.subcomponents.iterkeys():
            for (parameterName, value) in self.subcomponents[subComponent]["parameters"].iteritems():
                # XXX Should probably set value in subcomponent object
                self.getComponent(subComponent).setParameter(parameterName, value)
                #self.setParameter(prefixString(subComponent, parameterName), value)

    # Append composables from all known subcomponents
    # (including ones without explicitly defined connections)
    def evalComponents(self):
        for (name, sc) in self.subcomponents.iteritems():
            obj = sc["component"]
            try:
                for (key, composable) in obj.composables.iteritems():
                    if key not in self.composables:
                        self.composables[key] = composable.new()
                self.append(name, name)
            except:
                print "Error in subclass %s" % (name)
                raise
        # Let composables know what components exist
        # TODO remove this when we have a better way of letting composables
        # know about components that have no ports (ex Bluetooth module driver)
        for (key, composable) in self.composables.iteritems():
            for (name, sc) in self.subcomponents.iteritems():
                composable.addComponent(sc["component"])

    def evalInterfaces(self):
        for (name, value) in self.interfaces.iteritems():
            for (key, composble) in self.composables.iteritems():
                if value is not None:
                    composble.addInterface(self.getInterface(name))

    def evalConnections(self):
        for ((fromComponent, fromPort), (toComponent, toPort), kwargs) in self.connections:
            self.attach((fromComponent, fromPort), (toComponent, toPort), kwargs)

    def make(self):
        self.modifyParameters()
        self.resolveSubcomponents()
        self.evalConstraints()

        self.evalComponents()  # Merge composables from all subcomponents and tell them my components exist
        self.evalInterfaces()  # Tell composables that my interfaces exist
        self.evalConnections()  # Tell composables which interfaces are connected
        self.assemble()

    ###
    # OUTPUT PHASE
    ###

    def makeComponentHierarchy(self):
        self.resolveSubcomponents()
        hierarchy = {}
        for n, sc in self.subcomponents.iteritems():
            hierarchy[n] = {"class": sc["class"], "subtree": sub.makeComponentHierarchy()}
        return hierarchy

    def makeComponentTree(self, fn, root="Root"):
        import pydot
        graph = pydot.Dot(graph_type='graph')
        mynode = pydot.Node(root, label=root)
        self.recurseComponentTree(graph, mynode, root)
        graph.write_png(fn)

    def recurseComponentTree(self, graph, mynode, myname):
        import pydot
        self.resolveSubcomponents()
        for n, sc in self.subcomponents.iteritems():
            fullstr = myname + "/" + n
            subnode = pydot.Node(fullstr, label=sc["class"] + r"\n" + n)
            graph.add_node(subnode)
            edge = pydot.Edge(mynode, subnode)
            graph.add_edge(edge)
            sub.recurseComponentTree(graph, subnode, fullstr)

    def makeOutput(self, filedir=".", **kwargs):
        import os

        os.system("pwd")

        def kw(arg, default=False):
            if arg in kwargs:
                return kwargs[arg]
            return default

        print "Compiling robot designs..."
        sys.stdout.flush()
        if kw("remake", False):
            self.make()
        print "done."

        # XXX: Is this the right way to do it?
        import os
        try:
            os.makedirs(filedir)
        except:
            pass

        # Process composables in some ordering based on type
        orderedTypes = ['electrical', 'ui',
                        'code']  # 'code' needs to know about pins chosen by 'electrical', and 'code' needs to know about IDs assigned by 'ui'
        # First call makeOutput on the ones of a type whose order is specified


        print self.subcomponents

        for composableType in orderedTypes:
            if composableType in self.composables:
                print "composableType", composableType
                print "composable Value", self.composables[composableType]
                c = self.composables[composableType]
                c.makeOutput(filedir, **kwargs)
        # Now call makeOutput on the ones whose type did not care about order
        for (composableType, composable) in self.composables.iteritems():
            if composableType not in orderedTypes:
                self.composables[composableType].makeOutput(filedir, **kwargs)

        if kw("tree"):
            print "Generating hierarchy tree... ",
            sys.stdout.flush()
            self.makeComponentTree(filedir + "/tree.png")
            print "done."


        print "Wrote output to %s" % os.getcwd() + "/" + filedir if filedir != "." else os.getcwd()
        print "Happy roboting!"

    ###
    # OTHER STUFF
    ###

    def addConstant(self, name, value, **kwargs):
        value = name in kwargs and kwargs[name] or value
        Parameterized.addParameter(self, name, value, isSymbol=False)
        return value

    def toProtoBuf(self, filedir):
        from svggen.api import proto_conversion3
        from google.protobuf import text_format

        """
        print 'begin symbolicization of parameters'
        for p in self.parameters:
            print p
            self.symbolicize(p)
        """

        proto = proto_conversion3.componentToNewTemplateProto(self)
        text_format.PrintMessage(proto, open(filedir + '/template.asciiproto', 'w'), 2)
        open(filedir + '/template.proto', 'wb').write(proto.SerializeToString())
        self.composables['graph'].unplace()
