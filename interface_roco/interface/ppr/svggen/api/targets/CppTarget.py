from svggen.api.targets.Target import Target
from re import findall

class Cpp(Target):

    @staticmethod
    def tokenize(label):
        return "<<" + label + ">>"

    @staticmethod
    def detokenize(token):
        return token[2:-2]

    @staticmethod
    def new():
        return {"code": "", "declarations": "", "inputs": {}, "outputs": {}, "needs": set()}

    def __str__(self):
        return "Cpp"

    def getParamsFrom(self, where):
        return [self.detokenize(s) for s in findall("<<[0-9a-zA-Z]+?>>", where)]

    def mangle(self, name):
        self.meta["code"] = self.meta["code"].replace("@@name@@", name)
        self.meta["declarations"] = self.meta["declarations"].replace("@@name@@", name)

        for (key, val) in self.meta["inputs"].iteritems():
            if val is not None:
                nVal = self.meta["inputs"].pop(key).replace("@@name@@", name)
                self.meta["inputs"][key.replace("@@name@@", name)] = nVal
            else:
                self.meta["inputs"][key.replace("@@name@@", name)] = self.meta["inputs"].pop(key)

        for (key, val) in self.meta["outputs"].iteritems():
            if val is not None:
                nVal = self.meta["outputs"].pop(key).replace("@@name@@", name)
                self.meta["outputs"][key.replace("@@name@@", name)] = nVal
            else:
                self.meta["outputs"][key.replace("@@name@@", name)] = self.meta["outputs"].pop(key)

        return self.meta

    def getParameters(self):
        output_parameters = []
        input_parameters = []
        code_parameters = self.getParamsFrom(self.meta["code"])

        for (key, val) in self.meta["inputs"].iteritems():
            input_parameters += self.getParamsFrom(val)

        for (key, val) in self.meta["outputs"].iteritems():
            output_parameters += self.getParamsFrom(val)

        return list(set(output_parameters) | set(input_parameters) | set(code_parameters))

    def append(self, newMeta, newPrefix):
        """"
        if newMeta["code"] and (newMeta["code"] in self.meta["code"]):
            return self.meta

        if self.meta["code"] and (self.meta["code"] in newMeta["code"]):
            return newMeta

        if bool(set(self.meta["inputs"].keys()) & set(newMeta["inputs"].keys())) and \
            bool(set(self.meta["outputs"].keys()) & set(newMeta["outputs"].keys())):
            return self.meta
        """
        pNewLine = "" if not self.meta["code"] else "\n"

        if newMeta["code"]:
            self.meta["code"] += pNewLine + newMeta["code"]

        self.meta["inputs"].update(newMeta["inputs"])
        self.meta["outputs"].update(newMeta["outputs"])
        self.meta["needs"].update(newMeta["needs"])
        self.meta["declarations"] += newMeta["declarations"]
        return self.meta

    def getInputs(self, outputLabel):
        return [self.detokenize(s) for s in findall("<<[0-9a-zA-Z_]+?>>", self.meta["outputs"][outputLabel])]

    def replaceInput(self, outputLabel):
        inputs = self.getInputs(outputLabel)
        for input in inputs:
            if input in self.meta["inputs"] and self.meta["inputs"][input] is not None:
                token = self.tokenize(input)
                sub = self.meta["inputs"][input]
                self.meta["outputs"][outputLabel] = self.meta["outputs"][outputLabel].replace(token, sub)
                self.meta["code"] = self.meta["code"].replace(token, sub)

    def replaceAllInputs(self):
        for outputLabel, outputExpr in self.meta["outputs"].iteritems():
            self.replaceInput(outputLabel)
        for inputToken, inputSub in self.meta["inputs"].iteritems():
            if inputSub is not None:
                token = self.tokenize(inputToken)
                self.meta["code"] = self.meta["code"].replace(token, inputSub)

    def subParameters(self, subs):
        for (token, sub) in subs.iteritems():
            for outputToken, outputExpr in self.meta["outputs"].iteritems():
                self.meta["outputs"][outputToken] = outputExpr.replace(self.tokenize(token), sub)
            self.meta["code"] = self.meta["code"].replace(self.tokenize(token), sub)
        return self.meta

    def attach(self, fromPort, toPort, kwargs):
        inputLabel = toPort.getLabel()
        outputLabel = fromPort.getLabel()

        try:
            # Substitute all in the necessary inputs into the output specified by outputLabel
            self.replaceInput(outputLabel)

            # Substitute output specified by outputLabel into the input specified by inputLabel
            if self.meta["inputs"][inputLabel] is None:
                self.meta["inputs"][inputLabel] = self.meta["outputs"][outputLabel]

            # Substitute all inputs into the appropriate outputs
            self.replaceAllInputs()

            self.meta["inputs"].pop(inputLabel)
            self.meta["outputs"].pop(outputLabel)
        except KeyError:
            pass

        return self.meta

    def makeOutput(self, filedir, **kwargs):
        self.replaceAllInputs()

        filename = "%s/main.cpp" % filedir
        f = open(filename, "w")

        for include in self.meta["needs"]:
            f.write("#include <" + include + ">\n")

        f.write("\n\n")
        f.write(self.meta["declarations"])
        f.write("\n\n")
        f.write(self.meta["code"])

        main = "\nint main()\n" + \
                "{\n" + \
                "   %s\n" % "".join([s + ";\n" for (k,s) in self.meta["outputs"].iteritems() if s]) + \
                "   return 0;\n" + \
                "}\n\n"

        f.write(main)
        f.close()

