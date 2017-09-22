from svggen.api.composables.ContainerComposable import ContainerComposable

class CodeContainer(ContainerComposable):

    def new(self):
        newContainer = CodeContainer()
        newContainer.virtuals = self.virtuals
        return newContainer

    def addVirtual(self, name, virtual, pin):
        self.virtuals[name] = pin
        virtual.setContainer(self)

    def attach(self, fromPort, toPort, kwargs):
        pass

    def append(self, newComposable, newPrefix):
        ContainerComposable.append(self, newComposable, newPrefix)

    def makeOutput(self, filedir, **kwargs):
        pass