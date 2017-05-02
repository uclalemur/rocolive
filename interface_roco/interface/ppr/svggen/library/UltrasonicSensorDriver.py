from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import DigitalInputPort, PWMOutputPort, ElectricalPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

from svggen.api.composables.ElectricalComposable import ElectricalComposable


class UltrasonicSensorDriver(Driver):
    def __init__(self, yamlFile=None, **kwargs):
        Driver.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        Driver.define(self)

        self.physical = {
            "numPins": 4,
            "power": {
                "Vin": [],
                "Ground": [],
            },
            "aliases": ["vcc", "trigger", "echo", "ground"],
        }

        self.meta = {
            Arduino: {
                "code": "int read_@@name@@()\n" +
                        "{\n" +
                        "    int t1 = 0, t2 = 0;\n"
                        "    digitalWrite(<<tPin_@@name@@>>, HIGH);\n"
                        "    delayMicroseconds(10);\n"
                        "    digitalWrite(<<tPin_@@name@@>>, LOW);\n"
                        "\n"+
                        "    while (digitalRead(<<ePin_@@name@@>>) == 0);\n"
                        "    t1 = micros();\n"
                        "    while (digitalRead(<<ePin_@@name@@>>) == 1);\n"
                        "    t2 = micros();\n"
                        "\n"
                        "    return t2 - t1;\n"
                        "}\n",

                "inputs": {
                },

                "outputs": {
                    "pulse_@@name@@": "read_@@name@@()"
                },

                "declarations": "int read_@@name@@();",

                "setup": "    pinMode(<<tPin_@@name@@>>, OUTPUT);\n" + \
                         "    pinMode(<<ePin_@@name@@>>, OUTPUT);\n",

                "needs": set()
            }
        }

        self.addInterface("outInt", OutIntPort(self, "outInt", "pulse_@@name@@"))

        self.addInterface("tOut", ElectricalPort(self, [1], virtual=True))
        self.addInterface("eOut", ElectricalPort(self, [2], virtual=True))

        self.addInterface("triggerIn", DigitalInputPort(self, [1], virtual=True))
        self.addInterface("echoIn", DigitalInputPort(self, [2], virtual=True))

        self.addParameter("tPin", "", isSymbol=False)
        self.addParameter("ePin", "", isSymbol=False)

        self.pmap = [None, "tPin", "ePin", None]