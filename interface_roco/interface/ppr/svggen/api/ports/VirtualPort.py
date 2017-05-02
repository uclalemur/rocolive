from svggen.api.ports import Port

class VirtualPort(Port):
    def __init__(self, parent, params, name, type, **kwargs):
        Port.__init__(self, parent, params, name, **kwargs)
        self.type = type

    def canMate(self, otherPort):
        if isinstance(otherPort, ContainerPort):
            return True
        return False

    def getComposable(self):
        self.parent.getComposable(self.type)

class ContainerPort(Port):
    def __init__(self, parent, params, name, type, **kwargs):
        Port.__init__(self, parent, params, name, **kwargs)
        self.type = type

    def canMate(self, otherPort):
        if isinstance(otherPort, VirtualPort):
            return True
        return False

    def getComposable(self):
        self.parent.getComposable(self.type)




