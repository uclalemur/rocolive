from svggen.api.composables.DummyComposable1 import DummyComposable1
from svggen.api.composables.DummyComposable2 import DummyComposable2
from svggen.api.ports.DummyPort import DummyPort
from svggen.api.component import Component

class Dummy1(Component):

    def define(self, **kwargs):
        self.addInterface("dOut", DummyPort(self, {}, "dummy1"))

    def assemble(self):
        self.composables['dummy1'] = DummyComposable1(self.getName())
