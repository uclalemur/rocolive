from svggen.api.component import Component
from svggen.library import *
from svggen.library import getComponent
from svggen.library.F import F


c = Component()
c.addSubcomponent("user_clock0", "user_clock")

c.inheritInterface("name", ("user", "clock_clk"))
c.toYaml("library/user_name.yaml")