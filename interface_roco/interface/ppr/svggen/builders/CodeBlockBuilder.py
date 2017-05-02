from svggen.library import *

## ReverseSort
c = Component()
c.addSubcomponent("sort_string", "SortString")
c.addSubcomponent("reverse_string", "ReverseString")
c.addConnection(("sort_string", "outStr"), ("reverse_string", "inStr"))
c.inheritInterface("inStr", ("sort_string", "inStr"))
c.inheritInterface("outStr", ("reverse_string", "outStr"))
c.toYaml("library/ReverseSort.yaml")


## PutString
c = Component()
c.addSubcomponent("str", "StringSource")
c.addSubcomponent("print", "PrintString")
c.addConnection(("str", "outStr"), ("print", "inStr"))
c.toYaml("library/PutString.yaml")


## getColor
c = Component()
c.addSubcomponent("Red", "LinearInterpolate")
c.setSubParameter(("Red", "inStart"), 0)
c.setSubParameter(("Red", "inEnd"), 511)
c.setSubParameter(("Red", "outStart"), 255)
c.setSubParameter(("Red", "outEnd"), 0)

c.addSubcomponent("Green1", "LinearInterpolate")
c.setSubParameter(("Green1", "inStart"), 0)
c.setSubParameter(("Green1", "inEnd"), 511)
c.setSubParameter(("Green1", "outStart"), 0)
c.setSubParameter(("Green1", "outEnd"), 255)

c.addSubcomponent("Green2", "LinearInterpolate")
c.setSubParameter(("Green2", "inStart"), 511)
c.setSubParameter(("Green2", "inEnd"), 1023)
c.setSubParameter(("Green2", "outStart"), 255)
c.setSubParameter(("Green2", "outEnd"), 0)

c.addSubcomponent("Blue", "LinearInterpolate")
c.setSubParameter(("Blue", "inStart"), 511)
c.setSubParameter(("Blue", "inEnd"), 1023)
c.setSubParameter(("Blue", "outStart"), 0)
c.setSubParameter(("Blue", "outEnd"), 255)

c.addSubcomponent("add", "Add")
c.addSubcomponent("Split", "SplitFour")

c.addConnection(("Split", "out1"), ("Red", "inInt"))
c.addConnection(("Split", "out2"), ("Green1", "inInt"))
c.addConnection(("Split", "out3"), ("Green2", "inInt"))
c.addConnection(("Split", "out4"), ("Blue", "inInt"))
c.addConnection(("Green1", "outInt"), ("add", "inInt1"))
c.addConnection(("Green2", "outInt"), ("add", "inInt2"))

c.inheritInterface("red", ("Red", "outInt"))
c.inheritInterface("green", ("add", "outInt"))
c.inheritInterface("blue", ("Blue", "outInt"))

c.inheritInterface("inInt", ("Split", "in"))

c.toYaml("library/GetColor.yaml")







