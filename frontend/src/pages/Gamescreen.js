import React, { useState } from 'react';
import Canvas from './components/Canvas'
import Chat from './components/Chat';
import OptionBar from './components/OptionBar';
import Onlineusers from './components/Onlineusers';

function Gamescreen() {

  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedLineWidth, setSelectedLineWidth] = useState(2);
  const [selectedLineDash, setSelectedLineDash] = useState('');

  return (
    <div className="gamescreen-container">
      <div className="canvas-and-chatroom-container">
        <OptionBar
          selectedColor={selectedColor}
          selectedLineWidth={selectedLineWidth}
          selectedLineDash={selectedLineDash}
          onColorChange={(color) => setSelectedColor(color)}
          onLineWidthChange={(width) => setSelectedLineWidth(width)}
          onLineDashChange={(dash) => setSelectedLineDash(dash)}
          // onApplyOptions={applySelectedOptions}
        />
        <Canvas
          selectedColor={selectedColor}
          selectedLineWidth={selectedLineWidth}
          selectedLineDash={selectedLineDash}
        />
        <Chat />
      </div>
      <div className="online-users-container">
        <Onlineusers />
      </div>
    </div>
  );
}

export default Gamescreen;
