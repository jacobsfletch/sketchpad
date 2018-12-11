import React, { Component } from 'react';
import { SketchpadContext } from './context';
import { sketchpadState } from './context';

import Sketchpad from './Sketchpad';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ...sketchpadState,
      isTouchDevice: 'ontouchstart' in window,
      activateCanvas: this.activateCanvas
    }
    window.addEventListener('resize', this.measureViewport)
  }
  
  measureViewport = () => {
    this.setState({
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }
  
  activateCanvas = () => {
    this.setState({
      canvasStatus: true
    })
  }
  
  componentDidMount() {
    this.measureViewport();
  }
  
  render() {
    return (
      <SketchpadContext.Provider value={this.state}>
        <Sketchpad />
      </SketchpadContext.Provider>
    )
  }
}

export default App;	