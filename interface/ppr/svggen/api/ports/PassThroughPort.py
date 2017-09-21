from svggen.api.ports.Port import Port

class PassThroughPort(Port):
    def __init__(self, parent, params, name, **kwargs):
        Port.__init__(self, parent, params, name, **kwargs)

