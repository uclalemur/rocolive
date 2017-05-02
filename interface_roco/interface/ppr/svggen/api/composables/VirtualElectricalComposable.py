from svggen.api.composables.VirtualComposable import VirtualComposable
from svggen.api.composables.ElectricalContainer import ElectricalContainer
from svggen.api.ports.ElectricalPort import ElectricalPort
from copy import deepcopy

class VirtualElectricalComposable(VirtualComposable):

    """
        def new(self):
            return deepcopy(self)

        def __init__(self):
            VirtualComposable.__init__(self)

        def append(self, newComposable, newPrefix):
            pass

        def attach(self, fromPort, toPort, kwargs):
            pass

        def makeOutput(self, filedir, **kwargs):
            pass
    """

    def new(self):
        cc = deepcopy(self)
        #cc.physical = dict()
        return cc

    def __init__(self, name, physical):
        VirtualComposable.__init__(self)
        self.physical = dict()
        self.physical[name] = dict()
        self.physical[name]["power"] = physical["power"]
        self.physical[name]["connections"] = [list() for i in range(physical["numPins"])]
        self.physical[name]["virtual"] = True
        self.physical[name]["virtualPair"] = None

    def attach(self, fromPort, toPort, kwargs):
        if not isinstance(fromPort, ElectricalPort) or not isinstance(toPort, ElectricalPort):
            return

        fromName = fromPort.getComponentName()
        fromPins = fromPort.getPins()
        toName = toPort.getComponentName()
        toPins = toPort.getPins()

        if len(fromPins) != len(toPins):
            raise Exception("Number of pins on ports do not match!")

        fVirtual = self.physical[fromName]["virtual"]
        tVirtual = self.physical[toName]["virtual"]

        for fpin, tpin in zip(fromPins, toPins):
            if fVirtual:
                self.physical[fromName]["connections"][fpin].append([toName, tpin, False])
            else:
                self.physical[fromName]["connections"][fpin] = [toName, tpin, False]
            if tVirtual:
                self.physical[toName]["connections"][tpin].append([fromName, fpin, False])
            else:
                self.physical[toName]["connections"][tpin] = [fromName, fpin, False]

    def append(self, newComposable, newPrefix):
        if isinstance(newComposable, ElectricalContainer):
            self.resolveContainer(newComposable)
        else:
            self.physical.update(newComposable.physical)

    def resolveContainer(self, newComposable):
        for (fName, val) in newComposable.physical.iteritems():
            for fpin, connect in enumerate(val["connections"]):
                if connect is not None:
                    tName = connect[0]
                    tpin = connect[1]
                    pName = self.physical[tName]["virtualPair"]
                    if pName is not None:
                        newComposable.physical[fName]["connections"][fpin] = [pName, tpin, False]
        self.physical.update(newComposable.physical)

    def inheritVirtual(self, pName, vName):
        self.physical[vName]["virtualPair"] = pName
        pPhysical = self.physical[pName]["connections"]
        vPhysical = self.physical[vName]["connections"]
        for idx, (pConnect, vConnect) in enumerate(zip(pPhysical, vPhysical)):
            if pConnect is None and vConnect is not None:
                self.physical[pName]["connections"][idx] = vConnect
                self.physical[vConnect[0]]["connections"][vConnect[1]] = [pName, idx, False]

    def setContainer(self, virtualName, containerName, containerComposable, connections=None):
        self.container = containerComposable
        virtualName = self.removePrefix(virtualName)
        containerName = self.removePrefix(containerName)
        cphysical = self.container.physical
        for connect in connections:
            self.physical[virtualName]["connections"][connect[0]] = [containerName, connect[1], False]

    def makeOutput(self, filedir, **kwargs):
        filename = "%s/wiring_instructions.txt" % filedir
        f = open(filename, "w")

        f.write("Wiring Instructions:\n")
        newPhysical = deepcopy(self.physical)

        for (name, val) in newPhysical.iteritems():
            if val["virtual"]:
                continue
            for fpin, connect in list(enumerate(val["connections"])):
                if connect is not None:
                    if connect[2]:
                        continue
                    tName = connect[0]
                    tpin = connect[1]
                    f.write("Connect pin %d of %s to pin %d of %s\n" % (fpin, name, tpin, tName))
                    newPhysical[tName]["connections"][tpin][2] = True
                elif fpin in val["power"]["Vin"]:
                    if val["power"]["pullUp"]:
                        f.write("Connect pin %d of %s to Vin via resistor\n" % (fpin, name))
                    else:
                        f.write("Connect pin %d of %s to Vin\n" % (fpin, name))
                elif fpin in val["power"]["Ground"]:
                    if val["power"]["pullDown"]:
                        f.write("Connect pin %d of %s to ground via resistor\n" % (fpin, name))
                    else:
                        f.write("Connect pin %d of %s to ground\n" % (fpin, name))


