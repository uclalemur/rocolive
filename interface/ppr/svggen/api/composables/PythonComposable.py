from CodeComposable import CodeComposable

class PythonComposable(CodeComposable):

    def __init__(self, meta, needs=None):
        CodeComposable.__init__(self, meta, needs)

    def sanitize(self, meta):
        if "." in meta["name"] and len(meta["source"]):
            name = meta["name"].split(".")[1]
            meta["invocation"] = self.replace_name(meta["invocation"], name)
            first_line = meta["source"].split("\n")[0]
            new_first_line = self.replace_name(first_line, name)
            meta["source"] = meta["source"].replace(first_line, new_first_line)
        return meta

    # Make the final output
    def makeOutput(self, filedir, **kwargs):
        CodeComposable.makeOutput(self)

        roots = self.find_roots()
        for root in roots:
            self.replace_tokens(root, self.meta[root])

        filename = "%s/main.py" % filedir
        f = open(filename, "w")

        for include in self.needs:
            f.write("import " + include + "\n")

        f.write("\n")
        f.write(
            "if __name__ == \"__main__\":\n" +\
            "    %s" % "".join([self.meta[root]["invocation"] + "\n" for root in roots]) + \
            "\n")

        for (key, val) in self.meta.iteritems():
            f.write(val["source"] + "\n")

        f.close()

