import React from 'react'

export default class ParameterList extends React.Component {
  constructor(props) {
    super(props);
  }

  // findChild(obj, childName) {
  //   for (var i = 0; i < obj.children.length; i++)
  //     if (obj.children[i].name == childName) {
  //       return obj.children[i];
  //     }
  // }

  render() {
      var {
        obj,
        layer
        // paramListClassName,
        // paramListElementClassName,
        // paramElementKey
      } = this.props;

      // root layer
      if (layer == 0) {
        console.log(layer);
        var objName = obj.name;
        var objParams = obj.parameters;
        // if (obj.children) {
        //   // pop the next node to span upon
        //   return (
        //     <div className="list-group list-group-root well">
        //       <div>{objName}</div>
        //       {obj.children.map((c) => {
        //         return (<ParameterList {...this.props} obj={c} layer={layer+1} />)
        //       })}
        //
        //     </div>
        //   );
        // }
        return (
          <div className="list-group list-group-root well">
            <div>{objName}</div>
            <div>
              {Object.keys(obj.parameters).map((p, idx) => {
                return (
                  <a href={"#item-"+idx} className="list-group-item">
                    {p}<i className="glyphicon glyphicon-chevron-right"></i>{obj.solved[p]}
                  </a>
                )
              })}
            </div>
          </div>
        );
      }
    }
  }

// else {
//   console.log('low level currentNode', currentNode);
//   return (
//   <div>
//     {Object.keys(currentNode.parameters).map((p) => {
//        return (<a href="#" class="list-group-item">{p+'-->'+currentNode.solved[p]}</a>);
//     })}
//   </div>
// );



// <div className="list-group collapse" id="item-1"></div>
//
// <a href="#item-1-1" className="list-group-item" data-toggle="collapse">
//   <i className="glyphicon glyphicon-chevron-right"></i>{node.name}
// </a>
// <div className="list-group collapse" id="item-1-1">
//   {Object.keys(node.parameters).map(((p) => {
//     return (<a href="#" className="list-group-item">{p+'-->'+node.solved[p]}</a>)
//   }))}
