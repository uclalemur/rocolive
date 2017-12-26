import React from 'react'

export default class SVG extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      svg
    } = this.props;

    return (
      <div className="svgDisplay" dangerouslySetInnerHTML={svg} style={style}>
      </div>
    )
  }
}
