from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort
from svggen.api.targets.CppTarget import Cpp
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python


class Add(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Cpp : {
				"code": ""
				,

				"inputs": {
					"a@@name@@": None,
					"b@@name@@": None,
				},

				"outputs": {
					"c@@name@@" : "<<a@@name@@>> + <<b@@name@@>>"
				},

				"declarations": "",

				"needs": set()
			},

            Arduino: {
				"code": ""
				,

				"inputs": {
					"a@@name@@": None,
					"b@@name@@": None,
				},

				"outputs": {
					"c@@name@@" : "<<a@@name@@>> + <<b@@name@@>>"
				},

				"declarations": "",

                "setup": "",

				"needs": set()
			},
			Python: {
				"code": ""
				,

				"inputs": {
					"a@@name@@": None,
					"b@@name@@": None,
				},

				"outputs": {
					"c@@name@@": "<<a@@name@@>> + <<b@@name@@>>"
				},

				"setup": "",

				"needs": set()
			}
		}
		self.addInterface("inInt1", InIntPort(self, "inInt1", "a@@name@@"))
		self.addInterface("inInt2", InIntPort(self, "inInt2", "b@@name@@"))
		self.addInterface("outInt", OutIntPort(self, "outInt", "c@@name@@"))
		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass
