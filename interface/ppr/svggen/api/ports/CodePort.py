from svggen.api.ports.Port import Port

class CodePort(Port):
    def __init__(self, parent, name, label, dtype=None, **kwargs):
        Port.__init__(self, parent, {}, **kwargs)
        self.addParameter("label", label, isSymbol=False)
        self.type = dtype
        self.setName(name)
        self.label = label

    def canMate(self, otherPort):
        if self.type is None or otherPort.type is None:
            return True
        return self.type == otherPort.type

    def constrain(self, parent, toPort,  **kwargs):
        constraints = []

        for p in self.parameters:
            if p in toPort.parameters:
                constraints.append((self.getParameter(p), toPort.getParameter(p)))
        return constraints

    def getLabel(self):
        return self.getParameter("label")

    def mangle(self, name):
        label = self.label.replace("@@name@@", name)
        self.setParameter("label", label, forceConstant=True) ## TODO: this shouldn't require forceConstant=True

class OutPort(CodePort):
    def __init__(self, parent, name, label, dtype=None, **kwargs):
        CodePort.__init__(self, parent, name, label, dtype, **kwargs)
        self.addAllowableMate(self.__class__)

    def canMate(self, otherPort):
        return CodePort.canMate(self, otherPort) and isinstance(otherPort, InPort)

class InPort(CodePort):
    def __init__(self, parent, name, label, dtype=None, **kwargs):
        CodePort.__init__(self, parent, name, label, dtype, **kwargs)
        self.addAllowableMate(self.__class__)

    def canMate(self, otherPort):
        return CodePort.canMate(self, otherPort) and isinstance(otherPort, OutPort)

class InStringPort(InPort):
    def __init__(self, parent, name, label, is_arg=False, **kwargs):
        InPort.__init__(self, parent, name, label, dtype="string", **kwargs)
        self.addAllowableMate(self.__class__)

class OutStringPort(OutPort):
    def __init__(self, parent, name,  label, **kwargs):
        OutPort.__init__(self, parent, name, label, dtype="string", **kwargs)
        self.addAllowableMate(self.__class__)

class InIntPort(InPort):
    def __init__(self, parent, name, label, is_arg=False, **kwargs):
        InPort.__init__(self, parent, name, label, dtype="int", **kwargs)
        self.addAllowableMate(self.__class__)

class OutIntPort(OutPort):
    def __init__(self, parent, name, label, **kwargs):
        OutPort.__init__(self, parent, name, label, dtype="int", **kwargs)
        self.addAllowableMate(self.__class__)

class InFloatPort(InPort):
    def __init__(self, parent, name, label, is_arg=False, **kwargs):
        InPort.__init__(self, parent, name, label, dtype="float", **kwargs)
        self.addAllowableMate(self.__class__)

class OutFloatPort(OutPort):
    def __init__(self, parent, name, label, **kwargs):
        OutPort.__init__(self, parent, name, label, dtype="float", **kwargs)
        self.addAllowableMate(self.__class__)

class InDoublePort(InPort):
    def __init__(self, parent, name, label, is_arg=False, **kwargs):
        InPort.__init__(self, parent, name, label, dtype="double", **kwargs)
        self.addAllowableMate(self.__class__)

class OutDoublePort(OutPort):
    def __init__(self, parent, name, label, **kwargs):
        OutPort.__init__(self, parent, name, label, dtype="double", **kwargs)
        self.addAllowableMate(self.__class__)





