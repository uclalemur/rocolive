from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutStringPort
from svggen.api.CodeComponent import CodeComponent

class ConcatenateString(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        self.addConstant("NumStrings", kwargs["NumStrings"])


    def assemble(self):
        name = self.getName()
        num_strings = self.getParameter("NumStrings")

        for i in range(1, num_strings + 1):
            self.addInterface("inStr%d" % i, InStringPort(self, name, "InStr%d" % i, True))

        self.setParameter("meta", {
            "cpp": {
                "name": name,
                "invocation": "".join(["std::string(@@InStr%d@@) + " % i for i in range(1, num_strings + 1)])[0:-3],
                "declaration": "",
                "source": "",
                "needs": ["iostream", "string"]
            }
        }, forceConstant=True)

        self.addInterface("outStr", OutStringPort(self, name))
        CodeComponent.assemble(self)

if __name__ == "__main__":
    pass
