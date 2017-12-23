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

    this.state = {
      value: ''
    }

    this.submitPopUp = this.submitPopUp.bind(this);
    this.inputFields = {}
  }

  componentDidMount() {
    $( ".draggable" ).draggable();
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
  submitPopUp() {
    event.preventDefault();
    var {
      compId,
      scObj
    } = this.props;

    let keyVals = this.refs.parameterList.getParameterVals()
    let newKeyVals = Object.keys(keyVals)
          .filter(key => keyVals[key] != scObj.solved[key])
          .reduce((res, key) => {
            res[key] = keyVals[key]
            return res;
          }, {})
    this.props.constrainParameter(compId, scObj.name, newKeyVals, true)

    this.props.removePopUp(this.props.scObj.name);
  }

  // popupType could be for hover or click
  render() {
    let {
      popupClass,
      popupType,
      popupStyle,
      scObj,
      x,
      y,
      compParams
    } = this.props;

    let {
      nameColor,
      scParameterColor,
      compParameterColor,
      backgroundColor
    } = hoverPopUpStyle

    if (scObj.type == 'Line') {
      return (<div></div>);
    }
    // recursively show hierarchical tree
    if (popupType == 'hover') {
      return (
        <div className="card" style={{'z-index': 10}}>
          {this.findNodePath(scObj).join('-->')}
          <ParameterList inputEnabled={false} scObj={scObj} />
        </div>
      );
    } else {
      return (
        <div className={"card draggable"} style={{position: 'absolute', top: 50, right: 100, opacity: 1, 'z-index': 10}}>
          <h4>{scObj.name}</h4>
          <form onSubmit={this.submitPopUp}>
            <ParameterList ref="parameterList" inputEnabled={true} scObj={scObj} />
            <input className="btn btn-secondary" type='submit' onClick={this.submitPopUp} value='Submit' />
          </form>
        </div>
      )
    }
  }
}
