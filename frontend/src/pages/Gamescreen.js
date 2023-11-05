import Canvas from "./components/Canvas";
import Chat from "./components/Chat";
import Onlineusers from "./components/Onlineusers";
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
