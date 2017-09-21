class Target(object):

    def __init__(self, composable, meta, name=""):
        self.composable = composable
        self.meta = meta
        self.name = name

    def __str__(self):
        return "Target"

    def mange(self, name):
        raise NotImplementedError

    def append(self, newComposable, newPrefix):
        raise NotImplementedError

    def attach(self, fromPort, toPort, kwargs):
        raise NotImplementedError

    def evalConstraints(self):
        raise NotImplementedError

    def makeOutput(self, filedir, **kwargs):
        raise NotImplementedError