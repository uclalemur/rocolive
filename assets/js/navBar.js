import React, {Component} from 'react'
import NavTab from './navTab'
// import ListOfThings from './listOfThings'
// import '../../robotBuilder/static/robotBuilder/css/bootstrap.min.css'

export default class navBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      interfaces: []
    }
  }
  addInterface() {
    var newInterface = window.prompt("Name for new mechanical interface");

    // TODO: check interface name
    this.setState({interfaces: [this.state.interfaces, newInterface]});
    console.log(this.state);
  }

  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <a className="navbar-brand" href="#">Hidden brand</a>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>


    )
  }
}


/*
<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
  <button className="btn btn-default" onClick={this.addInterface.bind(this)}><i className="fa fa-plus"></i></button>
  {this.state.interfaces.map((_interface) => {
    return (<NavTab name={_interface}/>);
  })}
</nav>*/
