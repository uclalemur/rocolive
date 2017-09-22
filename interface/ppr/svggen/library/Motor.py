from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort

class Motor(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        ElectricalComponent.define(self)

        self.physical =  {
            "numPins": 3,
            "power": {
                "Vin": [1],
                "Ground": [0]
            },
            "aliases": ["Vin", "ground", "PWMin"]
        }

        self.addInterface('eIn', ElectricalPort(self, [2]))

    def assemble(self):
        ElectricalComponent.assemble(self)