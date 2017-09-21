from svggen.api.composables.DummyComposable1 import DummyComposable1
from svggen.api.composables.DummyComposable2 import DummyComposable2
from svggen.api.ports.DummyPort import DummyPort
from svggen.api.component import Component

class DummyPassThrough(Component):

    def define(self, **kwargs):
        self.addVirtualInterfacePair(("vIn", "vOut"))

    def assemble(self):
        self.composables['dummy2'] = DummyComposable2(self.getName())
