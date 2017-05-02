from svggen.api.ports.Port import Port

class DummyPort(Port):
    def __init__(self, parent, params, names, **kwargs):
        Port.__init__(self, parent, params, names, **kwargs)

