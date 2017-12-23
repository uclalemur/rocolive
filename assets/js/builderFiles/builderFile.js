'use strict';
var fs = require('file-system');
/*
This class object manages the builderFile of a component

Basic functionalities:
  - record the steps taken to make a component
  - retain subcomponent parameters and replace them with updated values
    in builderFile after constraints are solved and passed back from roco
  - TODO: allow partial renderinging

Notes:
  1. Generated builderFile follows the name format of
    COMPONENTNAME_COMPID
  2. There are two kinds of builderFiles
    > Ordered BuilderFile:
      Ordered BuilderFile gather operations on a subComponent so that it is easier
      to do operations, such as copying. It complies with the constraint that its
      result is the same as the normal builderFile (one that records every step taken
      to make a component)
    > reversed Builderfile:
      contains the reverse operation that user did on a component to make it easy
      to reverse an operation on the component.
*/

class BuilderFileController {
  constructor(compId, compName) {
    this.compId = compId
    this.compName = compName
    this.builderFile = compName+"_"+compId

    // buffer stores the steps that it takes to build the component
    this.buffer = []
    this.subcomponents = {}

    // keep current line number of builderfile
    this.lineNo = 1
  }

  // flush() writes the steps stored in buffer to file when user builds component
  flush(callback) {
    var content = this.buffer.join('\n')

    console.log('writetofile: ', this.buffer);
    // fs.writeFile(this.builderFile, content, callback);
  }

  // appendToBuilderFile(line, callback) {
  //   // append to file. If it is an addSubcomponent line mark the line number
  //   fs.writeFile(this.builderFile, line+'\n', () => {
  //     console.log('appended ')
  //   })
  // }

  addToBuffer(instruction) {
    console.log('add to buffer', instruction)
    instruction.replace('id', this.compId).replace('record', 'false');

    this.buffer.push(instruction);
  }

  addSubcomponent(subComponent) {
    this.subcomponents[subComponent.name] = subComponent;

    // add to ordered builderFile and store the line number where the subComponent
    // is created. TODO: partial ordering of builderFile
    console.log('subcomponents', this.subcomponents);
  }

  updateSubcomponentParameters(resolvedComponent) {
    Object.keys(resolvedComponent.solved).map((scParam) => {
      let _ = scParam.split('_')
      let scName = _[0]
      let param = _[1]

      this.subComponents[scName][param] = resolvedComponent.solved[scParam]
    });

    // updateBuilderFile()
  }


  updateBuilderFile() {

  }



  orderBuilderFile() {

  }
}

export {BuilderFileController}
