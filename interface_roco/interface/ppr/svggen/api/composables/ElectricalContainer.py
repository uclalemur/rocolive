from svggen.api.composables.ContainerComposable import ContainerComposable

class ElectricalContainer(ContainerComposable):

    def new(self):
        newContainer = ElectricalContainer()
        newContainer.virtuals = self.virtuals
        return newContainer

    def __init__(self, name, numPins=0):
        ContainerComposable.__init__(self)
        self.physical = {
            name: {
                "connections": [None] * numPins,
                "power": {
                    "Vin": [],
                    "Ground": [],
                    "pullDown": False,
                    "pullUp": False
            },
                "virtual": False
            }
        }

    def addVirtual(self, virtualName, containerName, virtual, connections):
        virtualName = self.removePrefix(virtualName)
        containerName = self.removePrefix(containerName)
        for connect in connections:
            self.physical[containerName]["connections"][connect[0]] = [connect[1][0], connect[1][1], False]
        self.virtuals[virtualName] = virtual

    def attach(self, fromPort, toPort, kwargs):
        pass

    def append(self, newComposable, newPrefix):
        ContainerComposable.append(self, newComposable, newPrefix)

    def makeOutput(self, filedir, **kwargs):
        pass