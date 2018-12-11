import React from 'react';

export const sketchpadState = {
  sayHi: 'hiiiiii',
  sayBye: 'byeeeee',
  sayHiChecker: true,
  sayByeChecker: false,
  isTouchDevice: undefined,
  canvasStatus: false,
  activateCanvas: () => { },
  viewportSize: { width: 0, height: 0 },
  downloadSketch: () => {}
}

export const SketchpadContext = React.createContext(sketchpadState);
