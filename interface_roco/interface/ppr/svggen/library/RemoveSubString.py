from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.InStringPort import InStringPort
from svggen.api.ports.OutStringPort import OutStringPort
from svggen.api.CodeComponent import CodeComponent

class RemoveSubString(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)

    def assemble(self):
        functionName = "remove_substr"
        source = \
            "std::string remove_substr(){\n" + \
            "    std::string str = @@InStr1@@;\n" + \
            "    std::string pattern = @@InStr2@@;\n" + \
            "    std::string::size_type i = str.find(pattern);\n\n" + \
            "    while (i != std::string::npos) {\n" + \
            "        str.erase(i, pattern.length());\n" + \
            "        i = str.find(pattern, i);\n" + \
            "    }\n\n" + \
            "    return str;\n" + \
            "}\n"
        functionCall = "remove_substr()"
        functionDeclaration = "std::string remove_substr();"
        needs = ["iostream", "string"]

        self.addInterface("outStr", OutStringPort(self, functionName))
        self.addInterface("inStr1", InStringPort(self, functionName, "InStr1"))
        self.addInterface("inStr2", InStringPort(self, functionName, "InStr2"))
        code = CodeComposable(functionName, functionCall, functionDeclaration, source, needs)
        self.composables['code'] = code

if __name__ == "__main__":
    pass