from svggen.api.composables.Composable import Composable


class VirtualComposable(Composable):

    def __init__(self):
        self.container = None

    def setContainer(self, container):
        self.container = container

    def getContainer(self):
        return self.container

    def makeOutput(self, filedir, **kwargs):
        #if self.container is None:
        #    raise Exception("Error: VirtualComposable has no Container!")
        pass

