from svggen.api.composables.Composable import Composable
from svggen.api.composables.CodeContainer import CodeContainer
from svggen.api.composables.VirtualComposable import VirtualComposable
from svggen.api.ports.CodePort import CodePort

class CodeComposable(VirtualComposable):

    def new(self):
        newMeta = dict()
        for (target, meta) in self.meta.iteritems():
            newMeta[target] = target(self, meta).new()
        return self.__class__(newMeta)

    def __init__(self, meta):
        VirtualComposable.__init__(self)
        self.meta = meta
        self.components = set()

    def addComponent(self, componentObj):
        self.components.add(componentObj)

    def removeTarget(self, target):
        self.meta.pop(target)

    def append(self, newComposable, newPrefix):
        toRemove = []
        for (target, meta) in self.meta.iteritems():
            try:
                self.meta[target] = target(self, meta).append(newComposable.meta[target], newPrefix)
            except KeyError:
                print("Target: %s not supported!" % str(target(self, meta)))
                toRemove.append(target)

        #for target in toRemove:
        #    self.removeTarget(target)

        self.components = self.components.union(newComposable.components)

    def subParameter(self, token, value):
        for (target, meta) in self.meta.iteritems():
            if meta is None:
                continue
            self.meta[target] = target(self, meta).subParameter(token, value)

    def attach(self, fromPort, toPort, kwargs):
        if not isinstance(fromPort, CodePort) or not isinstance(toPort, CodePort):
            return

        if not fromPort.canMate(toPort) or not toPort.canMate(fromPort):
            raise Exception("%s cannot mate to %s!" % (fromPort.__class__, toPort.__class__))

        for (target, meta) in self.meta.iteritems():
            self.meta[target] = target(self, meta).attach(fromPort, toPort, kwargs)

    def makeOutput(self, filedir, **kwargs):
        from svggen.api.CodeComponent import CodeComponent

        subs = dict()

        for component in self.components:
            if isinstance(component, CodeComponent):
                print "Component:", component
                print "Token Subs", component.getTokenSubs()
                subs.update(component.getTokenSubs())

        print "subs", subs
        for (target, meta) in self.meta.iteritems():
            self.meta[target] = target(self,meta).subParameters(subs)

        print "Cmomposable Meta:", self.meta
        print "Length: ", len(self.meta)

        for (target, meta) in self.meta.iteritems():
            target(self, meta).makeOutput(filedir, **kwargs)
