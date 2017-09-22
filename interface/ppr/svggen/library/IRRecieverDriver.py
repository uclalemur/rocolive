from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import PWMInputPort, PWMOutputPort, ElectricalPort, DigitalInputPort, AnalogOutputPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

from svggen.api.composables.ElectricalComposable import ElectricalComposable


class LEDDriver(CodeComponent):
    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.addParameter("pin", "", isSymbol=False)

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "analog@@name@@": "analogRead(<<pin_@@name@@>>)"
                },

                "declarations": "",
                "setup": "",
                "needs": set()
            },

            Python: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "analog@@name@@": "aio_@@name@@.readFloat()"
                },

                "setup": "aio_@@name@@ = mraa.Aio(<<pin_@@name@@>>)\n",
                "needs": set(["mraa"])
            }

        }
        self.addInterface("vIn", ElectricalPort(self, [0], virtual=True))
        self.addInterface("aOut", AnalogOutputPort(self, [0], virtual=True))
        self.addInterface("outInt", OutIntPort(self, "outInt", "analog@@name@@"))

        CodeComponent.define(self, **kwargs)

    def getPinAlias(self, pin):
        return ["pin", None][pin[0]]

    def setPinParameter(self, pinName, pinValue):
        self.setParameter(pinName, pinValue, forceConstant=True)

    def getTokenSubs(self):
        return {
            "pin_@@name@@".replace("@@name@@", self.getModifiedName()): self.getParameter("pin")
        }

    def assemble(self):

        self.composables['electrical'] = ElectricalComposable(self.getName(), {
            "numPins": 3,
            "power": {
                "Vin": [2],
                "Ground": [1]
            },
            "aliases": ["output", "ground", "vin"]
        }, isVirtual=True)

        CodeComponent.assemble(self)