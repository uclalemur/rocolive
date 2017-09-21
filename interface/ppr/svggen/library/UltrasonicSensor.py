from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort



class UltrasonicSensor(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        ElectricalComponent.define(self)

        self.physical = {
            "numPins": 4,
            "power": {
                "Vin": [0],
                "Ground": [3],
            },
            "aliases": ["vcc", "trigger", "echo", "ground"],
        }

        self.addInterface("trigger", ElectricalPort(self, [1]))
        self.addInterface("echo", ElectricalPort(self, [2]))

    def assemble(self):
        ElectricalComponent.assemble(self)
