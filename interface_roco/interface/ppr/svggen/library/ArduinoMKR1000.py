from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import AnalogInputPort, DigitalInputPort, DigitalOutputPort, PWMOutputPort
from svggen.api.composables.ContainerComposable import ContainerComposable
from svggen.api.composables.CodeContainer import CodeContainer
from svggen.api.composables.ElectricalContainer import ElectricalContainer
from svggen.api.composables.ElectricalComposable import ElectricalComposable

class ArduinoMKR1000(Component):

    def define(self, **kwargs):
        for n in range(0, 6):
            self.addInterface("a%d" % (n+1), AnalogInputPort(self, [n+14]))

        for n in range(0, 18):
            self.addInterface("di%d" % (n+1), DigitalInputPort(self,[n]))
            self.addInterface("do%d" % (n+1), DigitalOutputPort(self,[n]))

        for n in range(0, 18):
            self.addParameter("pin%d" % n, [], isSymbol=False)

        self.addInterface("pwm1", PWMOutputPort(self, [2]))
        self.addInterface("pwm2", PWMOutputPort(self, [3]))
        self.addInterface("pwm3", PWMOutputPort(self, [4]))
        self.addInterface("pwm4", PWMOutputPort(self, [5]))

    def setPinParameter(self, pinName, pinValue):
        pass

    def getPinIndices(self, pins):
        return [self.pinIndices[i] for i in pins]

    def getPinAlias(self, pin):
        if not isinstance(pin, list):
            return [str(pin)]
        if isinstance(pin[0], int):
            return [str(i) for i in pin]
        return pin

    def assemble(self):
        #self.composables['code'] = CodeContainer()
        #self.composables['electrical'] = ElectricalContainer(self.getName(), 19)
        self.composables['electrical'] = ElectricalComposable(self.getName(), {
                "numPins": 19,
                "power": {
                    "Vin": [],
                    "Ground": [],
                },
                "aliases": ["pin 0", "pin 1", "pin 2", "pin 3", "pin 4", "pin 5", "pin 6",
                            "pin 7", "pin 8", "pin 9", "pin 10", "pin 11", "pin 12", "pin 13",
                            "A0", "A1", "A2", "A3", "A4", "A5"]
            })