import React from 'react';

function OptionBar({ onColorChange, onLineWidthChange, onLineDashChange, onApplyOptions }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid black',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px',
  };

  const labelInputContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };

  const labelStyle = {
    marginRight: '10px',
  };

  const inputStyle = {
    padding: '5px',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={labelInputContainerStyle}>
        <label style={labelStyle}>Line Width:</label>
        <input
          style={inputStyle}
          type="number"
          min="1"
          onChange={(e) => onLineWidthChange(Number(e.target.value))}
        />
      </div>
      <div style={labelInputContainerStyle}>
        <label style={labelStyle}>Line Color:</label>
        <input
          style={inputStyle}
          type="color"
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
      <div style={labelInputContainerStyle}>
        <label style={labelStyle}>Line Dash:</label>
        <input
          style={inputStyle}
          type="text"
          onChange={(e) => onLineDashChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default OptionBar;