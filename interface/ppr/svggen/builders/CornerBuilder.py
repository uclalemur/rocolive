from svggen.library import getComponent
from svggen.api.component import Component

c = Component()
c.addSubcomponent("rect1", "Rectangle")
c.addSubcomponent("rect2", "Rectangle")
c.addSubcomponent("rect3", "Rectangle")

c.addConnection(("rect1", "r"), ("rect2", "l"), angle=90)
c.addConnection(("rect2", "b"), ("rect3", "r"), angle=90)
c.addConnection(("rect3", "t"), ("rect1", "b"), angle=90)

c.toYaml("library/corner.yaml")
c.make()
print(c.getRelations())