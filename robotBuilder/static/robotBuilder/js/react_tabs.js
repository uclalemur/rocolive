import {Component} from 'react'

class Tab extends Component {
  constructor() {
    var {
      type,       // tab type (e.g. mechanical, base, or composite)
      name,       // name of tab
      tabNum      // tab number
    } = this.props;
  }

  render() {

    return (<div id={this.props.type+this.props.tabNum} className="tabcontent">
      <button className="tablinks" innerHTML={this.props.name}>
        Button 1
      </button>
    </div>);
  }
}

export default class Tab
