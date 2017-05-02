from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutIntPort
from svggen.api.CodeComponent import CodeComponent

class Len(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        name = self.getName()
        self.setParameter("meta", {
            "cpp": {
                "name": name,
                "invocation": "%s(@@InStr@@)" % name,
                "declaration": "int %s(std::string);" % name,
                "source": \
                    "int %s(std::string str)" % name + \
                    "{\n" + \
                    "    return str.length();\n" + \
                    "}\n\n",
                "needs": ["iostream", "string"]
            },
            "python": {
                "name": name,
                "invocation": "len(@@InStr@@)",
                "source": "",
                "needs": []
            }
        }, forceConstant=True)
        self.addInterface("inStr", InStringPort(self, name, "InStr", True))
        self.addInterface("outInt", OutIntPort(self, name))

