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
import { ChakraProvider } from "@chakra-ui/react";
import Chat from "./pages/components/Chat";

// all the paths need to be add here

const router = createBrowserRouter([
  {
    path: "/pages/game-screen",
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>

      <RouterProvider router={router} />
    </React.StrictMode>
  </ChakraProvider>
);
