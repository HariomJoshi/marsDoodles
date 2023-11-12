import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const chatcontext = createContext();

const ChatProvider = (children) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, []);

  return (
    <chatcontext.Provider value={{ user, setUser }}>
      {/* {console.log(children)} */}
      {children}
    </chatcontext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatProvider);
};

export default ChatProvider;
