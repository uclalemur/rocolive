from svggen.api.component import Component

c = Component()
c.addSubcomponent("dummy1", "Dummy1")
c.addSubcomponent("dummyp", "DummyPassThrough")
c.addSubcomponent("dummy2", "Dummy2")
c.addConnection(("dummy1", "dOut"), ("dummyp", "vIn"))
c.addConnection(("dummyp", "vOut"), ("dummy2", "dIn"))
c.toYaml("library/Dummy.yaml")

