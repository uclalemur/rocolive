/*
popup List Component containing popups

popupList (inheriting from ComponentListWrapper)
  props:
    List of popups to render,
    ComponentListName,
    ComponentListStyle
    formType
    scObj
  other props:
    function calls bind to each popup
*/
import React from 'react'
import ParameterList from './ParameterList'
// import ComponentListWrapper from './componentListWrapper'
// import PopUp from './popup'

export default class PopUpList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.parameters)
  }

  popUpClicked(id) {
    console.log(id)
  }

  render() {
    var {
      parameters
    } = this.props;

    return (
      <div className="col-md-3" id="left-panel">
        <div>
          {this.props.subcomponents.map((sc, idx) => {
            return (

            )
          })}
        </div>
    </div>)
  }
}


// export default class PopUpList extends ComponentListWrapper {
//   constructor(props) {
//     super(props);
//   }
//
//   // overriding method
//   fillComponentList() {
//     return this.props.popupList.map((popup) => {
//       return (
//         <div>
//           <PopUp {...this.props} >
//           </PopUp>
//         </div>
//       );
//     });
//   }
//
//   render() {
//     return super.render();
//   }
// }
