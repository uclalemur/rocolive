from CppComposable import CppComposable
from CodeComposable import CodeComposable
from svggen.api.ports.DataPort import DataPort
from svggen.api.ports.CodePort import CodePort
from Composable import Composable
from CodeContainer import CodeContainer
from VirtualComposable import VirtualComposable

class ArduinoComposable(CppComposable):

    def new(self):
        new_composable = self.__class__({
            "name": "",
            "source": "",
            "declaration": "",
            "invocation": "",
            "setup": ""
        }, set())

        new_composable.meta = self.meta
        new_composable.needs = self.needs
        new_composable.container = self.container
        return new_composable

    def __init__(self, meta, needs=None):
        CppComposable.__init__(self, meta, needs)

    def updateMeta(self, name, newMeta):
        meta = self.sanitize(newMeta)
        name = self.removePrefix(name)

        self.meta[name] = {
                "source": meta["source"],
                "invocation": meta["invocation"],
                "arguments": dict(),
                "parameters": dict(),
                "callers": list(),
                "declaration": meta["declaration"],
                "setup": meta["setup"],
        }
        try:
            needs = meta["needs"]
            self.needs = set(needs)
        except KeyError:
            return

    def makeOutput(self, filedir, **kwargs):
        CodeComposable.makeOutput(self, filedir, **kwargs)

        roots = self.find_roots()
        for root in roots:
            self.replace_tokens(root, self.meta[root])

        filename = "%s/main.ino" % filedir
        f = open(filename, "w")

        for include in self.needs:
            f.write("#include <" + include + ">\n")

        f.write("\n")

        for (key, val) in self.meta.iteritems():
            if len(val["declaration"]):
                f.write(val["declaration"] + ";\n")


        f.write("\nvoid setup()\n" +
                "{\n" +
                "    %s" % "".join([val["setup"] + ";\n" if val["setup"] != "" else ""
                                    for (key, val) in self.meta.iteritems()]) +
                "}\n\n")

        f.write(
            "\nvoid loop()\n" +
            "{\n" +
            "    %s" % "".join([self.meta[root]["invocation"] + ";\n" for root in roots]) +
            "}\n\n")

        for (key, val) in self.meta.iteritems():
            f.write(val["source"] + "\n")
        f.close()
