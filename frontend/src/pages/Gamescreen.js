import Canvas from "./components/canvas";
import Chat from "./components/chat";
import Onlineusers from "./components/onlineusers";
function Gamescreen(){
    return(
        <div>
            <b>GAME SCREEN</b>
            <Canvas/>
            <Chat/>
            <Onlineusers/> 
        </div>
    )
}

export default Gamescreen;
