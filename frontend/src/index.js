import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Gamescreen from "./pages/Gamescreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import Chat from "./pages/components/Chat";
import ChatProvider from "./context/ChatProvider";
import Canvas from "./pages/components/Canvas";

// all the paths need to be add here

const router = createBrowserRouter([
  {
    path: "/pages/game-screen/:id",
    element: <Gamescreen />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/gamechats",
    element: <Chat />,
  },
  {
    path: "/canvas",
    element: <Canvas />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>

      <RouterProvider router={router} />
    </React.StrictMode>
);
