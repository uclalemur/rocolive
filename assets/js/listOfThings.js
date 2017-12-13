/* ListOfThings Component generator
  a general list Component to facilitate the implementation of components
  that resemble list of some other components.
  params:
    ElementType
    callbacks
    display
*/

import React, {Component} from 'react'

// TODO: generalize ListOfThings that is currently used for navbar
export default class ListOfThings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      listName,
      listStyle,
      listClassName
    } = this.props;

    return (
      <ul id={"#"+listName} className={listClassName}>
        {this.props.children}
      </ul>
    );
  }
}
