from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import DigitalInputPort, DigitalOutputPort, ElectricalPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

from svggen.api.composables.ElectricalComposable import ElectricalComposable


class DigitalLEDDriver(CodeComponent):
    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.meta = {
            Arduino: {
                "code": "void @@name@@(int level)\n" +
                        "{\n" +
                        "    digitalWrite(<<levelPin_@@name@@>>, level);\n" +
                        "}\n",

                "inputs": {
                    "led_level@@name@@": None,
                },

                "outputs": {
                    "driven": "@@name@@(<<led_level@@name@@>>)"
                },

                "declarations": "void @@name@@(int level);",

                "setup": "    pinMode(<<levelPin_@@name@@>>, OUTPUT);\n",

                "needs": set()
            },

            # Python: {
            #     "code": "def @@name@@(level):\n" +
            #             "    level@@name@@.write(level)\n" +
            #             "\n",
            #
            #     "inputs": {
            #         "led_level@@name@@": None,
            #     },
            #
            #     "outputs": {
            #         "driven": "@@name@@(<<led_level@@name@@>>)"
            #     },
            #
            #     "setup": "level@@name@@ = mraa.Pwm(<<levelPin_@@name@@>>)\n" + \
            #              "\n" + \
            #              "level@@name@@.enable(True)\n" + \
            #              "g@@name@@.enable(True)\n" + \
            #              "b@@name@@.enable(True)\n"
            #     ,
            #
            #     "needs": set(["mraa"])
            # }
        }

        self.addInterface("ledLevel", InIntPort(self, "inLevel", "led_level@@name@@"))

        self.addInterface("rOut", ElectricalPort(self, [0], virtual=True))
        self.addInterface("gOut", ElectricalPort(self, [2], virtual=True))
        self.addInterface("bOut", ElectricalPort(self, [3], virtual=True))

        self.addInterface("rPWM", PWMInputPort(self, [0], virtual=True))
        self.addInterface("gPWM", PWMInputPort(self, [2], virtual=True))
        self.addInterface("bPWM", PWMInputPort(self, [3], virtual=True))

        self.addParameter("rPin", "", isSymbol=False)
        self.addParameter("gPin", "", isSymbol=False)
        self.addParameter("bPin", "", isSymbol=False)

        CodeComponent.define(self)

    def getPinAlias(self, pin):
        return ["rPin", None, "gPin", "bPin"][pin[0]]

    def setPinParameter(self, pinName, pinValue):
        self.setParameter(pinName, pinValue, forceConstant=True)

    def getTokenSubs(self):
        return {
            "rPin_@@name@@".replace("@@name@@", self.getModifiedName()): self.getParameter("rPin"),
            "bPin_@@name@@".replace("@@name@@", self.getModifiedName()): self.getParameter("bPin"),
            "gPin_@@name@@".replace("@@name@@", self.getModifiedName()): self.getParameter("gPin")
        }

    def assemble(self):

        self.composables['electrical'] = ElectricalComposable(self.getName(), {
            "numPins": 4,
            "power": {
                "Vin": [],
                "Ground": [1]
            },
            "aliases": ["redpin", "cathode", "greenpin", "bluepin"],
        }, isVirtual=True)

        CodeComponent.assemble(self)
