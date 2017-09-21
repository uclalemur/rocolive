from svggen.api.composables.Composable import Composable
from copy import deepcopy

class DummyComposable2(Composable):

    def new(self):
        return deepcopy(self)

    def __init__(self, name):
        self.names = [name]

    def append(self, newComposable, newPrefix):
        self.names = list(set(self.names).union(set(newComposable.names)))
        print("Appending %s to DummyComposable2" % newPrefix)

    def attach(self, fromPort, toPort, kwargs):
        print("Attaching %s to %s on DummyComposable2" % (fromPort.getName(), toPort.getName()))

    def makeOutput(self, filedir, **kwargs):
        f = open("%s/dummy2" % filedir, "w")
        f.write("This is a dummy2 file\n")
        for name in self.names:
            f.write("%s\n" % name)
        f.close()