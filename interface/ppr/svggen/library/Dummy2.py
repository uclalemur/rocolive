from svggen.api.composables.DummyComposable1 import DummyComposable1
from svggen.api.composables.DummyComposable2 import DummyComposable2
from svggen.api.ports.DummyPort import DummyPort
from svggen.api.component import Component


class Dummy2(Component):

    def define(self, **kwargs):
        self.addInterface("dIn", DummyPort(self, {}, "dummy2"))

    def assemble(self):
        self.composables['dummy1'] = DummyComposable1(self.getName())
