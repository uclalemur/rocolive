from svggen.api.component import Component

c = Component()
c.addSubcomponent("rect1", "Rectangle")
c.addSubcomponent("rect2", "Rectangle")
c.addSubcomponent("rect3", "Rectangle")

## Connect Edges....

c.toYaml("library/corner.yaml")










