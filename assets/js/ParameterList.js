import React from 'react'
import ListOfThings from './listOfThings'

class ParameterFieldList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      scObj,
      inputEnabled
    } = this.props;

    return (
      <ListOfThings listType='regular' elementName='parameter' elementClassName='parameterField'
        listClassName='parameterList' container='ul'>
        {Object.keys(scObj.parameters).map((k) => {
          return (<ParameterField inputEnabled={inputEnabled} paramKey={k} paramVal={scObj.solved[k]}/>);
        })}
      </ListOfThings>
    );
  }
}

class ParameterField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paramVal: props.paramVal
    }
  }

  parseValue() {
    // call when upon submitting (only for parameterFields with input enabled)
  }

  handleChange(event) {
    this.setState({paramVal: event.target.value});
  }

  render() {
    let {
      paramKey,
      inputEnabled
    } = this.props;

    let {
      paramVal
    } = this.state;
    // root layer
    // if (layer == 0) {

    return (
      <li>
        <span>
          <label>{paramKey}</label>
          {(!inputEnabled) ? <label>{'->'+paramVal}</label> : <input type="text" value={paramVal} onChange={this.handleChange} />}
        </span>
      </li>

      //
      //     {Object.keys(obj.parameters).map((p, idx) => {
      //       let inputField = null;
      //       if (enableInput)
      //         inputField = <input type="text" value={this.state.value} onChange={() => this.handleChange} />
      //
      //       return (
      //         <a href={"#item-"+idx} className="list-group-item">
      //           {p}<i className="glyphicon glyphicon-chevron-right"></i>{obj.solved[p]}
      //         </a>
      //       )
      //     })}

    );
  }
}

export default ParameterFieldList
