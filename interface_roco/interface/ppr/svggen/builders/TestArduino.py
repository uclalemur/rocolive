from svggen.library import *

c = Component()
c.addSubcomponent("ps", "PrintString")
c.addSubcomponent("gs", "GetString")
c.addConnection(("gs", "outStr"), ("ps", "inStr"))
c.toYaml("GetAndPut.yaml")
c.makeOutput("output/GetAndPut/")