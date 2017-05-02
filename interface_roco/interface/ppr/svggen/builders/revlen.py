from svggen.api.component import Component
from svggen.library import *
from svggen.library import getComponent
from svggen.library.F import F


c = Component()
c.addSubcomponent("rev", "ReverseString")
c.addSubcomponent("sort", "SortString")
c.addConnection(("rev", "outStr"), ("sort", "inStr"))
c.inheritInterface("in", ("rev", "inStr"))
c.inheritInterface("out", ("sort", "outStr"))
c.toYaml("library/revLen.yaml")