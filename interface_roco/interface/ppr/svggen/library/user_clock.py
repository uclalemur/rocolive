from svggen.api.targets.PythonTarget import Python
from svggen.api.targets.ArduinoTarget import Arduino

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import OutIntPort



class user_clock(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Arduino: {
				"inputs": {
				},

				"outputs": {
					"clk@@name@@" : "@@name@@clk",
				},

				"declarations": ("int @@name@@clk;\n")				,

				"setup":  "@@name@@clk = (int)(0);\n" 
				,

				"code": ( "    @@name@@clk = (int)(!@@name@@clk);\n" 
					"        delay( 500 );\n" 
					"    \n" )
				,

				"needs": set()
			},

		}

		self.addInterface("clk", OutIntPort(self, "clk", "clk@@name@@"))
		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass

