import React from 'react'
import ListOfThings from './listOfThings'

class ParameterFieldList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.getParameterVals = this.getParameterVals.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.scObj = props.scObj;
  }

  componentDidMount() {
    for (var param in this.scObj.parameters) {
      this.setState({
        [param]: this.scObj.solved[param]
      });
    }
  }

  getParameterVals() {
    // TODO: verify input values are valid
    return this.state;
  }

  handleChange(event) {
    event.stopPropagation();
    var target = event.target;
    var name = target.name;

    this.setState({
      [name]: target.value
    }, () => {
        console.log('currentState', this.state);
    });
  }

  render() {
    const {
      scObj,
      inputEnabled,
      inputRef,
      parameterListClassName
    } = this.props;

    // store all the inputFields in parameterList so that values of inputFields
    // can be retrieved when the form is submitted
    return (
      <ListOfThings listType='regular' elementName='parameter' elementClassName='parameterField'
        listClassName={parameterListClassName} elementStyle={{listStyleType: 'none outside none', margin:0, padding: 0, float: 'left'}} container='ul'>
        {Object.keys(scObj.parameters).map((k, idx) => {
          return (<li style={{display: 'inline'}} key={"param"+idx}>
            <label>{k}</label>
            {(!inputEnabled) ? <label>{'->'+this.state[k]}</label> : <input type="text" name={k} size={4}
            value={this.state[k]} onChange={this.handleChange} />}
          </li>);
        })}
      </ListOfThings>
    );
  }
}

export default ParameterFieldList
