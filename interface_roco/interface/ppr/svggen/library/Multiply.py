from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort



class multiply(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

		self.meta = {
			"arduino": {
				"code": "" + \
					"@@name@@item = (int)(<<@@name@@one>> * <<@@name@@two>>);\n"
				,

				"inputs": {
					"@@name@@one": None,
					"@@name@@two": None,
				},

				"outputs": {
					"@@name@@three" : "@@name@@item",
				},

				"declarations": "int @@name@@item;\n",
				"needs": set()
			}
		}

	def define(self, **kwargs):
		CodeComponent.define(self, **kwargs)
		self.addInterface("inInt1", InIntPort(self, "inInt1", "@@name@@one"))
		self.addInterface("inInt2", InIntPort(self, "inInt2", "@@name@@two"))
		self.addInterface("outInt", InIntPort(self, "outInt", "@@name@@three))

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass
