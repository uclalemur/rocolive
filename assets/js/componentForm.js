import React from 'react'

/*
ComponentForm:
  props:
    sucomponents parameters to list

*/

export default class ComponentForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {
      scObj,
      formType
    } = this.props;

    if (formType == 'mousemove') {
      return (
        <div>
          <h3>
            {scObj.className+": "+scObj.name}
          </h3>
            {scObj.parameters.map(param) {
              return (<p>
                {param+": "+scObj.solved[param]}
              </p>)
            }}
        </div>
      )
    } else if (formType == 'mouseclick') {
      return (
        <form action='POST' >
          <h3>
            {scObj.className+": "+scObj.name}
          </h3>
          {scObj.parameters.map(param) {
            return (
              <div>
                <p>
                  {param+": "+scObj.solved[param]}
                </p>
                <input type='text'/>
              </div>
              );
          }}
          <input type='button' />
        </form>
      )
    } else {
      console.log('invalid formType');
    }
  }
}
