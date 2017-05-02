from svggen.api.composables.Composable import Composable
from svggen.api.ports.ElectricalPort import ElectricalPort
from copy import copy, deepcopy

class ElectricalComposable(Composable):

    def new(self):
        cc = deepcopy(self)
        #cc.physical = dict()
        return cc

    def __init__(self, name, physical, isVirtual=False):
        self.physical = dict()
        self.physical[name] = dict()
        self.physical[name]["power"] = physical["power"]
        self.physical[name]["aliases"] = physical["aliases"]
        self.physical[name]["connections"] = [list() for i in range(physical["numPins"])]
        self.physical[name]["virtual"] = isVirtual

    def resolveVirtuals(self):
        for (cName, cVal) in self.physical.iteritems():
           if not cVal["virtual"]:
               continue
           for cc in cVal["connections"]:
               if cc:
                   self.physical[cc[0][0]]["connections"][cc[0][1]] = cc[1]
                   self.physical[cc[1][0]]["connections"][cc[1][1]] = cc[0]


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
        self.physical.update(newComposable.physical)

    def makeOutput(self, filedir, **kwargs):
        filename = "%s/wiring_instructions.txt" % filedir
        f = open(filename, "w")

        f.write("Wiring Instructions:\n")
        self.resolveVirtuals()

        newPhysical = deepcopy(self.physical)

        for (name, val) in newPhysical.iteritems():
            if "Component." in name:
                name = name.replace("Component.", "")

            if val["virtual"]:
                continue
            for fPin, connect in list(enumerate(val["connections"])):
                fPinName = val["aliases"][fPin]
                if connect:
                    if connect[2]:
                        continue

                    tName = connect[0]
                    tPin = connect[1]
                    tPinName = newPhysical[tName]["aliases"][tPin]
                    newPhysical[tName]["connections"][tPin][2] = True

                    if "Component." in tName:
                        tName = tName.replace("Component.", "")

                    f.write("Connect %s on %s to %s on %s\n" % (fPinName, name, tPinName, tName))
                elif fPin in val["power"]["Vin"]:
                    f.write("Connect %s on %s to Vout\n" % (fPinName, name))
                elif fPin in val["power"]["Ground"]:
                    f.write("Connect %s on %s to ground\n" % (fPinName, name))
