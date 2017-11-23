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
      <div>
        {this.props.subcomponents.map((sc, idx) => {
          return (
            <div key={'popup'+idx} className="card" onClick={this.popUpClicked.bind(this, idx)}>
              <h3>{sc.scname}</h3>
              <h4>Parameter List</h4>
                <ParameterList keys={sc.paramUsed} values={parameters}
                  paramListClassName='parameterList' paramListElementClassNam='param' />
              <h4>Subcomponent Parameter List</h4>
                <ParameterList keys={Object.keys(sc.scparams)} values={sc.scparams}
                  paramListClassName='scParameterList' paramListElementClassNam='scparam' />
            </div>
          )
        })}
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
