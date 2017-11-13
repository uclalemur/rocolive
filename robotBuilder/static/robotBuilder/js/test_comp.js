import React from 'react'

export default class testComponent extends React.Component {
  componentDidMount() {
    console.log('component mounted');
  }
  render() {
    return <div> Hello World </div>;
  }
}
