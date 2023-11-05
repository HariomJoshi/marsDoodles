import { useRef, useEffect, useState } from "react";

function Canvas(){
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [visible, setVisible] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        ctxRef.current = canvas.getContext('2d');
    })
    
    function onMouseDown(e){
        setVisible(true);
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(e.clientX,e.clientY);
    }   

    function onMouseUp(e){
        setVisible(false);
        ctxRef.current.closePath();
    }

    function onMouseMove(e){
        if(visible){
            ctxRef.current.lineTo(e.clientX,e.clientY);
            ctxRef.current.stroke();
        }
    }

    return(
        <div>
            <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} onMouseUp={onMouseUp} onMouseDown={onMouseDown} onMouseMove={onMouseMove}/>
        </div>
    )
}

export default Canvas;
