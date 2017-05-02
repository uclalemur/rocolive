from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import AnalogInputPort, DigitalInputPort, DigitalOutputPort, PWMOutputPort
from svggen.api.composables.ContainerComposable import ContainerComposable
from svggen.api.composables.CodeContainer import CodeContainer
from svggen.api.composables.ElectricalContainer import ElectricalContainer
from svggen.api.composables.ElectricalComposable import ElectricalComposable


class NodeMCU(Component):

    def define(self, **kwargs):
        self.pinIndices = dict()

        for n in range(0, 1):
            self.addInterface("a%d" % (n+1), AnalogInputPort(self, ["A%d" % n]))
            self.addParameter("A%d" % n, [], isSymbol=False)
            self.pinIndices["A%d" % n] = n + 14

        for n in range(0, 9):
            self.addInterface("di%d" % n, DigitalInputPort(self,["D%d" % n]))
            self.addInterface("do%d" % n, DigitalOutputPort(self,["D%d" % n]))
            self.pinIndices["D%d" % n] = n
            self.addParameter("D%d" % n, [], isSymbol=False)

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
                "numPins": 10,
                "power": {
                    "Vin": [],
                    "Ground": [],
                },
                "aliases": ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "A0"]
            })