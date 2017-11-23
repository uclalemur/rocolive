import React from 'react'

export default class ParameterList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {
      keys,
      values,
      paramListClassName,
      paramListElementClassName,
      paramElementKey
    } = this.props;

    return (
      <div className={paramListClassName}>
        {
          keys.map((k, idx) => {
          return (<p key={{paramListElementClassName}+idx} className={paramListElementClassName}>{k+'-->'+values[k].toString()}</p>);
        })}
      </div>
    )
  }
}
