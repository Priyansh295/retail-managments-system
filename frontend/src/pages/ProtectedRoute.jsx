import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export const ProtectedRouteClient = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    console.log("Client not logged in.");
    console.log(currentUser);
    return <Navigate to="/login" />;
  } else {
    console.log("Client logged in:", currentUser);
    return children;
  }
};

export const ProtectedRouteAdmin = ({ children }) => {
  const { admin } = useContext(AuthContext);
  if (!admin) {
    console.log("Admin not logged in.");
    console.log(admin);
    return <Navigate to="/login" />;
  } else {
    console.log("Admin logged in:", admin);
    return children;
  }
};

export const ProtectedRouteEmployee = ({ children }) => {
  const { employee } = useContext(AuthContext);
  if (!employee) {
    console.log("Employee not logged in.");
    console.log(employee);
    return <Navigate to="/login" />;
  } else {
    console.log("Employee logged in:", employee);
    return children;
  }
};
