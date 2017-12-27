/*
RocoComponent2D component manages rendering of svg
*/

import React from 'react'

export default class Roco2DComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // console.log('rawSVG', this.state.rawSVG)
    // var parser = new DOMParser();
    // this.setState({parsedSVG: parser.parseFromString(this.state.rawSVG.__html, "image/svg+xml")}, () => {
    //   console.log('parsedSVG', this.state.parsedSVG)
    // });
  }

  render() {
    const {
      svg
    } = this.props;

    // calculate viewBox dimensions
    // NOTE: take max and min of x vertices to determine width of
    // viewBox (perserveAspectRatio, so don't need to set the height)
    var xVertices = []
    Object.keys(svg).map((scName) => {
      svg[scName].map((line) => {
        xVertices.push(parseInt(line.attributes.x1.value))
        xVertices.push(parseInt(line.attributes.x2.value))
      })
    })

    var xDim = Math.max(...xVertices) - Math.min(...xVertices)

    // NOTE: meetOrSlice property controls the enlarging behavior of the SVG
    //       might add perserveAspectRatio="xMidYMid meet" when the length of
    //       the design in x-direction is greater than the container
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink" baseProfile="full" height="100%" version="1.1"
      width="100%" viewBox={"0 0 "+xDim.toString()+" 40"}>
        {Object.keys(svg).map((scName) => {
          return (
            <g className={scName}>
              {svg[scName].map((line) => {
                const {
                  x1,
                  x2,
                  y1,
                  y2,
                  id
                } = line.attributes;
                return (<line stroke="#ff0000" id={id.value}
                  x1={x1.value} x2={x2.value} y1={y1.value} y2={y2.value}></line>)
              })}
            </g>
          )
        })}
      </svg>
    )
  }
}
