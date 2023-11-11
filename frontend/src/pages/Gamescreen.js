import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import Canvas from './components/Canvas'
import Chat from './components/Chat';
import './Gamescreen.css'
import OptionBar from './components/OptionBar';
import Onlineusers from './components/Onlineusers';

function Gamescreen() {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedLineWidth, setSelectedLineWidth] = useState(2);
  const [selectedLineDash, setSelectedLineDash] = useState('');

  return (
    <div className="gamescreen-container">
      <h1 className='Main-logo'>bit2byte</h1>
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
      </div>
    );
  }


export default Gamescreen;
