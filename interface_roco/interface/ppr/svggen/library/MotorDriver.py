from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import PWMInputPort, PWMOutputPort, ElectricalPort, DigitalInputPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

from svggen.api.composables.ElectricalComposable import ElectricalComposable


class MotorDriver(Driver):
    def __init__(self, yamlFile=None, **kwargs):
        Driver.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.pmap = [None, None, "Pin"]

        self.physical = {
            "numPins": 3,
            "power": {
                "Vin": [1],
                "Ground": [0]
            },
            "aliases": ["Vin", "ground", "PWMin"]
        }

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                    "in_@@name@@": None,
                },

                "outputs": {
                    "driven": "analogWrite(<<Pin_@@name@@>>, <<in_@@name@@>>)"
                },

                "declarations": "",

                "setup": "pinMode(<<Pin_@@name@@>>, OUTPUT);\n",

                "needs": set([])
            }
        }

        self.addInterface("inInt", InIntPort(self, "inInt", "in_@@name@@"))
        self.addInterface("eOut", ElectricalPort(self, [2], virtual=True))
        self.addInterface("PWMin", PWMInputPort(self, [2], virtual=True))

        self.addParameter("Pin", "", isSymbol=False)

        Driver.define(self)