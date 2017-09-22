from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort


class Pot(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        ElectricalComponent.define(self)
        self.physical = {
            "numPins": 3,
            "power": {
                "Vin": [0],
                "Ground": [2]
            },
            "aliases": ["first pin", "center pin", "last pin"],
        }
        self.addInterface("vOut", ElectricalPort(self, [1]))


    def assemble(self):
        ElectricalComponent.assemble(self)

