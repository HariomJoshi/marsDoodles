import React from "react";

function OptionBar({
  onColorChange,
  onLineWidthChange,
  onLineDashChange,
  socket,
  roomId,
}) {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    justifyContent: "flex-start",
    // alignItems: "center",
    border: "2px solid black",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    width: "100%",
    height: "100%",
  };

  const labelInputContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: "5px",
  };

  const labelStyle = {
    marginRight: "10px",
  };

  const inputStyle = {
    display: "flex",
    padding: "5px",
    fontSize: "16px",
    width: "20%",
  };

  const buttonStyle = {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
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
