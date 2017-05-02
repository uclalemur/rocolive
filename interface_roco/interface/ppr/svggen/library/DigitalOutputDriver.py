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


class DigitalOutputDriver(Driver):
    def __init__(self, yamlFile=None, **kwargs):
        self.aliases = ["Pin", None]

        Driver.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        Driver.define(self)

        self.physical = {
            "numPins": 1,
            "power": {
                "Vin": [],
                "Ground": []
            },
            "aliases": ["Pin"],
        }

        self.pmap = ["Pin", None]

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                    "in_@@name@@": None,
                },

                "outputs": {
                    "driven": "digitalWrite(<<Pin_@@name@@>>, <<in_@@name@@>>)"
                },

                "declarations": "",

                "setup": "    pinMode(<<Pin_@@name@@>>, OUTPUT);\n",

                "needs": set()
            }
        }

        self.addInterface("inInt", InIntPort(self, "inInt", "in_@@name@@"))
        self.addInterface("eOut", ElectricalPort(self, [0], virtual=True))
        self.addInterface("Din", DigitalInputPort(self, [0], virtual=True))

        self.addParameter("Pin", "", isSymbol=False)
