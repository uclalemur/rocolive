from svggen.api.component import Component
from svggen.library import *
from svggen.library import getComponent
from svggen.library.F import F


c = Component()
c.addSubcomponent("UISlider0", "UISlider")
c.setSubParameter(("UISlider0", "max"), 1023)
c.setSubParameter(("UISlider0", "min"), 0)

c.addSubcomponent("DrivenServo0", "DrivenServo")

c.addSubcomponent("NodeMCU1", "NodeMCU")

c.addConnection(("NodeMCU1", "do1"), ("DrivenServo0", "PWMin"))
c.addConnection(("UISlider0", "outInt"), ("DrivenServo0", "inInt"))
c.toYaml("library/user_demo.yaml")