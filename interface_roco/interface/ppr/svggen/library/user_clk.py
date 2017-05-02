from svggen.api.targets.PythonTarget import Python
from svggen.api.targets.ArduinoTarget import Arduino

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import OutIntPort



class user_clk(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Arduino: {
				"code": ""				,

				"inputs": {
				},

				"outputs": {
					"out@@name@@" : "@@name@@item",
				},

				"declarations": ("int @@name@@item;\n")				,

				"setup":  "@@name@@item = (int)(0);\n" 
				,

				"loop": ( "    @@name@@item = (int)(!@@name@@item);\n" 
					"        delay( 500 );\n" 
					"    \n" )
				,

				"needs": set()
			},

		}

		self.addInterface("out", OutIntPort(self, "out", "out@@name@@"))
		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass

