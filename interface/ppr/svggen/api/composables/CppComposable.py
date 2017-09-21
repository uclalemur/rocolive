from Composable import Composable
from CodeComposable import CodeComposable


class CppComposable(CodeComposable):

    def new(self):
        return self.__class__(self.meta)

    def __init__(self, meta):
        CodeComposable.__init__(meta)

    def append(self, newComposable, newPrefix):
        pass

    def attach(self, fromPort, toPort, kwargs):
        pass

    def makeOutput(self, filedir, **kwargs):
        pass