from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutIntPort
from svggen.api.CodeComponent import CodeComponent

class IntegerSource(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        self.addConstant("val", 0, isSymbol=False)

    def assemble(self):
        num = self.getParameter("val")
        self.setParameter("meta", {
                "cpp": {
                    "name": str(num),
                    "invocation": str(num),
                    "declaration": "",
                    "source": "",
                    "needs": []
            }
        }, forceConstant=True)
        self.addInterface("outStr", OutIntPort(self, str(num)))
        CodeComponent.assemble(self)

if __name__ == "__main__":
    pass
