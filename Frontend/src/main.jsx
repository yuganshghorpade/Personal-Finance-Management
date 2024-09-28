import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { NextUIProvider } from "@nextui-org/react";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import VerifyUser from "./pages/VerifyUser";
import MyProfile from "./pages/Dashboard";
import Events from "./pages/Events";
import SingleEvent from "./pages/SingleEvent";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path:"/",
        element: <Home />
      },
      {
        path:"/login",
        element: <Login />
      },
      {
        path:"/register",
        element: <Signup />
      },
      {
        path:"/verify/:username",
        element: <VerifyUser />
      },
      {
        path:"/dashboard",
        element: <MyProfile />
      },
      {
        path:"/events",
        element: <Events />
      },
      {
        path:"/event",
        element: <SingleEvent />
      },
      {
        path:"/profile",
        element: <Profile />
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider >
    <RouterProvider router={router} />
    <Toaster />
    </NextUIProvider>
  </StrictMode>
);
