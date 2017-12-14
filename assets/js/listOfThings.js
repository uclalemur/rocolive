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

    // maybe queues, stacks...
    this.type = props.listType;
  }

  componentDidUpdate(prevProps, prevState) {
    // keep track of element positions
  }

  render() {
    const {
      listClassName,
      elementName,
      elementStyle,
      elementClassName,
      children,
      position,
      container
    } = this.props;

    var propsObj = {};
    var styleName = elementName+"Style";
    var className = elementName+"Class";
    propsObj[styleName] = elementStyle;
    propsObj[className] = elementClassName;

    var childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, propsObj));

      if (container=='div') {
        return (
          <div className={listClassName}>
            {childrenWithProps}
          </div>
        );
      } else if (container=='ul') {
        return (
          <ul className={listClassName}>
            {childrenWithProps}
          </ul>
        );
      } else {
        return (
          {childrenWithProps}
        )
      }

  }
}
