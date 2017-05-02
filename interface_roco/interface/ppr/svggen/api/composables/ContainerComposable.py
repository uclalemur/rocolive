from svggen.api.composables.Composable import Composable


class ContainerComposable(Composable):

    def new(self):
        newContainer = ContainerComposable()
        newContainer.virtuals = self.virtuals
        # for (virtual, pin) in self.virtuals.iteritems():
        #     virtual.setContainer(newContainer)
        return newContainer

    def __init__(self, meta=None):
        self.virtuals = dict()

    def attach(self, fromPort, toPort, kwargs):
        pass

    def append(self, newComposable, newPrefix):
        self.virtuals.update(newComposable.virtuals)

    def addVirtual(self, name, virtual, pin):
        self.virtuals[name] = pin
        virtual.setContainer(self)

    def getPin(self, name):
        return self.virtuals[name]

    def makeOutput(self, filedir, **kwargs):
        return