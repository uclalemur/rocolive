/*
Component List Component containing components to be displayed
as list elements.

ComponentList (inheriting from ComponentListWrapper)
  props:
    List of components to render,
    ComponentListName,
    ComponentListStyle
  other props:
    function calls bind to each component
*/
import ComponentListWrapper from './componentListWrapper'

export default class ComponentList extends ComponentListWrapper {
  constructor(props) {
    super(props);
  }

  // overriding method
  fillComponentList() {
    return this.props.componentList.map((c) => {
      return (
        <li>
          {c.name}
        </li>
      );
    });
  }

  render() {
    return super.render();
  }
}
