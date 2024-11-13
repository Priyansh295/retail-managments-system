// import React, { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  // Route,
  // Navigate,
} from "react-router-dom";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Add from "./pages/Add";
import Update from "./pages/Update";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import Client from "./pages/Client";
import Order from "./pages/OrderConfirmation"
import Admin from "./pages/Admin";
import NavbarAdmin from "./components/NavbarAdmin";
import NavbarClient from "./components/NavbarClient";
import { ProtectedRouteAdmin, ProtectedRouteClient, ProtectedRouteEmployee} from "./pages/ProtectedRoute";
import Statistics from "./pages/Statistics";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ClientUpdate from "./pages/ClientUpdate"
import AddAdmin from "./pages/AddAdmin";
import EmployeePage from "./pages/EmployeePage";
import "./App.scss"
import "./styles/BodyStyle.css"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const LayoutClient = () => {
  return (
      <ProtectedRouteClient>
        <NavbarClient/>
        <Outlet />
      </ProtectedRouteClient>
  );
};

const LayoutAdmin = () => {
  return (
      <ProtectedRouteAdmin>
        <NavbarAdmin/>
        <Outlet />
      </ProtectedRouteAdmin>
  );
};

const LayoutEmployee = () => {
  return (
      <ProtectedRouteEmployee>
        <NavbarClient/>
        <Outlet />
      </ProtectedRouteEmployee>
  );
};

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element:<LoginPage/>
        },
        {
          path: "/register",
          element:<RegisterPage/>
        },
      ],
    },
    {
      path: "/",
      element: <LayoutClient/>,
      children: [
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/products/cart",
            element:<Cart/>
          },
          {
            path: "products/order",
            element:<Order/>
          },
          {
            path: "/client",
            element:<Client/>
          },
          {
            path: "/client-details",
            element:<ClientUpdate/>
          }
        ]
    },
    {
      path: "/",
      element: <LayoutAdmin/>,
      children: [
          {
            path: "/viewproducts",
            element: <Products />,
          },
          {
            path: "/products/add",
            element:<Add/>
          },
          {
            path: "/products/update",
            element:<Update/>
          },
          {
            path: "/admin",
            element:<Admin/>
          },
          {
            path: "/stats",
            element:<Statistics/>
          },
          {
            path: "/admin_orders",
            element:<AdminOrdersPage/>
          },
          {
            path: "/admin-details",
            element:<AddAdmin/>
          }
        ]
    },
    {
      path: "/",
      element: <LayoutEmployee />, // Employee layout
      children: [
        {
          path: "/employee",
          element: <EmployeePage />, // Employee dashboard
        },
      ],
    },
])


function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
