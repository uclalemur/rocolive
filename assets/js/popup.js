import React from 'react'
import ComponentForm from './componentForm'

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

export default class PopUp extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  }

  // submit popup with popup id: when constraining parameters,
  // the current interface id, the subcomponentName, the parameter
  // name, and the new values are passed.
  submitPopUp() {
    var {
      interfaceName,
      scObj
    }

    for (param in scObj.params) {
        constrainParameter(interfaceName, scObj.name, param, scObj.solved[param]);
    }
  }

  render() {
    var {
      popUpId,
      popUpClass,
      scObj
    } = this.props;

    return (
      <div id={popUpId} className={popUpClass}>
        <button> </button>  // add icon
        <ComponentForm {...this.props} />
      </div>
    )
  }
}
