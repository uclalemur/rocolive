import React from 'react'
import ParameterList from './ParameterList'
/*
Popups
  props:
    1. subcomponent data to render
    2. popup ids, className

  renders:
    popup showing parameters, allowing user
    to edit if popup is triggered by mouse
    click.
*/

// TODO: generalize styling of popups

const hoverPopUpStyle = {
  nameColor: '#fff',
  scParameterColor: '#1E90FF',
  compParameterColor: 'FF0000',
  backgroundColor: '#555'
}

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

export default class PopUp extends React.Component {
  constructor(props) {
    super(props);
  }

  findNodePath(node) {
      var nodePath = [];
      while (node.type != 'Scene') {
        nodePath.push(node.name);
        node = node.parent;
      }

      return [nodePath.reverse()];
  }

  /* recursively build the hierarchy */
  // hierarchicalTree(startNode, nodePath, endNode) {
  //   console.log(startNode, nodePath, endNode)
  //     return (
  //       <ParameterList currentNode={startNode} nodePath={nodePath} endNode={endNode} layer={0} />
  //     );
  // }

  // submit popup with popup id: when constraining parameters,
  // the current interface id, the subcomponentName, the parameter
  // name, and the new values are passed.
  // submitPopUp() {
  //   var {
  //     interfaceName,
  //     scObj
  //   }
  //
  //   for (param in scObj.params) {
  //       constrainParameter(interfaceName, scObj.name, param, scObj.solved[param]);
  //   }
  // }

// popupType could be for hover or click
  render() {
    var {
      popUpClass,
      popupType,
      scObj,
      x,
      y,
      compParams
    } = this.props;

    var {
      nameColor,
      scParameterColor,
      compParameterColor,
      backgroundColor
    } = hoverPopUpStyle

    // recursively show hierarchical tree
    if (popupType == 'hover') {
      if (scObj.type == 'Line') {
        return (
          <div className="card" backgroundColor={backgroundColor}>
            <h4 style={{color: nameColor}}>{scObj.name}</h4>
          </div>
        )
      }
      return (
        <div className="card" backgroundColor={backgroundColor}>
          {this.findNodePath(scObj).join('-->')}
          <ParameterList obj={scObj} layer={0} />
        </div>
      );
    } else {
      return (
        <div className="card"></div>
      )
    }
  }
}



// {Object.keys(compParams).map((p) => {
//   return (<p style={{color: compParameterColor, leftMargin: 5}}>  {"  {0}->{1}".format(p,compParams[p])}</p>)
// })}
//
// {Object.keys(scObj.parameters).map((p) => {
//   return (<p style={{color: scParameterColor, leftMargin: 5}}>    {"     {0}->{1}".format(p,scObj.solved[p])}</p>)
// })}



// <h4>Parameter List</h4>
//   <ParameterList keys={sc.paramUsed} values={parameters}
//     paramListClassName='parameterList' paramListElementClassNam='param' />
